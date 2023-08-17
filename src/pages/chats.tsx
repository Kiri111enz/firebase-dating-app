import { useContext, useState, useEffect } from 'react';
import { Text, Paper, Avatar, ScrollArea, Loader } from '@mantine/core';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import { User } from 'stores/UserStore';

const Chats: NextPageWithLayout = () => {
    const { firestore, userStore } = useContext(AppContext);
    const [users, setUsers] = useState<User[] | null>(null);

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

    return (
        <ScrollArea className="flex flex-col h-full w-full">
            {users.map((user) => (
                <Paper shadow="xs" radius="xs" className="px-4 w-full" key={user.uid}>
                    <div className="flex items-center py-2">
                        <Avatar size="lg" radius="xl" src='https://example.com.jpg' />

                        <div className="ml-4">
                            <Text className="font-semibold">{user.profile.name}</Text>
                        </div>
                    </div>
                </Paper>
            ))}
        </ScrollArea>
    );
};

Chats.getLayout = MainPageLayout;

export default Chats;