import { doc, getDoc, setDoc, updateDoc, arrayUnion, DocumentReference } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { makeAutoObservable, runInAction } from 'mobx';
import AppStore from './AppStore';

export interface Profile {
    setUp: boolean
    name: string
    gender: string
    age: number
    city: string
    photoPath: string
}

export interface Filter {
    genders: string[]
    minAge: number
    maxAge: number
    city: string
}

export interface Activity {
    watched: string[]
    liked: string[]
}

export interface User {
    uid: string
    profile: Profile
    filter: Filter
    activity: Activity
}

const getEmptyUser = (uid: string): User => ({
    uid,
    profile: { setUp: false, name: '', gender: 'M', age: 20, city: '', photoPath: 'photos/' + uid },
    filter: { genders: ['F', 'M'], minAge: 0, maxAge: 100, city: 'Moscow' },
    activity: { watched: [], liked: [] }
});

const getDefaultFilter = (profile: Profile): Filter => ({
    genders: [profile.gender === 'M' ? 'F' : 'M'],
    minAge: profile.age - 5,
    maxAge: profile.age + 5,
    city: profile.city
});

export default class UserStore {
    private _user: User | null = null;
    private ref: DocumentReference | null = null;

    constructor(private appStore: AppStore) {
        this.appStore.auth.onAuthStateChanged(async (account) => {
            if (account) {
                this.ref = doc(appStore.firestore, 'users', account.uid);
                const user = (await getDoc(this.ref)).data() as User;
                runInAction(() => this._user = user ? user : getEmptyUser(account.uid));
                await setDoc(this.ref, this._user);
            }
            else {
                runInAction(() => this._user = null);
                this.ref = null;
            }
        });
        makeAutoObservable(this, {}, { autoBind: true });
    }

    public get user(): User | null { return this._user; }

    public async updateProfile(newProfile: Profile, photo: File | null): Promise<void> {
        if (!this._user)
            throw new Error('Tried to update profile without authentication.');

        newProfile.setUp = true;
        const newFilter = getDefaultFilter(newProfile);
        this._user.profile = newProfile;
        this._user.filter = newFilter;
        if (photo)
            await uploadBytes(ref(this.appStore.storage, newProfile.photoPath), photo);
        await updateDoc(this.ref!, { profile: newProfile, filter: newFilter });
    }

    public async like(candidate: User): Promise<void> {
        if (!this.ref)
            throw new Error('Tried to modify activity without authentication.');

        await updateDoc(this.ref, { activity: {
            watched: arrayUnion(candidate.uid),
            liked: arrayUnion(candidate.uid)
        }});
    }

    public async pass(candidate: User): Promise<void> {
        if (!this.ref)
            throw new Error('Tried to modify activity without authentication.');

        await updateDoc(this.ref, { activity: {
            watched: arrayUnion(candidate.uid)
        }});
    }
}