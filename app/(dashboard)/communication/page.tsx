'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    Paperclip,
    Search,
    Phone,
    Video,
    Info,
    FileText,
    Image as ImageIcon,
    X,
    MessageSquarePlus,
    ArrowLeft,
    Menu
} from 'lucide-react';
import {
    supabase,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markConversationRead,
    uploadChatAttachment,
    createConversation,
    Conversation,
    Message,
    Profile
} from '@/lib/data';

export default function CommunicationPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<Profile | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string, url: string, type: string, size: number }[]>([]);
    const [showMobileSidebar, setShowMobileSidebar] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadConversations = async () => {
        const data = await fetchConversations();
        setConversations(data);
        return data;
    };

    // Initial Load
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            let profile = null;
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                profile = data;
                setCurrentUser(data);
            }

            const data = await fetchConversations();
            setConversations(data);

            if (data.length > 0) {
                // Auto-select most recent
                if (!activeConversation) setActiveConversation(data[0]);
            } else if (data.length === 0 && profile) {
                // No conversations, auto-start support chat
                startSupportChat(profile);
            }

            setIsLoading(false);
        };
        init();

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

    const startSupportChat = async (userProfile: Profile) => {
        try {
            const { data: admins } = await supabase.from('profiles').select('id, full_name, avatar_url, role').eq('role', 'admin').limit(1);
            if (admins && admins.length > 0) {
                const admin = admins[0];
                const conv = await createConversation([userProfile.id, admin.id], 'Support Request');

                // Manually construct the full object so we can use it immediately
                const fullConv: any = {
                    ...conv,
                    participants: [
                        { user_id: userProfile.id, user: userProfile },
                        { user_id: admin.id, user: admin }
                    ]
                };

                setActiveConversation(fullConv);

                // Then refresh list in background
                const refreshed = await fetchConversations();
                setConversations(refreshed);
            }
        } catch (error) {
            console.error('Failed to auto-start support chat', error);
        }
    };

    useEffect(() => {
        if (!activeConversation) return;

        loadMessages(activeConversation.id);
        markRead(activeConversation.id);

        const msgSubscription = supabase
            .channel(`chat:${activeConversation.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${activeConversation.id}`
            }, (payload) => {
                fetchMessages(activeConversation.id).then(setMessages);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(msgSubscription);
        };
    }, [activeConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
        } catch (error) {
            console.error('Failed to send:', error);
            alert('Failed to send message');
        }
    };

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

    const handleContactSupport = async () => {
        if (!currentUser) return;
        try {
            // Find an admin to chat with
            const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin').limit(1);
            if (admins && admins.length > 0) {
                const adminId = admins[0].id;
                // Create conversation
                const conv = await createConversation([currentUser.id, adminId], 'Support Request');
                await loadConversations();
                setActiveConversation(conv as unknown as Conversation);
            } else {
                alert('No support agents available currently.');
            }
        } catch (error) {
            console.error('Failed to create support chat', error);
        }
    };

    const getOtherParticipant = (conv: Conversation) => {
        if (!currentUser || !conv.participants) return null;
        return conv.participants.find(p => p.user_id !== currentUser.id)?.user;
    };

    const filteredConversations = conversations.filter(c => {
        const other = getOtherParticipant(c);
        if (!other) return false;
        return other.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="h-[calc(100dvh-120px)] sm:h-[calc(100vh-140px)] flex gap-0 md:gap-4 lg:gap-6 relative">
            {/* Sidebar List */}
            <div className={`${showMobileSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-72 lg:w-80 flex-col gap-2 sm:gap-4 absolute md:relative inset-0 z-10 bg-brand-dark md:bg-transparent`}>
                <div className="bg-brand-surface border border-brand-primary/10 rounded-lg sm:rounded-xl flex-1 flex flex-col overflow-hidden">
                    <div className="p-3 sm:p-4 border-b border-brand-primary/10 space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-brand-white text-sm sm:text-base">Messages</h2>
                            <button
                                onClick={handleContactSupport}
                                className="p-1.5 sm:p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary hover:text-black transition-colors"
                                title="Contact Support"
                            >
                                <MessageSquarePlus size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-brand-dark/50 border-none rounded-lg pl-9 pr-3 py-2 text-xs text-brand-white placeholder:text-gray-600 focus:ring-1 focus:ring-brand-primary outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center text-xs text-gray-500">Loading...</div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {filteredConversations.map(conv => {
                                    const other = getOtherParticipant(conv);
                                    const isActive = activeConversation?.id === conv.id;
                                    return (
                                        <div
                                            key={conv.id}
                                            onClick={() => { setActiveConversation(conv); setShowMobileSidebar(false); }}
                                            className={`p-2 sm:p-3 hover:bg-white/5 cursor-pointer transition-colors ${isActive ? 'bg-white/5 border-l-2 border-brand-primary' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden shrink-0">
                                                    {other?.avatar_url ? (
                                                        <img src={other.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-white">
                                                            {other?.full_name?.substring(0, 2).toUpperCase() || 'SU'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <h4 className="font-medium text-brand-white truncate text-sm">{other?.full_name || 'Support'}</h4>
                                                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                                            {new Date(conv.last_message_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {conv.subject || 'Click to view'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredConversations.length === 0 && (
                                    <div className="p-6 text-center text-gray-500 text-xs">
                                        No messages yet.
                                        <br />
                                        <button onClick={handleContactSupport} className="text-brand-primary mt-2 hover:underline">
                                            Contact Support
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className={`${!showMobileSidebar ? 'flex' : 'hidden'} md:flex flex-1 bg-brand-surface border border-brand-primary/10 rounded-lg sm:rounded-xl overflow-hidden flex-col`}>
                {activeConversation ? (
                    <>
                        {/* Header */}
                        <div className="h-12 sm:h-14 md:h-16 border-b border-brand-primary/10 flex items-center justify-between px-3 sm:px-4 md:px-6 bg-brand-surface">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                    onClick={() => setShowMobileSidebar(true)}
                                    className="md:hidden p-1 text-gray-400 hover:text-white"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gray-700 overflow-hidden">
                                    {getOtherParticipant(activeConversation)?.avatar_url ? (
                                        <img src={getOtherParticipant(activeConversation)?.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white text-[10px] sm:text-xs">
                                            {getOtherParticipant(activeConversation)?.full_name?.substring(0, 2).toUpperCase() || 'SU'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-white text-xs sm:text-sm">
                                        {getOtherParticipant(activeConversation)?.full_name || 'Support'}
                                    </h3>
                                    <p className="text-[10px] sm:text-xs text-green-500 flex items-center gap-1">
                                        Active
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 bg-brand-dark/20">
                            {messages.map((msg, idx) => {
                                const isMe = msg.sender_id === currentUser?.id;
                                const showAvatar = idx === 0 || messages[idx - 1].sender_id !== msg.sender_id;
                                return (
                                    <div key={msg.id} className={`flex gap-2 sm:gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        {showAvatar ? (
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 shrink-0 overflow-hidden mt-1">
                                                {msg.sender?.avatar_url ? (
                                                    <img src={msg.sender.avatar_url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-white">
                                                        {msg.sender?.full_name?.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-6 sm:w-8 shrink-0" />
                                        )}

                                        <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`
                                                px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-2xl shadow-sm
                                                ${isMe
                                                    ? 'bg-brand-primary text-black rounded-tr-none'
                                                    : 'bg-white/10 text-brand-white rounded-tl-none'}
                                            `}>
                                                {msg.content}
                                            </div>
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
                                                                flex items-center gap-2 p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors max-w-xs
                                                                ${isMe ? 'bg-black/20' : 'bg-brand-dark'}
                                                            `}
                                                        >
                                                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-brand-primary">
                                                                {file.type.startsWith('image/') ? <ImageIcon size={16} /> : <FileText size={16} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0 max-w-[120px] sm:max-w-[150px]">
                                                                <p className="text-xs font-medium text-brand-white truncate">{file.name}</p>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                            <span className="text-[10px] text-gray-600 mt-1 px-1">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-2 sm:p-3 md:p-4 bg-brand-surface border-t border-brand-primary/10">
                            {/* File Preview */}
                            {uploadedFiles.length > 0 && (
                                <div className="flex gap-1.5 sm:gap-2 mb-2 overflow-x-auto pb-1">
                                    {uploadedFiles.map((file, i) => (
                                        <div key={i} className="relative group">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                                {file.type.startsWith('image/') ? (
                                                    <img src={file.url} className="w-full h-full object-cover opacity-70" />
                                                ) : (
                                                    <FileText className="text-gray-400" size={16} />
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={handleSend} className="flex items-end gap-1.5 sm:gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-brand-white transition-colors"
                                >
                                    <Paperclip size={18} className="sm:w-5 sm:h-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                />
                                <div className="flex-1 bg-brand-dark/50 border border-white/5 rounded-xl flex items-center p-1 focus-within:ring-1 focus-within:ring-brand-primary">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={isUploading ? "Uploading..." : "Type a message..."}
                                        className="w-full bg-transparent border-none focus:ring-0 text-brand-white placeholder:text-gray-600 px-3 py-1.5 text-sm outline-none"
                                        disabled={isUploading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={(!inputValue.trim() && !uploadedFiles.length) || isUploading}
                                    className="p-2 sm:p-2.5 bg-brand-primary text-black rounded-lg hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <Info size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">Select a conversation or start a new one</p>
                    </div>
                )}
            </div>
        </div>
    );
}
