import { collection, addDoc, CollectionReference, Timestamp } from 'firebase/firestore';
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

    constructor(appStore: AppStore) {
        this.ref = collection(appStore.firestore, 'chats');
    }

    public async createChat(users: User[]): Promise<void> {
        await addDoc(this.ref, { usersUids: users.map((user) => user.uid), messages: [] });
    }
}