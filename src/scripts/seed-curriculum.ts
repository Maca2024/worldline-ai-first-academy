/**
 * Seed script — Worldline AI-First Academy
 *
 * Reads curriculum.ts and seeds Supabase with weeks, lessons, exercises.
 * Run with: npx tsx src/scripts/seed-curriculum.ts
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in .env.local
 *   - npm install dotenv (or use Node 20+ --env-file flag)
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Deterministic UUID from a namespace + name — same input always gives same UUID
function deterministicUuid(name: string): string {
  const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // DNS namespace
  const nsBytes = NAMESPACE.replace(/-/g, '').match(/.{2}/g)!.map(h => parseInt(h, 16));
  const nameBytes = Buffer.from(name, 'utf8');
  const combined = Buffer.from([...nsBytes, ...nameBytes]);
  const hash = crypto.createHash('sha1').update(combined).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50; // version 5
  hash[8] = (hash[8] & 0x3f) | 0x80; // variant
  const hex = hash.toString('hex');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
}

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Validate that credentials are not placeholder values
if (SUPABASE_URL.includes('your-project') || SERVICE_ROLE_KEY.includes('your-service')) {
  console.error('❌ .env.local still contains placeholder Supabase credentials.');
  console.error('   Set real values from your Supabase project dashboard first.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Dynamic import to avoid ESM/CJS issues — curriculum uses ES module syntax
async function loadCurriculum() {
  const mod = await import('../lib/data/curriculum.js');
  return mod.curriculum as import('../lib/data/curriculum').CurriculumWeek[];
}

async function seed() {
  console.log('🌱 Starting curriculum seed...\n');

  const curriculum = await loadCurriculum();
  let totalLessons = 0;
  let totalExercises = 0;

  for (const week of curriculum) {
    console.log(`📅 Week ${week.number}: ${week.title}`);

    // Upsert week
    const { data: weekRow, error: weekErr } = await supabase
      .from('weeks')
      .upsert(
        {
          id: deterministicUuid(`week-${week.number}`),
          number: week.number,
          title: week.title,
          subtitle: week.subtitle,
          description: week.description,
          objectives: week.objectives,
          squad_ids: [],
        },
        { onConflict: 'id' }
      )
      .select('id')
      .single();

    if (weekErr) {
      console.error(`  ❌ Week ${week.number} failed:`, weekErr.message);
      continue;
    }

    const weekId = weekRow.id;

    for (const day of week.days) {
      for (const lesson of day.lessons) {
        totalLessons++;

        const { data: lessonRow, error: lessonErr } = await supabase
          .from('lessons')
          .upsert(
            {
              id: deterministicUuid(lesson.id),
              week_id: weekId,
              day: day.day,
              title: lesson.title,
              type: lesson.type,
              content_md: lesson.content,
              duration_min: lesson.duration,
              order_index: totalLessons,
            },
            { onConflict: 'id' }
          )
          .select('id')
          .single();

        if (lessonErr) {
          console.error(`    ❌ Lesson "${lesson.title}" failed:`, lessonErr.message);
          continue;
        }

        console.log(`  ✓ Day ${day.day}: ${lesson.title}`);

        // Seed exercises for this lesson
        if (lesson.exercises && lesson.exercises.length > 0) {
          for (const exercise of lesson.exercises) {
            totalExercises++;

            const { error: exErr } = await supabase
              .from('exercises')
              .upsert(
                {
                  id: deterministicUuid(exercise.id),
                  lesson_id: lessonRow.id,
                  title: exercise.title,
                  instructions: exercise.instructions,
                  type: exercise.type,
                  difficulty: exercise.difficulty,
                  points: exercise.points,
                  rubric: {},
                },
                { onConflict: 'id' }
              );

            if (exErr) {
              console.error(`      ❌ Exercise "${exercise.title}" failed:`, exErr.message);
            } else {
              console.log(`      ✓ Exercise: ${exercise.title}`);
            }
          }
        }
      }
    }
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   Weeks:     ${curriculum.length}`);
  console.log(`   Lessons:   ${totalLessons}`);
  console.log(`   Exercises: ${totalExercises}`);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
