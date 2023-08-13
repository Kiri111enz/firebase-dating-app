import { doc, setDoc } from 'firebase/firestore';
import AppStore from './AppStore';
import { Profile } from 'stores/ProfileStore';

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
    constructor(private appStore: AppStore) { }

    public async createDefaultFilter(): Promise<void> {
        await setDoc(
            doc(this.appStore.firestore, 'filters', this.appStore.auth.currentUser!.uid),
            getDefaultFilter(this.appStore.profileStore.profile!)
        );
    }
}