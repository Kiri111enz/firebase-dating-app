import React, { useContext, useState } from 'react';
import { ActionIcon, TextInput, Button, Text } from '@mantine/core';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import { doc } from 'firebase/firestore';
import { AppContext } from 'pages/_app';
import { User } from 'stores/UserStore';
import { Chat as ChatModel } from 'stores/ChatsStore';
import useChat from 'hooks/useChat';

export interface ChatExt extends ChatModel {
    docId: string
    users: User[]
}

interface ChatProps {
    className?: string
    onClose?: () => void
    initialChat: ChatExt
}

const Chat: React.FC<ChatProps> = ({ className, onClose, initialChat }) => {
    const { firestore, userStore, chatsStore } = useContext(AppContext);
    const chat = useChat(initialChat.docId, initialChat);
    const [docRef] = useState(doc(firestore, 'chats', initialChat.docId));
    const [message, setMessage] = useState('');

    return (
        <div className={`flex flex-col overflow-hidden ${className}`}>
            <div className="flex flex-row top-0 w-full pb-2 bg-[#228be6]">
                <ActionIcon className="top-1 left-1 mb-1 hover:bg-[#1c7ed6] text-white" onClick={onClose}>
                    <IconArrowNarrowLeft size="2rem" />
                </ActionIcon>
                <div className="relative ml-auto top-1.5 right-3 font-semibold text-white">
                    {initialChat.users.filter((user => user.uid !== userStore.user!.uid ))
                        .map((user) => user.profile.name).join(', ')}
                </div>
            </div>

            <div className="grow">
                {chat?.messages.map((message, index) => <Text key={index}>{message.text}</Text>)}
            </div>

            <div className="flex flex-row bottom-0 w-full pt-2">
                <TextInput className="w-full" placeholder="Type..."
                    value={message} onChange={(event) => setMessage(event.currentTarget.value)} />
                <Button onClick={() => {
                    if (message)
                        chatsStore.sendMessage(docRef, chat!.messages, message).then(() => setMessage(''));
                }}>Send</Button>
            </div>
        </div>
    );
};

export default Chat;