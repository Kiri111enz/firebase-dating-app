import { useContext, useState, useEffect } from 'react';
import { ScrollArea, Loader } from '@mantine/core';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import ChatPreview from 'components/ChatPreview';
import Chat from 'components/Chat';
import { User } from 'stores/UserStore';

const Chats: NextPageWithLayout = () => {
    const { firestore, userStore } = useContext(AppContext);
    const [users, setUsers] = useState<User[] | null>(null);
    const [selectedUser, selectUser] = useState<User | null>(null);

    useEffect(() => {
        getDocs(query(collection(firestore, 'users'),
            where('activity.liked', 'array-contains', userStore.user!.uid)
        )).then((querySnapshot) => {
            const users = querySnapshot.docs.map((docSnapshot) => docSnapshot.data() as User);
            const liked = new Set<string>(userStore.user!.activity.liked);
            setUsers(users.filter((user) => liked.has(user.uid)));
        });
    }, []);

    if (users === null)
        return <Loader />;

    if (selectedUser !== null)
        return <Chat className="" onClose={() => selectUser(null)} user={selectedUser} />;

    return (
        <ScrollArea className="flex flex-col h-full w-full">
            {users.map((user) => (
                <ChatPreview key={user.uid} onClick={() => selectUser(user)} profile={user.profile} />
            ))}
        </ScrollArea>
    );
};

Chats.getLayout = MainPageLayout;

export default Chats;