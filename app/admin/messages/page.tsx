'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    Paperclip,
    Search,
    MoreVertical,
    Phone,
    Video,
    Info,
    Plus,
    FileText,
    Image as ImageIcon,
    X
} from 'lucide-react';
import {
    supabase,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markConversationRead,
    uploadChatAttachment,
    fetchClients,
    createConversation,
    Conversation,
    Message,
    Client,
    Profile
} from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminMessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<Profile | null>(null);
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial Load
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Fetch profile
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                setCurrentUser(profile);
            }
            await loadConversations();
            setIsLoading(false);
        };
        init();

        // Realtime subscription for Conversations
        const convSubscription = supabase
            .channel('public:conversations')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
                loadConversations();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(convSubscription);
        };
    }, []);

    // Load messages when active conversation changes
    useEffect(() => {
        if (!activeConversation) return;

        loadMessages(activeConversation.id);
        markRead(activeConversation.id);

        // Realtime subscription for Messages
        const msgSubscription = supabase
            .channel(`chat:${activeConversation.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${activeConversation.id}`
            }, (payload) => {
                const newMsg = payload.new as Message;
                // Fetch sender details to display properly? Or just append if we have partial data
                // For simplicity, we can reload or append. Appending is smoother.
                // We need sender info though.
                fetchMessages(activeConversation.id).then(setMessages);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(msgSubscription);
        };
    }, [activeConversation]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadConversations = async () => {
        const data = await fetchConversations();
        setConversations(data);
    };

    const loadMessages = async (convId: string) => {
        const data = await fetchMessages(convId);
        setMessages(data);
    };

    const markRead = async (convId: string) => {
        if (currentUser) {
            await markConversationRead(convId, currentUser.id);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!inputValue.trim() && !uploadedFiles.length) || !activeConversation || !currentUser) return;

        const content = inputValue;
        setInputValue('');
        const filesToSend = [...uploadedFiles];
        setUploadedFiles([]);

        try {
            await sendMessage({
                conversation_id: activeConversation.id,
                sender_id: currentUser.id,
                content,
                attachments: filesToSend.length > 0 ? filesToSend : undefined
            });
            // Realtime will handle the update
        } catch (error) {
            console.error('Failed to send:', error);
            alert('Failed to send message');
        }
    };

    const [uploadedFiles, setUploadedFiles] = useState<{ name: string, url: string, type: string, size: number }[]>([]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setIsUploading(true);
        const file = e.target.files[0];

        try {
            const url = await uploadChatAttachment(file);
            if (url) {
                setUploadedFiles(prev => [...prev, {
                    name: file.name,
                    url,
                    type: file.type,
                    size: file.size
                }]);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleStartNewChat = async (targetUserId: string) => {
        if (!currentUser || !targetUserId) {
            alert("This client does not have a linked user account or you are not logged in.");
            return;
        }

        // 1. Check if conversation already exists in loaded list
        const existing = conversations.find(c =>
            c.participants?.some(p => p.user_id === targetUserId)
        );

        if (existing) {
            setActiveConversation(existing);
            setIsNewChatModalOpen(false);
            return;
        }

        // 2. Create new conversation
        try {
            const newConv = await createConversation([currentUser.id, targetUserId]);

            // Reload to get full structure with participants
            await loadConversations();

            // Find the new one in the refreshed list
            // We can't rely just on ID immediately if the list is sorted by last_message. 
            // But we can try to find it by ID.
            const reloaded = await fetchConversations();
            const found = reloaded.find(c => c.id === newConv.id);

            if (found) {
                setActiveConversation(found);
            } else {
                // Fallback if not found yet (race condition?), set basic
                // setActiveConversation(newConv as unknown as Conversation);
            }

            setIsNewChatModalOpen(false);
        } catch (error) {
            console.error('Failed to create conversation', error);
            alert("Failed to start conversation. Please try again.");
        }
    };

    const openNewChatModal = async () => {
        const clientsData = await fetchClients();
        setClients(clientsData);
        setIsNewChatModalOpen(true);
    };

    // Derived helpers
    const getOtherParticipant = (conv: Conversation) => {
        if (!currentUser || !conv.participants) return null;
        return conv.participants.find(p => p.user_id !== currentUser.id)?.user;
    };

    const filteredConversations = conversations.filter(c => {
        const other = getOtherParticipant(c);
        if (!other) return false;
        return other.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            other.email?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="h-[calc(100vh-100px)] flex gap-6">
            {/* Sidebar: Conversation List */}
            <div className="w-96 flex flex-col gap-4">
                <div className="bg-brand-surface border border-brand-primary/10 rounded-2xl flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-brand-primary/10 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-brand-white">Messages</h2>
                            <button
                                onClick={openNewChatModal}
                                className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary hover:text-black transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-brand-dark/50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-white placeholder:text-gray-600 focus:ring-1 focus:ring-brand-primary outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {filteredConversations.map(conv => {
                                    const other = getOtherParticipant(conv);
                                    const isActive = activeConversation?.id === conv.id;
                                    return (
                                        <div
                                            key={conv.id}
                                            onClick={() => setActiveConversation(conv)}
                                            className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${isActive ? 'bg-white/5 border-l-2 border-brand-primary' : ''}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden shrink-0">
                                                    {other?.avatar_url ? (
                                                        <img src={other.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-white">
                                                            {other?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <h4 className="font-semibold text-brand-white truncate">{other?.full_name || 'Unknown User'}</h4>
                                                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                                            {new Date(conv.last_message_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {conv.subject || 'No subject'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredConversations.length === 0 && (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        No conversations found.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-brand-surface border border-brand-primary/10 rounded-2xl overflow-hidden flex flex-col">
                {activeConversation ? (
                    <>
                        {/* Header */}
                        <div className="h-20 border-b border-brand-primary/10 flex items-center justify-between px-6 bg-brand-surface/50 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                    {getOtherParticipant(activeConversation)?.avatar_url ? (
                                        <img src={getOtherParticipant(activeConversation)?.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white">
                                            {getOtherParticipant(activeConversation)?.full_name?.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-white text-lg">
                                        {getOtherParticipant(activeConversation)?.full_name || 'Chat'}
                                    </h3>
                                    <p className="text-xs text-brand-primary flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                                        Active Now
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-brand-white hover:bg-white/5 rounded-lg transition-colors">
                                    <Phone size={20} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-brand-white hover:bg-white/5 rounded-lg transition-colors">
                                    <Video size={20} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-brand-white hover:bg-white/5 rounded-lg transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-brand-dark/20">
                            {messages.map((msg, idx) => {
                                const isMe = msg.sender_id === currentUser?.id;
                                const showAvatar = idx === 0 || messages[idx - 1].sender_id !== msg.sender_id;
                                return (
                                    <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        {showAvatar ? (
                                            <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0 overflow-hidden mt-1">
                                                {msg.sender?.avatar_url ? (
                                                    <img src={msg.sender.avatar_url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-white">
                                                        {msg.sender?.full_name?.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-8 shrink-0" />
                                        )}

                                        <div className={`max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            {showAvatar && (
                                                <span className="text-xs text-gray-400 mb-1 px-1">
                                                    {msg.sender?.full_name} &bull; {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}

                                            {/* Text Content */}
                                            {msg.content && (
                                                <div className={`
                                                    px-4 py-3 text-sm rounded-2xl shadow-sm
                                                    ${isMe
                                                        ? 'bg-brand-primary text-black rounded-tr-none'
                                                        : 'bg-white/10 text-brand-white rounded-tl-none'}
                                                `}>
                                                    {msg.content}
                                                </div>
                                            )}

                                            {/* Attachments */}
                                            {msg.attachments && msg.attachments.length > 0 && (
                                                <div className={`mt-2 space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                                    {msg.attachments.map((file, i) => (
                                                        <a
                                                            key={i}
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`
                                                                flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors max-w-xs
                                                                ${isMe ? 'bg-black/20' : 'bg-brand-dark'}
                                                            `}
                                                        >
                                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-brand-primary">
                                                                {file.type.startsWith('image/') ? <ImageIcon size={20} /> : <FileText size={20} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-medium text-brand-white truncate">{file.name}</p>
                                                                <p className="text-[10px] text-gray-500">{Math.round(file.size / 1024)} KB</p>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-brand-surface border-t border-brand-primary/10">
                            {/* File Preview */}
                            {uploadedFiles.length > 0 && (
                                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                                    {uploadedFiles.map((file, i) => (
                                        <div key={i} className="relative group">
                                            <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                                {file.type.startsWith('image/') ? (
                                                    <img src={file.url} className="w-full h-full object-cover opacity-70" />
                                                ) : (
                                                    <FileText className="text-gray-400" size={24} />
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={handleSend} className="flex items-end gap-3">
                                <div className="flex-1 bg-brand-dark/50 border border-white/5 rounded-xl flex items-center p-1.5 focus-within:ring-1 focus-within:ring-brand-primary transition-all">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 text-gray-400 hover:text-brand-white transition-colors"
                                    >
                                        <Paperclip size={20} />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                    />
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={isUploading ? "Uploading..." : "Type a message..."}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-brand-white placeholder:text-gray-600 px-2 outline-none"
                                        disabled={isUploading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={(!inputValue.trim() && !uploadedFiles.length) || isUploading}
                                    className="p-3 bg-brand-primary text-black rounded-xl hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4">
                            <Info size={32} />
                        </div>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>

            {/* New Chat Modal */}
            <AnimatePresence>
                {isNewChatModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsNewChatModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-brand-surface border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-bold text-brand-white">New Message</h3>
                                <button onClick={() => setIsNewChatModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4 max-h-96 overflow-y-auto">
                                <p className="text-sm text-gray-500 mb-3">Select a client to message:</p>
                                <div className="space-y-1">
                                    {clients.map(client => (
                                        <button
                                            key={client.id}
                                            onClick={() => {
                                                const uid = client.user_id; // || client.id? No, must be user_id for auth system
                                                if (uid) {
                                                    handleStartNewChat(uid);
                                                } else {
                                                    alert("This client has no registered user account.");
                                                }
                                            }}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-left"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs">
                                                {client.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-brand-white">{client.name}</p>
                                                <p className="text-xs text-gray-400">{client.company || client.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
