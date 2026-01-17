export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cases: {
        Row: {
          id: string
          case_id: string
          client_type: string | null
          visa_status: string | null
          employment_type: string | null
          abn_length: string | null
          annual_income: number | null
          taxable_income: number | null
          credit_score: number | null
          credit_issues: string | null
          existing_debts: string | null
          loan_purpose: string | null
          property_type: string | null
          property_location: string | null
          loan_amount: number | null
          lvr: number | null
          deposit_source: string | null
          challenges: string | null
          solution: string | null
          lender: string | null
          product_type: string | null
          approved_amount: number | null
          interest_rate: number | null
          approval_time: string | null
          result: string | null
          key_takeaway: string | null
          tags: string[] | null
          broker_name: string | null
          notes: string | null
          created_at: string
          updated_at: string
          synced_to_dify: boolean
          dify_document_id: string | null
        }
        Insert: {
          id?: string
          case_id: string
          client_type?: string | null
          visa_status?: string | null
          employment_type?: string | null
          abn_length?: string | null
          annual_income?: number | null
          taxable_income?: number | null
          credit_score?: number | null
          credit_issues?: string | null
          existing_debts?: string | null
          loan_purpose?: string | null
          property_type?: string | null
          property_location?: string | null
          loan_amount?: number | null
          lvr?: number | null
          deposit_source?: string | null
          challenges?: string | null
          solution?: string | null
          lender?: string | null
          product_type?: string | null
          approved_amount?: number | null
          interest_rate?: number | null
          approval_time?: string | null
          result?: string | null
          key_takeaway?: string | null
          tags?: string[] | null
          broker_name?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          synced_to_dify?: boolean
          dify_document_id?: string | null
        }
        Update: {
          id?: string
          case_id?: string
          client_type?: string | null
          visa_status?: string | null
          employment_type?: string | null
          abn_length?: string | null
          annual_income?: number | null
          taxable_income?: number | null
          credit_score?: number | null
          credit_issues?: string | null
          existing_debts?: string | null
          loan_purpose?: string | null
          property_type?: string | null
          property_location?: string | null
          loan_amount?: number | null
          lvr?: number | null
          deposit_source?: string | null
          challenges?: string | null
          solution?: string | null
          lender?: string | null
          product_type?: string | null
          approved_amount?: number | null
          interest_rate?: number | null
          approval_time?: string | null
          result?: string | null
          key_takeaway?: string | null
          tags?: string[] | null
          broker_name?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          synced_to_dify?: boolean
          dify_document_id?: string | null
        }
      }
      lender_policies: {
        Row: {
          id: string
          lender_name: string
          category: string
          title: string
          content: string | null
          policy_data: Json | null
          effective_date: string | null
          source: string | null
          version: string | null
          created_at: string
          updated_at: string
          synced_to_dify: boolean
          dify_document_id: string | null
        }
        Insert: {
          id?: string
          lender_name: string
          category: string
          title: string
          content?: string | null
          policy_data?: Json | null
          effective_date?: string | null
          source?: string | null
          version?: string | null
          created_at?: string
          updated_at?: string
          synced_to_dify?: boolean
          dify_document_id?: string | null
        }
        Update: {
          id?: string
          lender_name?: string
          category?: string
          title?: string
          content?: string | null
          policy_data?: Json | null
          effective_date?: string | null
          source?: string | null
          version?: string | null
          created_at?: string
          updated_at?: string
          synced_to_dify?: boolean
          dify_document_id?: string | null
        }
      }
      sync_logs: {
        Row: {
          id: string
          sync_type: string
          record_id: string | null
          record_identifier: string | null
          action: string
          status: string
          error_message: string | null
          dify_document_id: string | null
          synced_at: string
        }
        Insert: {
          id?: string
          sync_type: string
          record_id?: string | null
          record_identifier?: string | null
          action: string
          status: string
          error_message?: string | null
          dify_document_id?: string | null
          synced_at?: string
        }
        Update: {
          id?: string
          sync_type?: string
          record_id?: string | null
          record_identifier?: string | null
          action?: string
          status?: string
          error_message?: string | null
          dify_document_id?: string | null
          synced_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Case = Database['public']['Tables']['cases']['Row']
export type CaseInsert = Database['public']['Tables']['cases']['Insert']
export type CaseUpdate = Database['public']['Tables']['cases']['Update']

export type LenderPolicy = Database['public']['Tables']['lender_policies']['Row']
export type LenderPolicyInsert = Database['public']['Tables']['lender_policies']['Insert']
export type LenderPolicyUpdate = Database['public']['Tables']['lender_policies']['Update']

export type SyncLog = Database['public']['Tables']['sync_logs']['Row']
