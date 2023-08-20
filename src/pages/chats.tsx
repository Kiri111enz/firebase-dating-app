import { useContext, useState } from 'react';
import { ScrollArea, Loader } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import ChatPreview from 'components/ChatPreview';
import Chat from 'components/Chat';
import { ChatData } from 'stores/ChatsStore';

const Chats: NextPageWithLayout = observer(() => {
    const { chatsStore } = useContext(AppContext);
    const [chatData, setChatData] = useState<ChatData | null>(null);

    if (chatsStore.chatsData === null)
        return <Loader />;

    return (
        <>
            <ScrollArea className={`flex flex-col h-full w-full ${chatData === null ? '' : 'hidden'}`}>
                {chatsStore.chatsData.map((chatData) => (
                    <ChatPreview key={chatData.id} className="hover:cursor-pointer"
                        onClick={() => setChatData(chatData)} chatData={chatData} />
                ))}
            </ScrollArea>

            {chatData !== null &&
                <Chat className="h-full w-full" onClose={() => setChatData(null)} chatData={chatData} />
            }
        </>
    );
});

Chats.getLayout = MainPageLayout;

export default Chats;