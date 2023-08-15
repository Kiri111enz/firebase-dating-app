import { useContext } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { observer } from 'mobx-react-lite';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import ProfileFeed from 'components/ProfileFeed';

const Feed: NextPageWithLayout = observer(() => {
    const { firestore, userStore } = useContext(AppContext);

    return (
        <ProfileFeed fetchCandidates={() => getDocs(query(collection(firestore, 'users'),
            where('profile.gender', 'in', userStore.user!.filter.genders),
            where('profile.age', '<=', userStore.user!.filter.maxAge),
            where('profile.age', '>=', userStore.user!.filter.minAge),
            where('profile.city', '==', userStore.user!.filter.city)
        ))} deps={[userStore.user?.filter]} />
    );
});

Feed.getLayout = MainPageLayout;

export default Feed;