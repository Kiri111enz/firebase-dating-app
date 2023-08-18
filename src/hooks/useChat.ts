import { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { Chat } from 'stores/ChatsStore';
import { AppContext } from 'pages/_app';

const useChat = (docId: string, initialState?: Chat): Chat | undefined => {
    const { firestore } = useContext(AppContext);
    const [chat, setChat] = useState(initialState);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(firestore, 'chats', docId),
            (docSnapshot) => setChat(docSnapshot.data() as Chat));

        return () => unsubscribe();
    }, []);

    return chat;
};

export default useChat;