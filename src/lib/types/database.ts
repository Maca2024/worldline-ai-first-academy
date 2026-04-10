export type UserRole = 'student' | 'instructor' | 'admin';
export type SquadStatus = 'upcoming' | 'active' | 'completed';
export type LessonType = 'theory' | 'demo' | 'lab' | 'review' | 'mixed';
export type ExerciseType = 'prompt-craft' | 'code-review' | 'free-form' | 'multiple-choice' | 'peer-review';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type SessionType = 'onsite' | 'remote' | 'hybrid' | 'office_hours';

// Matches the format that supabase-js v2.99+ (PostgREST v12) expects:
// - Explicit Insert/Update (no self-referential Omit<Database[...]>)
// - Relationships array on each table (required by newer type resolution)
// - CompositeTypes on the schema

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: UserRole;
          squad_id: string | null;
          avatar_url: string | null;
          job_title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: UserRole;
          squad_id?: string | null;
          avatar_url?: string | null;
          job_title?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string;
          role?: UserRole;
          squad_id?: string | null;
          avatar_url?: string | null;
          job_title?: string | null;
        };
        Relationships: [];
      };
      squads: {
        Row: {
          id: string;
          name: string;
          description: string;
          intensive_start: string;
          intensive_end: string;
          status: SquadStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          intensive_start: string;
          intensive_end: string;
          status?: SquadStatus;
        };
        Update: {
          name?: string;
          description?: string;
          intensive_start?: string;
          intensive_end?: string;
          status?: SquadStatus;
        };
        Relationships: [];
      };
      weeks: {
        Row: {
          id: string;
          number: number;
          title: string;
          subtitle: string;
          description: string;
          objectives: string[];
          squad_ids: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          number: number;
          title: string;
          subtitle?: string;
          description?: string;
          objectives?: string[];
          squad_ids?: string[];
        };
        Update: {
          number?: number;
          title?: string;
          subtitle?: string;
          description?: string;
          objectives?: string[];
          squad_ids?: string[];
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          week_id: string;
          day: number;
          title: string;
          type: LessonType;
          content_md: string;
          video_url: string | null;
          duration_min: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          week_id: string;
          day: number;
          title: string;
          type?: LessonType;
          content_md?: string;
          video_url?: string | null;
          duration_min?: number;
          order_index?: number;
        };
        Update: {
          week_id?: string;
          day?: number;
          title?: string;
          type?: LessonType;
          content_md?: string;
          video_url?: string | null;
          duration_min?: number;
          order_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_week_id_fkey';
            columns: ['week_id'];
            referencedRelation: 'weeks';
            referencedColumns: ['id'];
          }
        ];
      };
      exercises: {
        Row: {
          id: string;
          lesson_id: string;
          title: string;
          instructions: string;
          type: ExerciseType;
          difficulty: number;
          points: number;
          rubric: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          title: string;
          instructions?: string;
          type?: ExerciseType;
          difficulty?: number;
          points?: number;
          rubric?: Record<string, unknown>;
        };
        Update: {
          lesson_id?: string;
          title?: string;
          instructions?: string;
          type?: ExerciseType;
          difficulty?: number;
          points?: number;
          rubric?: Record<string, unknown>;
        };
        Relationships: [
          {
            foreignKeyName: 'exercises_lesson_id_fkey';
            columns: ['lesson_id'];
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          }
        ];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: ProgressStatus;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          status?: ProgressStatus;
          completed_at?: string | null;
        };
        Update: {
          status?: ProgressStatus;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_progress_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lesson_progress_lesson_id_fkey';
            columns: ['lesson_id'];
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          }
        ];
      };
      exercise_submissions: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          submission: string;
          score: number | null;
          ai_feedback: Record<string, unknown> | null;
          instructor_feedback: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          submission: string;
          score?: number | null;
          ai_feedback?: Record<string, unknown> | null;
          instructor_feedback?: string | null;
        };
        Update: {
          score?: number | null;
          ai_feedback?: Record<string, unknown> | null;
          instructor_feedback?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_submissions_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_submissions_exercise_id_fkey';
            columns: ['exercise_id'];
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          }
        ];
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          criteria: string;
          points_required: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          icon?: string;
          criteria?: string;
          points_required?: number;
        };
        Update: {
          name?: string;
          description?: string;
          icon?: string;
          criteria?: string;
          points_required?: number;
        };
        Relationships: [];
      };
      student_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: {
          earned_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'student_badges_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_badges_badge_id_fkey';
            columns: ['badge_id'];
            referencedRelation: 'badges';
            referencedColumns: ['id'];
          }
        ];
      };
      sessions: {
        Row: {
          id: string;
          week_id: string;
          day: number;
          type: SessionType;
          location: string;
          start_time: string;
          end_time: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          week_id: string;
          day: number;
          type?: SessionType;
          location?: string;
          start_time: string;
          end_time: string;
          description?: string;
        };
        Update: {
          week_id?: string;
          day?: number;
          type?: SessionType;
          location?: string;
          start_time?: string;
          end_time?: string;
          description?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sessions_week_id_fkey';
            columns: ['week_id'];
            referencedRelation: 'weeks';
            referencedColumns: ['id'];
          }
        ];
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          messages_json: Record<string, unknown>[];
          lesson_context: string | null;
          tokens_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          messages_json?: Record<string, unknown>[];
          lesson_context?: string | null;
          tokens_used?: number;
        };
        Update: {
          messages_json?: Record<string, unknown>[];
          lesson_context?: string | null;
          tokens_used?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_conversations_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      squad_status: SquadStatus;
      lesson_type: LessonType;
      exercise_type: ExerciseType;
      progress_status: ProgressStatus;
      session_type: SessionType;
    };
    CompositeTypes: Record<string, never>;
  };
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Squad = Database['public']['Tables']['squads']['Row'];
export type Week = Database['public']['Tables']['weeks']['Row'];
export type Lesson = Database['public']['Tables']['lessons']['Row'];
export type Exercise = Database['public']['Tables']['exercises']['Row'];
export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];
export type ExerciseSubmission = Database['public']['Tables']['exercise_submissions']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];
export type StudentBadge = Database['public']['Tables']['student_badges']['Row'];
export type Session = Database['public']['Tables']['sessions']['Row'];
export type AiConversation = Database['public']['Tables']['ai_conversations']['Row'];
