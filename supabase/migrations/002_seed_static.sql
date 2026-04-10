-- Worldline AI-First Academy — Static Seed Data
-- Squads and badges that don't change between environments
-- Weeks/lessons/exercises are seeded via the TypeScript script (npm run seed)

-- Squads
INSERT INTO squads (id, name, description, intensive_start, intensive_end, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Squad A', 'Eerste squad — prompt engineering focus', '2026-05-04', '2026-05-08', 'upcoming'),
  ('00000000-0000-0000-0000-000000000002', 'Squad B', 'Tweede squad — context engineering focus', '2026-05-11', '2026-05-15', 'upcoming'),
  ('00000000-0000-0000-0000-000000000003', 'Squad C', 'Derde squad — intent & spec engineering focus', '2026-05-18', '2026-05-22', 'upcoming')
ON CONFLICT DO NOTHING;

-- Badges
INSERT INTO badges (id, name, description, icon, criteria, points_required) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Leadership Pioneer', 'Voltooid Week 1: Management Kickoff', '🏛️', 'Alle lessen van Week 1 voltooid', 0),
  ('10000000-0000-0000-0000-000000000002', 'Prompt Architect', 'Voltooid Week 2: Prompt Engineering Foundations', '✍️', 'Alle lessen van Week 2 voltooid', 0),
  ('10000000-0000-0000-0000-000000000003', 'Prompt Master', 'Voltooid Week 3: Prompt Engineering Advanced', '🎯', 'Alle lessen van Week 3 voltooid', 0),
  ('10000000-0000-0000-0000-000000000004', 'Context Engineer', 'Voltooid Week 4: Context Engineering Foundations', '🧠', 'Alle lessen van Week 4 voltooid', 0),
  ('10000000-0000-0000-0000-000000000005', 'Context Master', 'Voltooid Week 5: Context Engineering Advanced', '🔧', 'Alle lessen van Week 5 voltooid', 0),
  ('10000000-0000-0000-0000-000000000006', 'Intent Engineer', 'Voltooid Week 6: Intent Engineering Foundations', '💡', 'Alle lessen van Week 6 voltooid', 0),
  ('10000000-0000-0000-0000-000000000007', 'Intent Master', 'Voltooid Week 7: Intent Engineering Advanced', '🎭', 'Alle lessen van Week 7 voltooid', 0),
  ('10000000-0000-0000-0000-000000000008', 'Spec Engineer', 'Voltooid Week 8: Specification Engineering', '📐', 'Alle lessen van Week 8 voltooid', 0),
  ('10000000-0000-0000-0000-000000000009', 'Academy Graduate', 'Voltooid het volledige 9-weekse programma', '🎓', 'Alle lessen van Week 9 voltooid', 0),
  ('10000000-0000-0000-0000-000000000010', 'First Steps', 'Eerste les voltooid', '👣', 'Eerste les voltooid', 0),
  ('10000000-0000-0000-0000-000000000011', 'Exercise Champion', '10 oefeningen ingeleverd', '🏆', '10 of meer exercise submissions', 0),
  ('10000000-0000-0000-0000-000000000012', 'Perfect Score', 'Score van 100/100 op een oefening', '💯', 'Score van 100 op een exercise submission', 0)
ON CONFLICT DO NOTHING;
