
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

export async function fetchRevenueHistory() {
    const { data: invoices, error } = await supabase
        .from('invoices')
        .select('amount, created_at')
        .eq('status', 'paid')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching revenue history:', error);
        return [];
    }

    // Aggregate by month
    const monthlyData: { [key: string]: number } = {};

    invoices?.forEach((invoice) => {
        const date = new Date(invoice.created_at);
        const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., "Jan 2024"
        const amount = Number(invoice.amount) || 0;

        if (monthlyData[monthYear]) {
            monthlyData[monthYear] += amount;
        } else {
            monthlyData[monthYear] = amount;
        }
    });

    // Convert to array for Recharts
    const chartData = Object.keys(monthlyData).map(key => ({
        name: key,
        revenue: monthlyData[key]
    }));

    return chartData;
}

export async function fetchClients() {
    // Attempt to join with profiles to get user data if available
    // Using loose join 'profiles' assuming user_id link
    const { data: rawData, error } = await supabase
        .from('clients')
        .select('*, profile:profiles(email, full_name, avatar_url)')
        .order('created_at', { ascending: false });

    if (error) {
        // Fallback to simple select if join fails (e.g. FK issue)
        console.warn('Error fetching clients with profile join, falling back to simple select:', error.message);
        const { data, error: simpleError } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (simpleError) {
            console.error('Error fetching clients:', simpleError);
            return [];
        }
        return data as Client[];
    }

    // Map profile data to client fields if client fields are empty
    // PRIORITIZE profile data as it is user-managed source of truth
    const clients = rawData.map((client: any) => ({
        ...client,
        name: client.profile?.full_name || client.name || 'Unnamed Client',
        email: client.profile?.email || client.email,
        avatar_url: client.profile?.avatar_url || client.avatar_url,
    }));

    return clients as Client[];
}




export async function fetchClientById(id: string) {
    // Join with profiles to get avatar and other details
    const { data: rawData, error } = await supabase
        .from('clients')
        .select('*, profile:profiles(email, full_name, avatar_url)')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching client:', error);
        return null; // Handle error gracefully or via fallback if needed
    }

    // Cast rawData to any to access the joined profile property
    const clientData = rawData as any;

    // Merge logic: prefer profile data over client table data
    const client: Client = {
        ...clientData,
        name: clientData.profile?.full_name || clientData.name || 'Unnamed Client',
        email: clientData.profile?.email || clientData.email,
        avatar_url: clientData.profile?.avatar_url || clientData.avatar_url,
    };

    return client;
}

export async function fetchPublicClients() {
    const { data, error } = await supabase
        .from('clients')
        .select('id, name, avatar_url, instagram, website')
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
    // Fetch profiles and potentially linked client data for avatar fallback
    const { data, error } = await supabase
        .from('profiles')
        .select('*, clients(avatar_url)')
        .in('role', ['admin', 'staff'])
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching team:', error);
        return [];
    }

    // Map to prioritize profile avatar, fallback to client avatar
    return data.map((p: any) => ({
        ...p,
        avatar_url: p.avatar_url || (p.clients && p.clients[0]?.avatar_url) || null
    }));
}

export async function updateProfile(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function searchProfiles(query: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*, clients(avatar_url)')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);

    if (error) {
        console.error('Error searching profiles:', error);
        return [];
    }

    return data.map((p: any) => ({
        ...p,
        avatar_url: p.avatar_url || (p.clients && p.clients[0]?.avatar_url) || null
    })) as Profile[];
}
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

export async function updateInvoice(id: string, updates: Partial<Invoice>) {
    const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating invoice:', error);
        throw error;
    }
    return data;
}

export async function deleteInvoice(id: string) {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) {
        console.error('Error deleting invoice:', error);
        throw error;
    }
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

export async function updateLead(id: string, updates: Partial<Lead>) {
    const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating lead:', error);
        throw error;
    }
    return data;
}

export async function deleteLead(id: string) {
    const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting lead:', error);
        throw error;
    }
}

