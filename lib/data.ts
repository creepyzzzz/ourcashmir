
import { createClient } from '@/utils/supabase/client';

export const supabase = createClient();

// --- Types ---
export interface Profile {
    id: string;
    full_name: string;
    email: string;
    role: 'client' | 'admin' | 'staff' | 'influencer';
    avatar_url?: string;
    company?: string;
    status?: 'active' | 'inactive';
}

export interface Client {
    id: string;
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    status: 'active' | 'paused' | 'lead';
    avatar_url: string | null;
    account_manager: string | null;
    total_spent: number;
    joined_date: string;
    user_id?: string;
    instagram?: string;
    website?: string;
}

export interface Project {
    id: string;
    client_id: string;
    title: string;
    status: 'active' | 'completed' | 'paused';
    progress: number;
    start_date: string | null;
    end_date: string | null;
    thumbnail: string | null;
    description: string | null;
    value: number;
}

export interface Invoice {
    id: string;
    client_id: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    due_date: string;
    created_at: string;
    description?: string;
    clients?: { name: string, company: string | null };
}

export interface Lead {
    id: string;
    name: string;
    email: string | null;
    company: string | null;
    status: 'new' | 'contacted' | 'qualified' | 'closed';
    phone: string | null;
    created_at: string;
}

// --- Data Fetching Functions ---

export async function fetchUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) return { ...data, email: user.email }; // mix auth email
    }
    return null;
}

export async function fetchStats() {
    // Aggregation queries
    // In a real optimized app we might use a dedicated RPC or table, but here we can count.

    // Revenue (Sum of paid invoices)
    const { data: revenueData } = await supabase.from('invoices').select('amount').eq('status', 'paid');
    const totalRevenue = revenueData?.reduce((acc: number, curr: { amount: any }) => acc + (Number(curr.amount) || 0), 0) || 0;

    // Active Projects
    const { count: activeProjects } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active');

    // Total Clients
    const { count: totalClients } = await supabase.from('clients').select('*', { count: 'exact', head: true });

    // Pending Approvals (from approvals table)
    const { count: pendingApprovals } = await supabase.from('approvals').select('*', { count: 'exact', head: true }).eq('status', 'pending');

    return {
        totalRevenue,
        activeProjects: activeProjects || 0,
        totalClients: totalClients || 0,
        pendingApprovals: pendingApprovals || 0
    };
}

export async function fetchClients() {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }
    return data as Client[];
}




export async function fetchClientById(id: string) {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching client:', error);
        return null;
    }
    return data as Client;
}

export async function fetchPublicClients() {
    const { data, error } = await supabase
        .from('clients')
        .select('name, avatar_url, instagram, website')
        .eq('status', 'active')
        .order('joined_date', { ascending: false });

    if (error) {
        console.error('Error fetching public clients:', error);
        return [];
    }
    return data as Client[];
}


export async function fetchProjects(clientId?: string) {
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });

    if (clientId) {
        query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    return data as Project[];
}

export async function fetchInvoices(clientId?: string) {
    // We might want to join with clients to get client name
    let query = supabase
        .from('invoices')
        .select('*, clients(name, company)')
        .order('created_at', { ascending: false });

    if (clientId) {
        query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching invoices:', error);
        return [];
    }
    return data;
}

export async function fetchLeads() {
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching leads:', error);
        return [];
    }
    return data as Lead[];
}

export async function fetchTeamMembers() {
    // Assuming profiles with role 'admin' or 'staff' are team members
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'staff'])
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching team:', error);
        return [];
    }
    return data;
}

// ... Additional helper functions for Create/Update can be added as needed by the components directly or here
export async function addNewClient(clientData: Partial<Client>) {
    return await supabase.from('clients').insert(clientData).select().single();
}

export async function createProject(projectData: Partial<Project>) {
    return await supabase.from('projects').insert(projectData).select().single();
}

export async function updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) {
        console.error('Error updating project:', error);
        throw error;
    }
    return data;
}

export async function deleteProject(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}

export async function createInvoice(invoiceData: Partial<Invoice>) {
    return await supabase.from('invoices').insert(invoiceData).select().single();
}


export async function updateClient(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating client:', error);
        throw error;
    }
    return data;
}

export async function deleteClient(id: string) {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) {
        console.error('Error deleting client:', error);
        throw error;
    }
}

export async function createLead(leadData: Partial<Lead>) {
    return await supabase.from('leads').insert(leadData).select().single();
}


export interface ApprovalItem {
    id: string;
    client_id: string;
    project_id?: string;
    title: string;
    type: string;
    status: 'pending' | 'approved' | 'rejected' | 'uploaded';
    thumbnail: string | null;
    file_url?: string;
    description?: string;
    submitted_date: string;
    created_at: string;
    projects?: { title: string };
}

export async function fetchApprovals(clientId?: string) {
    let query = supabase
        .from('approvals')
        .select('*, projects(title)')
        .order('created_at', { ascending: false });

    if (clientId) {
        query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching approvals:', error);
        return [];
    }
    return data as ApprovalItem[];
}

export async function fetchProjectAssets(projectId: string) {
    const { data, error } = await supabase
        .from('approvals')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching project assets:', error);
        return [];
    }
    return data as ApprovalItem[];
}

export async function createAsset(assetData: Partial<ApprovalItem>) {
    return await supabase.from('approvals').insert(assetData).select().single();
}

export async function updateAssetStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    return await supabase.from('approvals').update({ status }).eq('id', id).select().single();
}

export async function deleteAsset(id: string) {
    return await supabase.from('approvals').delete().eq('id', id);
}

export async function uploadFile(file: File, bucket = 'project-assets') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);

    if (error) {
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrl;
}

export interface StatCard {
    title: string;
    value: string;
    change: string;
    icon: any;
}



export interface Report {
    id: string;
    client_id: string;
    project_id: string | null;
    title: string;
    type: string;
    date: string;
    download_url: string | null;
    created_at: string;
}

export async function fetchReports(clientId?: string) {
    let query = supabase.from('reports').select('*').order('date', { ascending: false });

    if (clientId) {
        query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching reports:', error);
        return [];
    }
    return data as Report[];
}


export interface Task {
    id: string;
    project_id: string;
    title: string;
    assignee: string | null;
    due_date: string | null;
    status: 'todo' | 'in-progress' | 'done';
    created_at: string;
}

export interface Message {
    id: string;
    project_id: string | null;
    sender_id: string;
    content: string;
    created_at: string;
    sender?: Profile;
}

// --- Tasks ---

export async function fetchTasks(projectId?: string) {
    let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });

    if (projectId) {
        query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
    return data as Task[];
}

export async function createTask(task: Partial<Task>) {
    return await supabase.from('tasks').insert(task).select().single();
}

export async function updateTaskStatus(taskId: string, status: 'todo' | 'in-progress' | 'done') {
    return await supabase.from('tasks').update({ status }).eq('id', taskId).select().single();
}

// --- Messages ---

export async function fetchMessages(projectId?: string) {
    let query = supabase
        .from('messages')
        .select('*, sender:profiles(id, full_name, avatar_url, role)')
        .order('created_at', { ascending: true });

    if (projectId) {
        query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
    return data as unknown as Message[];
}

export async function sendMessage(message: { content: string, project_id?: string, sender_id: string }) {
    return await supabase.from('messages').insert(message).select().single();
}

export async function fetchProjectById(id: string) {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error) {
        console.error('Error fetching project:', error);
        return null;
    }
    return data as Project;
}
