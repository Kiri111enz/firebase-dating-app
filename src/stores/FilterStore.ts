import { doc, getDoc, setDoc, DocumentReference } from 'firebase/firestore';
import { runInAction } from 'mobx';
import AppStore from './AppStore';
import { Profile } from './ProfileStore';

export interface Filter {
    gender: string
    minAge: number
    maxAge: number
    city: string
}

const getDefaultFilter = (profile: Profile): Filter => ({
    gender: profile.gender === 'M' ? 'F' : 'M',
    minAge: profile.age - 5,
    maxAge: profile.age + 5,
    city: profile.city
});

export default class FilterStore {
    private _filter: Filter | null = null;
    private ref: DocumentReference | null = null;

    constructor(private appStore: AppStore) {
        this.appStore.auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.ref = doc(this.appStore.firestore, 'filters', user.uid);
                const filter = (await getDoc(this.ref)).data();
                runInAction(() => this._filter = filter ? filter as Filter : null);
            }
            else {
                this._filter = null;
                this.ref = null;
            }
        });
    }

    public get filter(): Filter | null { return this._filter; }

    public async updateFilter(filter: Filter): Promise<void> {
        if (!this.ref)
            return;

        this._filter = filter;
        await setDoc(this.ref, this._filter);
    }

    public async setDefaultFilter(): Promise<void> {
        await this.updateFilter(getDefaultFilter(this.appStore.profileStore.profile!));
    }
}