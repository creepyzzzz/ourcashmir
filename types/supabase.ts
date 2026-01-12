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
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            approvals: {
                Row: {
                    client_id: string | null
                    comments: string | null
                    created_at: string | null
                    description: string | null
                    file_url: string | null
                    id: string
                    project_id: string | null
                    status: string | null
                    submitted_date: string | null
                    thumbnail: string | null
                    title: string
                    type: string | null
                    updated_at: string | null
                }
                Insert: {
                    client_id?: string | null
                    comments?: string | null
                    created_at?: string | null
                    description?: string | null
                    file_url?: string | null
                    id?: string
                    project_id?: string | null
                    status?: string | null
                    submitted_date?: string | null
                    thumbnail?: string | null
                    title: string
                    type?: string | null
                    updated_at?: string | null
                }
                Update: {
                    client_id?: string | null
                    comments?: string | null
                    created_at?: string | null
                    description?: string | null
                    file_url?: string | null
                    id?: string
                    project_id?: string | null
                    status?: string | null
                    submitted_date?: string | null
                    thumbnail?: string | null
                    title?: string
                    type?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "approvals_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "approvals_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            blog_categories: {
                Row: {
                    created_at: string | null
                    id: string
                    name: string
                    slug: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    name: string
                    slug: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    name?: string
                    slug?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            blog_media: {
                Row: {
                    alt_text: string | null
                    created_at: string | null
                    filename: string
                    id: string
                    size: number | null
                    type: string | null
                    uploaded_by: string | null
                    url: string
                }
                Insert: {
                    alt_text?: string | null
                    created_at?: string | null
                    filename: string
                    id?: string
                    size?: number | null
                    type?: string | null
                    uploaded_by?: string | null
                    url: string
                }
                Update: {
                    alt_text?: string | null
                    created_at?: string | null
                    filename?: string
                    id?: string
                    size?: number | null
                    type?: string | null
                    uploaded_by?: string | null
                    url: string
                }
                Relationships: [
                    {
                        foreignKeyName: "blog_media_uploaded_by_fkey"
                        columns: ["uploaded_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            blog_post_tags: {
                Row: {
                    post_id: string
                    tag_id: string
                }
                Insert: {
                    post_id: string
                    tag_id: string
                }
                Update: {
                    post_id?: string
                    tag_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "blog_post_tags_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "blog_posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "blog_post_tags_tag_id_fkey"
                        columns: ["tag_id"]
                        isOneToOne: false
                        referencedRelation: "blog_tags"
                        referencedColumns: ["id"]
                    },
                ]
            }
            blog_posts: {
                Row: {
                    author_id: string | null
                    category_id: string | null
                    content: string | null
                    cover_image: string | null
                    created_at: string | null
                    excerpt: string | null
                    featured: boolean | null
                    id: string
                    published_at: string | null
                    reading_time_minutes: number | null
                    seo_description: string | null
                    seo_title: string | null
                    slug: string
                    status: string
                    title: string
                    updated_at: string | null
                    view_count: number | null
                }
                Insert: {
                    author_id?: string | null
                    category_id?: string | null
                    content?: string | null
                    cover_image?: string | null
                    created_at?: string | null
                    excerpt?: string | null
                    featured?: boolean | null
                    id?: string
                    published_at?: string | null
                    reading_time_minutes?: number | null
                    seo_description?: string | null
                    seo_title?: string | null
                    slug: string
                    status: string
                    title: string
                    updated_at?: string | null
                    view_count?: number | null
                }
                Update: {
                    author_id?: string | null
                    category_id?: string | null
                    content?: string | null
                    cover_image?: string | null
                    created_at?: string | null
                    excerpt?: string | null
                    featured?: boolean | null
                    id?: string
                    published_at?: string | null
                    reading_time_minutes?: number | null
                    seo_description?: string | null
                    seo_title?: string | null
                    slug?: string
                    status?: string
                    title?: string
                    updated_at?: string | null
                    view_count?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "blog_posts_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "blog_posts_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "blog_categories"
                        referencedColumns: ["id"]
                    },
                ]
            }
            blog_tags: {
                Row: {
                    created_at: string | null
                    id: string
                    name: string
                    slug: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    name: string
                    slug: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    name?: string
                    slug?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            clients: {
                Row: {
                    company: string | null
                    created_at: string | null
                    email: string | null
                    id: string
                    industry: string | null
                    name: string
                    phone: string | null
                    status: string | null
                    updated_at: string | null
                    user_id: string | null
                    website: string | null
                }
                Insert: {
                    company?: string | null
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    industry?: string | null
                    name: string
                    phone?: string | null
                    status?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                    website?: string | null
                }
                Update: {
                    company?: string | null
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    industry?: string | null
                    name?: string
                    phone?: string | null
                    status?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                    website?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "fk_clients_profiles"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            conversation_participants: {
                Row: {
                    conversation_id: string
                    created_at: string | null
                    last_read_at: string | null
                    user_id: string
                }
                Insert: {
                    conversation_id: string
                    created_at?: string | null
                    last_read_at?: string | null
                    user_id: string
                }
                Update: {
                    conversation_id?: string
                    created_at?: string | null
                    last_read_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "conversation_participants_conversation_id_fkey"
                        columns: ["conversation_id"]
                        isOneToOne: false
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "conversation_participants_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            conversations: {
                Row: {
                    created_at: string | null
                    id: string
                    title: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    title?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    title?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            invoices: {
                Row: {
                    amount: number
                    client_id: string | null
                    created_at: string | null
                    due_date: string | null
                    id: string
                    invoice_number: string
                    project_id: string | null
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    amount: number
                    client_id?: string | null
                    created_at?: string | null
                    due_date?: string | null
                    id?: string
                    invoice_number: string
                    project_id?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    amount?: number
                    client_id?: string | null
                    created_at?: string | null
                    due_date?: string | null
                    id?: string
                    invoice_number?: string
                    project_id?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "invoices_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "invoices_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            messages: {
                Row: {
                    attachments: Json | null
                    content: string
                    conversation_id: string | null
                    created_at: string | null
                    id: string
                    is_read: boolean | null
                    sender_id: string | null
                    updated_at: string | null
                }
                Insert: {
                    attachments?: Json | null
                    content: string
                    conversation_id?: string | null
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    sender_id?: string | null
                    updated_at?: string | null
                }
                Update: {
                    attachments?: Json | null
                    content?: string
                    conversation_id?: string | null
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    sender_id?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_conversation_id_fkey"
                        columns: ["conversation_id"]
                        isOneToOne: false
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_sender_id_fkey"
                        columns: ["sender_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    company: string | null
                    created_at: string
                    email: string | null
                    full_name: string | null
                    id: string
                    role: string | null
                    status: string | null
                    updated_at: string
                }
                Insert: {
                    avatar_url?: string | null
                    company?: string | null
                    created_at?: string
                    email?: string | null
                    full_name?: string | null
                    id: string
                    role?: string | null
                    status?: string | null
                    updated_at?: string
                }
                Update: {
                    avatar_url?: string | null
                    company?: string | null
                    created_at?: string
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    role?: string | null
                    status?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            projects: {
                Row: {
                    client_id: string | null
                    created_at: string | null
                    description: string | null
                    end_date: string | null
                    id: string
                    name: string
                    start_date: string | null
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    client_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    end_date?: string | null
                    id?: string
                    name: string
                    start_date?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    client_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    end_date?: string | null
                    id?: string
                    name?: string
                    start_date?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "projects_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tickets: {
                Row: {
                    assignee_id: string | null
                    client_id: string | null
                    created_at: string | null
                    created_by: string | null
                    description: string | null
                    id: string
                    priority: string | null
                    project_id: string | null
                    status: string | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    assignee_id?: string | null
                    client_id?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    priority?: string | null
                    project_id?: string | null
                    status?: string | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    assignee_id?: string | null
                    client_id?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    priority?: string | null
                    project_id?: string | null
                    status?: string | null
                    title: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tickets_assignee_id_fkey"
                        columns: ["assignee_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tickets_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tickets_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tickets_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
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
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: Exclude<keyof Database, '__InternalSupabase'> },
    TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: Exclude<keyof Database, '__InternalSupabase'> },
    TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: Exclude<keyof Database, '__InternalSupabase'> },
    TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: Exclude<keyof Database, '__InternalSupabase'> },
    EnumName extends PublicEnumNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: Exclude<keyof Database, '__InternalSupabase'> },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
