import React from 'react';
import { Avatar, Paper, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ChatData } from 'stores/ChatsStore';
import usePhotoURL from 'hooks/usePhotoURL';

interface ChatPreviewProps {
    className?: string
    onClick?: () => void
    chatData: ChatData
}

const ChatPreview: React.FC<ChatPreviewProps> = observer(({ className, onClick, chatData }) => {
    const photoURL = usePhotoURL(chatData.mate.profile);

    return (
        <Paper shadow="xs" radius="xs" className={`px-4 w-full ${className}`} onClick={onClick}>
            <div className="flex items-center py-2">
                <Avatar size="lg" radius="xl" src={photoURL} />

                <div className="ml-4">
                    <Text className="font-semibold">{chatData.mate.profile.name}</Text>
                    {chatData.chat.lastMessage &&
                        <Text size="sm" color="gray" lineClamp={1}>{chatData.chat.lastMessage.text}</Text>
                    }
                </div>
            </div>
        </Paper>
    );
});

export default ChatPreview;