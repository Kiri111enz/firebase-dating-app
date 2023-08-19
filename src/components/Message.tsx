import React from 'react';
import { Avatar, Paper, Text } from '@mantine/core';
import { Message } from 'stores/ChatsStore';

interface MessageProps {
    rtl?: boolean
    className?: string
    message: Message
    photoURL?: string
}

const formatTime = (date: Date): string => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const Message: React.FC<MessageProps> = ({ rtl, className, message, photoURL }) => (
    <div style={{ direction: rtl ? 'rtl' : 'ltr' }} className={`flex items-start p-2 ${className}`}>
        <Avatar size="md" radius="xl" src={photoURL}></Avatar>
        <div className={rtl ? 'mr-3' : 'ml-3'}>
            <Paper shadow="xs" className="px-2 py-1">{message.text}</Paper>
            <Text size="xs" color="gray" className="italic mt-1">{formatTime(message.createdAt.toDate())}</Text>
        </div>
    </div>
);

export default Message;