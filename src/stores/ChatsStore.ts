import { collection, addDoc, updateDoc, DocumentReference, CollectionReference, Timestamp } from 'firebase/firestore';
import AppStore from './AppStore';
import { User } from './UserStore';

export interface Message {
    createdAt: Timestamp
    authorUid: string
    text: string
}

export interface Chat {
    usersUids: string[]
    messages: Message[]
    lastMessage?: Message
}

export default class ChatsStore {
    private readonly ref: CollectionReference;

    constructor(private appStore: AppStore) {
        this.ref = collection(appStore.firestore, 'chats');
    }

    public async createChat(users: User[]): Promise<void> {
        await addDoc(this.ref, { usersUids: users.map((user) => user.uid), messages: [] });
    }

    public async sendMessage(docRef: DocumentReference, messages: Message[], text: string): Promise<void> {
        if (!this.appStore.userStore.user)
            throw new Error('Tried to send a message without authentication.');

        const newMessage: Message = {
            createdAt: Timestamp.fromDate(new Date()),
            authorUid: this.appStore.userStore.user.uid,
            text
        };
        messages.push(newMessage);
        await updateDoc(docRef, { messages, lastMessage: newMessage });
    }
}