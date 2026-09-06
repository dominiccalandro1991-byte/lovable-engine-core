export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      artifacts: {
        Row: {
          created_at: string
          engine: number
          id: string
          meta: Json
          mime: string | null
          name: string
          sha256: string | null
          size_bytes: number
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          engine: number
          id?: string
          meta?: Json
          mime?: string | null
          name: string
          sha256?: string | null
          size_bytes?: number
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          engine?: number
          id?: string
          meta?: Json
          mime?: string | null
          name?: string
          sha256?: string | null
          size_bytes?: number
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      baselines: {
        Row: {
          created_at: string
          id: string
          label: string
          sha256: string
          size_bytes: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          sha256: string
          size_bytes?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          sha256?: string
          size_bytes?: number
          user_id?: string
        }
        Relationships: []
      }
      competitors: {
        Row: {
          created_at: string
          id: string
          is_own: boolean
          motor_type: string
          name: string
          payload_limit_lb: number
          price_usd: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_own?: boolean
          motor_type?: string
          name: string
          payload_limit_lb?: number
          price_usd?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_own?: boolean
          motor_type?: string
          name?: string
          payload_limit_lb?: number
          price_usd?: number
          user_id?: string
        }
        Relationships: []
      }
      deploy_targets: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          region: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          region?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          region?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      engine_config: {
        Row: {
          config: Json
          engine: number
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          engine: number
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          engine?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          created_at: string
          embedding: string | null
          id: string
          ref: string
          remediation: string
          stack: string
          user_id: string
        }
        Insert: {
          created_at?: string
          embedding?: string | null
          id?: string
          ref: string
          remediation?: string
          stack: string
          user_id: string
        }
        Update: {
          created_at?: string
          embedding?: string | null
          id?: string
          ref?: string
          remediation?: string
          stack?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      runs: {
        Row: {
          created_at: string
          duration_ms: number
          engine: number
          id: string
          input: Json
          output: Json
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number
          engine: number
          id?: string
          input?: Json
          output?: Json
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_ms?: number
          engine?: number
          id?: string
          input?: Json
          output?: Json
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      traces: {
        Row: {
          cls: string
          first_seen: string
          freq: number
          hash: string
          id: string
          last_seen: string
          payload: Json
          signature: string
          user_id: string
        }
        Insert: {
          cls?: string
          first_seen?: string
          freq?: number
          hash: string
          id?: string
          last_seen?: string
          payload?: Json
          signature: string
          user_id: string
        }
        Update: {
          cls?: string
          first_seen?: string
          freq?: number
          hash?: string
          id?: string
          last_seen?: string
          payload?: Json
          signature?: string
          user_id?: string
        }
        Relationships: []
      }
      upstream_keys: {
        Row: {
          capacity: number
          ciphertext: string
          created_at: string
          error_count: number
          header_name: string
          header_prefix: string
          id: string
          is_active: boolean
          iv: string
          label: string
          last_refill: string
          refill_per_sec: number
          tokens: number
          upstream_url: string
          user_id: string
        }
        Insert: {
          capacity?: number
          ciphertext: string
          created_at?: string
          error_count?: number
          header_name?: string
          header_prefix?: string
          id?: string
          is_active?: boolean
          iv: string
          label: string
          last_refill?: string
          refill_per_sec?: number
          tokens?: number
          upstream_url: string
          user_id: string
        }
        Update: {
          capacity?: number
          ciphertext?: string
          created_at?: string
          error_count?: number
          header_name?: string
          header_prefix?: string
          id?: string
          is_active?: boolean
          iv?: string
          label?: string
          last_refill?: string
          refill_per_sec?: number
          tokens?: number
          upstream_url?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_endpoints: {
        Row: {
          created_at: string
          secret: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          secret: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          secret?: string
          token?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_incidents: {
        Args: { _embedding: string; _limit?: number }
        Returns: {
          distance: number
          id: string
          ref: string
          remediation: string
          stack: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
