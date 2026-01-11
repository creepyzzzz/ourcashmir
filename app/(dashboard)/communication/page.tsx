'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Users, Paperclip } from 'lucide-react';
import { fetchUser, Profile, fetchMessages, sendMessage, Message } from '@/lib/data';

export default function CommunicationPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [user, setUser] = useState<Profile | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetchUser().then(data => setUser(data as Profile));
        loadMessages();

        // Polling for new messages every 5 seconds (simple realtime)
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadMessages = async () => {
        const msgs = await fetchMessages();
        setMessages(msgs);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !user) return;

        const content = inputValue;
        setInputValue(''); // Optimistic clear

        try {
            await sendMessage({
                content,
                sender_id: user.id,
                // project_id: '...' // Optional if tied to specific project
            });
            loadMessages(); // Refresh
        } catch (error) {
            console.error("Failed to send", error);
        }
    };

    if (!user) return <div className="p-10 text-center text-gray-500">Loading chat...</div>;

    return (
        <div className="h-[calc(100vh-140px)] flex bg-brand-surface border border-brand-primary/10 rounded-xl overflow-hidden">
            {/* Sidebar List (Threads) */}
            <div className="w-80 border-r border-brand-primary/10 hidden md:flex flex-col">
                <div className="p-4 border-b border-brand-primary/10">
                    <h3 className="font-bold text-brand-white">Messages</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-3 bg-white/5 border-l-2 border-brand-primary cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="flex justify-between mb-1">
                            <span className="font-medium text-brand-white text-sm">General Chat</span>
                            <span className="text-xs text-brand-primary">Active</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">Click to view conversation</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-brand-dark/20">
                {/* Chat Header */}
                <div className="h-16 border-b border-brand-primary/10 flex items-center justify-between px-6 bg-brand-surface">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                            <Users className="text-white" size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-brand-white">General Discussion</h3>
                            <p className="text-xs text-green-500">Active Channel</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 && <div className="text-center text-gray-500 mt-10">No messages yet. Start the conversation!</div>}
                    {messages.map((msg) => {
                        const isMe = msg.sender_id === user.id;
                        return (
                            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0 overflow-hidden">
                                    {msg.sender?.avatar_url ? (
                                        <img src={msg.sender.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-white uppercase">{msg.sender?.full_name?.substring(0, 2) || 'U'}</div>
                                    )}
                                </div>
                                <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                    <div className="text-xs text-gray-400 mb-1 px-1">{msg.sender?.full_name || 'Unknown'}</div>
                                    <div className={`
                                         p-3 rounded-2xl text-sm
                                         ${isMe
                                            ? 'bg-brand-primary text-black rounded-tr-none'
                                            : 'bg-white/10 text-brand-white rounded-tl-none'}
                                     `}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[10px] text-gray-500 mt-1">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-brand-surface border-t border-brand-primary/10">
                    <form onSubmit={handleSend} className="flex items-center gap-2">
                        <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-brand-dark border-none rounded-lg py-2 px-4 focus:ring-1 focus:ring-brand-primary outline-none text-brand-white placeholder:text-gray-600"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="p-2 bg-brand-primary text-black rounded-lg hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
