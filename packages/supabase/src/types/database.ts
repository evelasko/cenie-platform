export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_app_access: {
        Row: {
          id: string
          user_id: string
          app_name: string
          role: string
          is_active: boolean
          granted_at: string
          granted_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          app_name: string
          role?: string
          is_active?: boolean
          granted_at?: string
          granted_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          app_name?: string
          role?: string
          is_active?: boolean
          granted_at?: string
          granted_by?: string | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          subscription_id: string
          price_id: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id: string
          price_id: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string
          price_id?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          google_books_id: string
          title: string
          subtitle: string | null
          authors: string[] | null
          published_date: string | null
          language: string | null
          isbn_13: string | null
          isbn_10: string | null
          status: Database['public']['Enums']['book_status']
          translated_title: string | null
          selected_for_translation: boolean
          translation_priority: number | null
          marketability_score: number | null
          relevance_score: number | null
          internal_notes: string | null
          rejection_reason: string | null
          added_by: string | null
          added_at: string
          updated_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          google_books_id: string
          title: string
          subtitle?: string | null
          authors?: string[] | null
          published_date?: string | null
          language?: string | null
          isbn_13?: string | null
          isbn_10?: string | null
          status?: Database['public']['Enums']['book_status']
          translated_title?: string | null
          selected_for_translation?: boolean
          translation_priority?: number | null
          marketability_score?: number | null
          relevance_score?: number | null
          internal_notes?: string | null
          rejection_reason?: string | null
          added_by?: string | null
          added_at?: string
          updated_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          google_books_id?: string
          title?: string
          subtitle?: string | null
          authors?: string[] | null
          published_date?: string | null
          language?: string | null
          isbn_13?: string | null
          isbn_10?: string | null
          status?: Database['public']['Enums']['book_status']
          translated_title?: string | null
          selected_for_translation?: boolean
          translation_priority?: number | null
          marketability_score?: number | null
          relevance_score?: number | null
          internal_notes?: string | null
          rejection_reason?: string | null
          added_by?: string | null
          added_at?: string
          updated_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      book_tags: {
        Row: {
          id: string
          book_id: string
          tag: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          tag: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          tag?: string
          created_at?: string
        }
      }
      book_reviews: {
        Row: {
          id: string
          book_id: string
          reviewer_id: string
          rating: number | null
          review_text: string | null
          recommendation: Database['public']['Enums']['review_recommendation'] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          reviewer_id: string
          rating?: number | null
          review_text?: string | null
          recommendation?: Database['public']['Enums']['review_recommendation'] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          reviewer_id?: string
          rating?: number | null
          review_text?: string | null
          recommendation?: Database['public']['Enums']['review_recommendation'] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_books: {
        Args: {
          search_query: string
          limit_count?: number
        }
        Returns: Database['public']['Tables']['books']['Row'][]
      }
      get_books_by_status: {
        Args: Record<string, never>
        Returns: {
          status: string
          count: number
        }[]
      }
    }
    Enums: {
      app_role: 'admin' | 'user' | 'editor' | 'viewer'
      subscription_status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
      book_status: 'discovered' | 'under_review' | 'selected' | 'in_translation' | 'published' | 'rejected'
      review_recommendation: 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no'
    }
  }
}