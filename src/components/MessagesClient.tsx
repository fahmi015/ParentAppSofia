'use client';

import React, { useState, useEffect } from 'react';
import { getMessages, getMessageRecipients, sendMessage } from '@/app/actions';
import { Loader2, Send, Inbox, Mail, CheckCircle, Reply } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

export default function MessagesClient() {
    const [activeTab, setActiveTab] = useState<'create' | 'inbox' | 'sent'>('inbox');

    // Create Message State
    const [recipients, setRecipients] = useState<any[]>([]);
    const [selectedRecipientIds, setSelectedRecipientIds] = useState<number[]>([]);
    const [messageTitle, setMessageTitle] = useState('');
    const [messageBody, setMessageBody] = useState('');
    const [sending, setSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState('');
    const [recipientLoading, setRecipientLoading] = useState(false);

    // Inbox/Sent State
    const [messageList, setMessageList] = useState<any[]>([]);
    const [listLoading, setListLoading] = useState(false);
    const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null);

    // Reply State
    const [replyMessageId, setReplyMessageId] = useState<number | null>(null);

    useEffect(() => {
        if (activeTab === 'create') {
            fetchRecipients();
        } else if (activeTab === 'inbox') {
            fetchMessages('receive');
        } else if (activeTab === 'sent') {
            fetchMessages('send');
        }
    }, [activeTab]);

    const fetchRecipients = async () => {
        setRecipientLoading(true);
        const result = await getMessageRecipients();
        if (result.success) {
            setRecipients(result.data);
        }
        setRecipientLoading(false);
    };

    const fetchMessages = async (type: 'receive' | 'send') => {
        setListLoading(true);
        setMessageList([]);
        const result = await getMessages(type);
        if (result.success) {
            setMessageList(result.data);
        }
        setListLoading(false);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRecipientIds.length === 0) {
            alert('Please select at least one recipient');
            return;
        }
        setSending(true);
        setSendSuccess('');

        const payload: any = {
            title: messageTitle,
            message: messageBody,
            recipients: selectedRecipientIds,
        };

        // Handle Reply context if needed, though API just needs recipients and message/title usually.
        // If replying to specific message ID:
        if (replyMessageId) {
            payload.message_id = replyMessageId;
            // Usually replies might go to single person, but here we use selectedRecipientIds still?
            // Flutter code: "message_id": messages[index]['id']
            // And "recipients" seems not sent in reply? 
            // Wait, `reception.dart` uses `http.post(url/guardian/messages)` with `message_id`.
            // It does NOT send `recipients`. 
            // `message_envoie.dart` sends `recipients`.
            // We need separate logic for Reply vs New Message?
            // Yes.
        }

        // But wait here I am combining Create logic. 
        // If I am in Create Tab, it's a new message.

        const result = await sendMessage(payload);
        if (result.success) {
            setSendSuccess('Message sent successfully!');
            setMessageTitle('');
            setMessageBody('');
            setSelectedRecipientIds([]);
            setReplyMessageId(null);
        } else {
            alert(result.message || 'Failed to send');
        }
        setSending(false);
    };

    const handleReplySend = async (originalMessageId: number, title: string, message: string) => {
        // Function specifically for inline replies in Inbox
        if (!message) return;
        // Assuming API takes same endpoint for reply
        const payload = {
            title: title || 'Re:',
            message: message,
            message_id: originalMessageId
        };

        const result = await sendMessage(payload);
        if (result.success) {
            alert('Reply sent!');
            fetchMessages('receive'); // Refresh
        } else {
            alert(result.message || 'Failed to reply');
        }
    }


    const toggleRecipient = (id: number) => {
        setSelectedRecipientIds(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = (userIds: number[]) => {
        // Check if all these are selected
        const allSelected = userIds.every(id => selectedRecipientIds.includes(id));
        if (allSelected) {
            // Deselect them
            setSelectedRecipientIds(prev => prev.filter(id => !userIds.includes(id)));
        } else {
            // Select all of them (add missing ones)
            const toAdd = userIds.filter(id => !selectedRecipientIds.includes(id));
            setSelectedRecipientIds(prev => [...prev, ...toAdd]);
        }
    }


    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('inbox')}
                    className={clsx(
                        'flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors flex items-center justify-center space-x-2',
                        activeTab === 'inbox' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                >
                    <Inbox className="h-5 w-5" />
                    <span>Inbox</span>
                </button>
                <button
                    onClick={() => setActiveTab('create')}
                    className={clsx(
                        'flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors flex items-center justify-center space-x-2',
                        activeTab === 'create' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                >
                    <Send className="h-5 w-5" />
                    <span>Create</span>
                </button>
                <button
                    onClick={() => setActiveTab('sent')}
                    className={clsx(
                        'flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors flex items-center justify-center space-x-2',
                        activeTab === 'sent' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                >
                    <Mail className="h-5 w-5" />
                    <span>My Messages</span>
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px]">

                {/* Create Message */}
                {activeTab === 'create' && (
                    <div className="p-6 space-y-6">
                        {sendSuccess && (
                            <div className="bg-green-50 text-green-700 p-4 rounded-md flex items-center">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                {sendSuccess}
                            </div>
                        )}

                        {/* Recipients */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">To:</label>
                            {recipientLoading ? (
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Loading recipients...</span>
                                </div>
                            ) : (
                                <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto p-2">
                                    {recipients.map((group: any) => (
                                        <div key={group.role || 'other'} className="mb-4">
                                            <div className="flex items-center space-x-2 mb-1 bg-gray-50 p-1 rounded">
                                                {/* We can have 'Select All' for this group logic if needed */}
                                                <span className="font-bold text-gray-800 capitalize">{group.role}</span>
                                            </div>
                                            {/* Assuming structure is list of users, but API from Flutter code returns mixed? 
                                          Flutter code: `_groups.map((item) { return item['role']!='autre'? CheckboxListTile...`
                                          It seems API returns Users directly?
                                          Wait, flutter code iterates `_groups` which is `data['data']` from `/guardian/users`.
                                          It renders checkboxes for each item. 
                                          The item is a user.
                                       */}
                                            <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRecipientIds.includes(group.id)}
                                                    onChange={() => toggleRecipient(group.id)}
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900">{group.full_name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {group.role}
                                                        {group.subjects && group.subjects.length > 0 && ` • ${group.subjects.map((s: any) => s.name).join(', ')}`}
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={messageTitle}
                                    onChange={(e) => setMessageTitle(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    placeholder="Subject"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={messageBody}
                                    onChange={(e) => setMessageBody(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    placeholder="Type your message here..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending || selectedRecipientIds.length === 0}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                            >
                                {sending ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Send Message'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Inbox / Sent Lists */}
                {(activeTab === 'inbox' || activeTab === 'sent') && (
                    <div className="divide-y divide-gray-100">
                        {listLoading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            </div>
                        ) : messageList.length > 0 ? (
                            messageList.map((msg) => (
                                <div key={msg.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start space-x-3">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            {msg.sendable?.avatar ? (
                                                <img src={msg.sendable.avatar} className="h-10 w-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                    <User className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-sm font-bold text-gray-900">
                                                    {msg.sendable?.first_name} {msg.sendable?.last_name}
                                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] uppercase">{msg.sendable?.role}</span>
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {msg.created_at ? format(new Date(msg.created_at), 'MMM d, HH:mm') : ''}
                                                </span>
                                            </div>

                                            <h4 className="font-semibold text-gray-800 mt-1">{msg.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{msg.message}</p>

                                            {/* Reply Button (Only for Inbox usually, or if we want to see replies in sent too) */}
                                            {activeTab === 'inbox' && (
                                                <div className="mt-2">
                                                    <button
                                                        onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}
                                                        className="text-primary text-sm font-medium hover:underline flex items-center"
                                                    >
                                                        {expandedMessageId === msg.id ? 'Hide Replies' : 'Reply / View Replies'}
                                                    </button>
                                                </div>
                                            )}

                                            {/* Expanded Area for Reply */}
                                            {expandedMessageId === msg.id && activeTab === 'inbox' && (
                                                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                                                    {/* Existing Replies */}
                                                    {msg.replies && msg.replies.length > 0 && (
                                                        <div className="space-y-4 mb-4">
                                                            {msg.replies.map((reply: any) => (
                                                                <div key={reply.id} className="bg-gray-100 p-3 rounded-md">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="font-bold text-xs">{reply.sendable?.first_name} {reply.sendable?.last_name}</span>
                                                                        <span className="text-xs text-gray-500">{reply.created_at ? format(new Date(reply.created_at), 'MMM d, HH:mm') : ''}</span>
                                                                    </div>
                                                                    <p className="text-sm">{reply.message}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Reply Form */}
                                                    <ReplyForm originalMessageId={msg.id} onReply={handleReplySend} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                No messages found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ReplyForm({ originalMessageId, onReply }: { originalMessageId: number, onReply: (id: number, t: string, m: string) => void }) {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onReply(originalMessageId, title, message);
        setMessage(''); // Clear message on success (optimistic)
        setTitle('');
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input
                type="text"
                placeholder="Title (Optional)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="block w-full text-sm border-gray-300 rounded-md py-1"
            />
            <textarea
                required
                placeholder="Write your reply..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="block w-full text-sm border-gray-300 rounded-md py-2"
                rows={2}
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white text-xs px-3 py-1.5 rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
                {loading ? 'Sending...' : 'Send Reply'}
            </button>
        </form>
    )
}
