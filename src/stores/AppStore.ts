import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from '../firebaseConfig';
import ProfileStore from './ProfileStore';
import FilterStore from './FilterStore';

export default class AppStore {
    public readonly firebase: FirebaseApp;
    public readonly firestore: Firestore;
    public readonly auth: Auth;
    public readonly storage: FirebaseStorage;

    public readonly profileStore: ProfileStore;
    public readonly filterStore: FilterStore;

    constructor() {
        this.firebase = initializeApp(firebaseConfig);
        this.firestore = getFirestore(this.firebase);
        this.auth = getAuth(this.firebase);
        this.storage = getStorage();

        this.profileStore = new ProfileStore(this);
        this.filterStore = new FilterStore(this);
    }
}