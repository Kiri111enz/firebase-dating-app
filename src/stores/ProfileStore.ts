import { doc, getDoc, setDoc, updateDoc, onSnapshot, DocumentReference } from 'firebase/firestore';
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

const getEmptyProfile = (photoPath: string): Profile => ({
    setUp: false,
    name: '',
    gender: 'M',
    age: 20,
    city: '',
    photoPath
});

export default class ProfileStore {
    private _profile: Profile | null = null;
    private ref: DocumentReference | null = null;

    constructor(private appStore: AppStore) {
        this.appStore.auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.ref = doc(this.appStore.firestore, 'profiles', user.uid);
                const profile = (await getDoc(this.ref)).data() as Profile;
                runInAction(() => this._profile = profile);
                if (!this._profile) {
                    runInAction(() => this._profile = getEmptyProfile('photos/' + user.uid));
                    await setDoc(this.ref, this._profile);
                }
                onSnapshot(this.ref, (snapshot) => runInAction(() => this._profile = snapshot.data() as Profile));
            }
            else {
                runInAction(() => this._profile = null);
                this.ref = null;
            }
        });
        makeAutoObservable(this, {}, { autoBind: true });
    }

    public get profile(): Profile | null { return this._profile; }

    public async updateProfile(newProfile: Profile, photo: File | null): Promise<void> {
        newProfile.setUp = true;
        this._profile = newProfile;
        if (photo)
            await uploadBytes(ref(this.appStore.storage, this._profile.photoPath), photo);
        await this.appStore.filterStore.createDefaultFilter();
        await updateDoc(this.ref!, {...this._profile});
    }
}