export async function convertLeadToClient(lead: Lead) {
    // 1. Create Client
    const { data: client, error } = await supabase
        .from('clients')
        .insert({
            name: lead.name,
            company: lead.company,
            email: lead.email,
            phone: lead.phone,
            status: 'active',
            joined_date: new Date().toISOString().split('T')[0], // date format
            total_spent: 0
        })
        .select()
        .single();

    if (error) throw error;

    // 2. Update Lead status to closed
    await updateLead(lead.id, { status: 'closed' });

    return client;
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
    comments?: string;
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

export async function updateAssetStatus(id: string, status: 'pending' | 'approved' | 'rejected', comment?: string) {
    const updates: any = { status };
    if (comment !== undefined) {
        updates.comments = comment;
    }
    return await supabase.from('approvals').update(updates).eq('id', id).select().single();
}

export async function updateAssetComment(id: string, comment: string) {
    return await supabase.from('approvals').update({ comments: comment }).eq('id', id).select().single();
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
    priority?: 'high' | 'medium' | 'low';
    created_at: string;
    projects?: { title: string };
}

export interface Conversation {
    id: string;
    created_at: string;
    updated_at: string;
    last_message_at: string;
    subject?: string;
    status: 'active' | 'archived';
    participants?: { user_id: string, user: Profile }[];
    last_message?: string;
    unread_count?: number;
}

export interface ConversationParticipant {
    conversation_id: string;
    user_id: string;
    last_read_at: string;
    user?: Profile;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    attachments: { name: string, url: string, type: string, size: number }[] | null;
    created_at: string;
    is_read: boolean;
    sender?: Profile;
}

// --- Tasks ---

export async function fetchTasks(projectId?: string) {
    let query = supabase.from('tasks').select('*, projects(title)').order('created_at', { ascending: false });

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
    const { data, error } = await supabase.from('tasks').insert(task).select().single();
    if (error) throw error;
    return data;
}

export async function updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
}

export async function deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
    return true;
}

// Helper for status only (legacy support or specific use)
export async function updateTaskStatus(taskId: string, status: 'todo' | 'in-progress' | 'done') {
    const { data, error } = await supabase.from('tasks').update({ status }).eq('id', taskId).select().single();
    if (error) throw error;
    return data;
}

// --- Reports ---

export async function createReport(reportData: Partial<Report>) {
    const { data, error } = await supabase.from('reports').insert(reportData).select().single();
    if (error) throw error;
    return data;
}

export async function deleteReport(id: string) {
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) throw error;
    return true;
}

// --- Messages ---

export async function fetchConversations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('conversations')
        .select(`
            *,
            participants:conversation_participants(
                user_id,
                last_read_at,
                user:profiles(id, full_name, avatar_url, role)
            )
        `)
        .order('last_message_at', { ascending: false });

    if (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }
    return data as Conversation[];
}

export async function createConversation(participantIds: string[], subject?: string) {
    const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({ subject })
        .select()
        .single();
    if (convError) throw convError;

    const participants = participantIds.map(uid => ({
        conversation_id: conv.id,
        user_id: uid
    }));
    const { error: partError } = await supabase
        .from('conversation_participants')
        .insert(participants);
    if (partError) throw partError;
    return conv;
}

export async function fetchMessages(conversationId: string) {
    const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles(id, full_name, avatar_url, role)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
    return data as Message[];
}

export async function sendMessage(message: {
    conversation_id: string,
    sender_id: string,
    content: string,
    attachments?: any[]
}) {
    // 1. Insert message
    const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();
    if (error) throw error;

    // 2. Update conversation last_message_at
    await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', message.conversation_id);
    return data;
}

export async function markConversationRead(conversationId: string, userId: string) {
    await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .match({ conversation_id: conversationId, user_id: userId });
}

export async function uploadChatAttachment(file: File) {
    return uploadFile(file, 'chat-attachments');
}

export async function fetchProjectById(id: string) {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error) {
        console.error('Error fetching project:', error);
        return null;
    }
    return data as Project;
}
