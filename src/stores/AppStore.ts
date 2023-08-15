import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from '../firebaseConfig';
import UserStore from './UserStore';

export default class AppStore {
    public readonly firebase: FirebaseApp;
    public readonly firestore: Firestore;
    public readonly auth: Auth;
    public readonly storage: FirebaseStorage;
    public readonly userStore: UserStore;

    constructor() {
        this.firebase = initializeApp(firebaseConfig);
        this.firestore = getFirestore(this.firebase);
        this.auth = getAuth(this.firebase);
        this.storage = getStorage();
        this.userStore = new UserStore(this);
    }
}