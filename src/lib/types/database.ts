export type UserRole = 'student' | 'instructor' | 'admin';
export type SquadStatus = 'upcoming' | 'active' | 'completed';
export type LessonType = 'theory' | 'demo' | 'lab' | 'review' | 'mixed';
export type ExerciseType = 'prompt-craft' | 'code-review' | 'free-form' | 'multiple-choice' | 'peer-review';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type SessionType = 'onsite' | 'remote' | 'hybrid' | 'office_hours';

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
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['squads']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['squads']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['weeks']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['weeks']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['lessons']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['exercises']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['exercises']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['lesson_progress']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['lesson_progress']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['exercise_submissions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['exercise_submissions']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['badges']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['badges']['Insert']>;
      };
      student_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: Omit<Database['public']['Tables']['student_badges']['Row'], 'id' | 'earned_at'>;
        Update: Partial<Database['public']['Tables']['student_badges']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['ai_conversations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['ai_conversations']['Insert']>;
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
