import React, { useContext, useState } from 'react';
import { ActionIcon, TextInput, Button, Text, ScrollArea } from '@mantine/core';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { AppContext } from 'pages/_app';
import { ChatData } from 'stores/ChatsStore';

interface ChatProps {
    className?: string
    onClose?: () => void
    chatData: ChatData
}

const Chat: React.FC<ChatProps> = observer(({ className, onClose, chatData }) => {
    const { chatsStore } = useContext(AppContext);
    const [message, setMessage] = useState('');

    return (
        <div className={`flex flex-col overflow-hidden ${className}`}>
            <div className="flex flex-row top-0 w-full pb-2 bg-[#228be6]">
                <ActionIcon className="top-1 left-1 mb-1 hover:bg-[#1c7ed6] text-white" onClick={onClose}>
                    <IconArrowNarrowLeft size="2rem" />
                </ActionIcon>
                <div className="relative ml-auto top-1.5 right-3 font-semibold text-white">
                    {chatData.mate.profile.name}
                </div>
            </div>

            <div className="grow overflow-auto">
                <ScrollArea className="h-full">
                    {chatData.chat.messages.map((message, index) => <Text key={index}>{message.text}</Text>)}
                </ScrollArea>
            </div>

            <div className="flex flex-row bottom-0 w-full pt-2">
                <TextInput className="w-full" placeholder="Type..."
                    value={message} onChange={(event) => setMessage(event.currentTarget.value)} />
                <Button onClick={() => {
                    if (message)
                        chatsStore.sendMessage(chatData.id, message).then(() => setMessage(''));
                }}>Send</Button>
            </div>
        </div>
    );
});

export default Chat;