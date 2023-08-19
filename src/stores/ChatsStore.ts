import {
    collection, query, where, doc, addDoc, updateDoc, arrayUnion, onSnapshot,
    Unsubscribe, Timestamp, QueryDocumentSnapshot
} from 'firebase/firestore';
import { makeAutoObservable, runInAction } from 'mobx';
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
    createdAt: Timestamp
}

export interface ChatData {
    id: string
    chat: Chat
    mate: User
}

export default class ChatsStore {
    private _chatsData: ChatData[] | null = null;
    private unsubscribes: Unsubscribe[] = [];

    constructor(private appStore: AppStore) {
        this.appStore.auth.onAuthStateChanged(async (account) => {
            if (account) {
                runInAction(() => this._chatsData = []);
                const q = query(collection(appStore.firestore, 'chats'),
                    where('usersUids', 'array-contains', account.uid)
                );
                this.unsubscribes.push(onSnapshot(q, (querySnapshot) => {
                    querySnapshot.docChanges().forEach(async (change) => {
                        if (change.type === 'added')
                            await this.addChat(change.doc);
                    });
                }));
            }
            else {
                this.unsubscribes.forEach((unsubscribe) => unsubscribe());

                this.unsubscribes = [];
                runInAction(() => this._chatsData = null);
            }
        });
        makeAutoObservable(this, {}, { autoBind: true });
    }

    public get chatsData(): ChatData[] | null { return this._chatsData; }

    public async createChat(users: User[]): Promise<void> {
        await addDoc(collection(this.appStore.firestore, 'chats'),
            { usersUids: users.map((user) => user.uid), messages: [] });
    }

    public async sendMessage(chatId: string, text: string): Promise<void> {
        if (!this.appStore.userStore.user)
            throw new Error('Tried to send a message without authentication.');

        const newMessage: Message = {
            createdAt: Timestamp.fromDate(new Date()),
            authorUid: this.appStore.userStore.user.uid,
            text
        };
        await updateDoc(doc(this.appStore.firestore, 'chats', chatId),
            { messages: arrayUnion(newMessage), lastMessage: newMessage });
    }

    private async addChat(docSnapshot: QueryDocumentSnapshot): Promise<void> {
        const chat = docSnapshot.data() as Chat;
        const mateUid = chat.usersUids[chat.usersUids[0] === this.appStore.userStore.user!.uid ? 1 : 0];
        const mate = await this.appStore.userStore.getByUid(mateUid);
        const index = this._chatsData!.length;
        runInAction(() => this._chatsData!.push({ id: docSnapshot.id, chat, mate }));
        this.unsubscribes.push(
            onSnapshot(doc(this.appStore.firestore, 'chats', docSnapshot.id), (docSnapshot) => {
                runInAction(() => this._chatsData![index].chat = docSnapshot.data() as Chat );
            })
        );
    }
}