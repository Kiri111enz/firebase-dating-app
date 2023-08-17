import { useContext, useState, useEffect } from 'react';
import { ScrollArea, Loader } from '@mantine/core';
import { collection, query, where, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import ChatPreview from 'components/ChatPreview';
import Chat from 'components/Chat';
import { User } from 'stores/UserStore';
import { Chat as ChatModel } from 'stores/ChatsStore';

interface ChatWithMate extends ChatModel {
    mate: User
}

const Chats: NextPageWithLayout = () => {
    const { firestore, userStore } = useContext(AppContext);
    const [chats, setChats] = useState<ChatWithMate[] | null>(null);
    const [selectedChat, selectChat] = useState<ChatWithMate | null>(null);

    const fetchChats = async (querySnapshot: QuerySnapshot): Promise<void> => {
        Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
            const chat = docSnapshot.data() as ChatModel;
            const mateUid = chat.usersUids[chat.usersUids[0] === userStore.user!.uid ? 1 : 0];
            const mate = await userStore.getByUid(mateUid);
            return { ...chat, mate };
        })).then((chats) => setChats(chats));
    };

    useEffect(() => {
        const q = query(collection(firestore, 'chats'),
            where('usersUids', 'array-contains', userStore.user!.uid)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => fetchChats(querySnapshot));

        return () => unsubscribe();
    }, []);

    if (chats === null)
        return <Loader />;

    if (selectedChat !== null)
        return <Chat className="h-full w-full" onClose={() => selectChat(null)}
            chat={selectedChat} users={[userStore.user!, selectedChat.mate]} />;

    return (
        <ScrollArea className="flex flex-col h-full w-full">
            {chats.map((chat) => (
                <ChatPreview key={chat.mate.uid} className="hover:cursor-pointer"
                    onClick={() => selectChat(chat)} profile={chat.mate.profile} />
            ))}
        </ScrollArea>
    );
};

Chats.getLayout = MainPageLayout;

export default Chats;