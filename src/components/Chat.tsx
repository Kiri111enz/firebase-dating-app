import React, { useContext } from 'react';
import { ActionIcon, TextInput, Button } from '@mantine/core';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import { AppContext } from 'pages/_app';
import { User } from 'stores/UserStore';
import { Chat } from 'stores/ChatsStore';

interface ChatProps {
    className?: string
    onClose?: () => void
    chat: Chat
    users: User[]
}

const Chat: React.FC<ChatProps> = ({ className, onClose, chat, users }) => {
    const { userStore } = useContext(AppContext);

    return (
        <div className={`flex flex-col overflow-hidden ${className}`}>
            <div className="flex flex-row top-0 w-full pb-2 bg-[#228be6]">
                <ActionIcon className="top-1 left-1 mb-1 hover:bg-[#1c7ed6] text-white" onClick={onClose}>
                    <IconArrowNarrowLeft size="2rem" />
                </ActionIcon>
                <div className="relative ml-auto top-1.5 right-3 font-semibold text-white">
                    {users.filter((user => user.uid !== userStore.user!.uid ))
                        .map((user) => user.profile.name).join(', ')}
                </div>
            </div>

            <div className="grow">

            </div>

            <div className="flex flex-row bottom-0 w-full pt-2">
                <TextInput className="w-full" placeholder="Type..." />
                <Button>Send</Button>
            </div>
        </div>
    );
};

export default Chat;