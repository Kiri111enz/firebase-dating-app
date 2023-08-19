import React, { useContext, useState, useEffect, useRef } from 'react';
import { ActionIcon, TextInput, Button, ScrollArea } from '@mantine/core';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { AppContext } from 'pages/_app';
import Message from './Message';
import { ChatData } from 'stores/ChatsStore';
import usePhotoURL from '../hooks/usePhotoURL';

interface ChatProps {
    className?: string
    onClose?: () => void
    chatData: ChatData
}

const Chat: React.FC<ChatProps> = observer(({ className, onClose, chatData }) => {
    const { userStore: { user }, chatsStore } = useContext(AppContext);
    const [message, setMessage] = useState('');
    const myPhotoURL = usePhotoURL(user!.profile);
    const matePhotoURL = usePhotoURL(chatData.mate.profile);
    const viewport = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [chatData.chat.messages]);

    const sendIfNotEmpty = (): void => {
        if (message)
            chatsStore.sendMessage(chatData.id, message).then(() => setMessage(''));
    };

    const scrollToBottom = (): void => {
        viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    };

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
                <ScrollArea type="scroll" className="h-full" viewportRef={viewport}>
                    {chatData.chat.messages.map((message, index) => message.authorUid === user!.uid ?
                        <Message className="max-w-[30%] ml-auto" key={index} rtl message={message}
                            photoURL={myPhotoURL} /> :
                        <Message className="max-w-[30%]" key={index} message={message}
                            photoURL={matePhotoURL} />)}
                </ScrollArea>
            </div>

            <div className="flex flex-row bottom-0 w-full pt-2">
                <TextInput className="w-full" placeholder="Type..."
                    value={message} onChange={(event) => setMessage(event.currentTarget.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter')
                            sendIfNotEmpty();
                    }}/>
                <Button onClick={sendIfNotEmpty}>Send</Button>
            </div>
        </div>
    );
});

export default Chat;