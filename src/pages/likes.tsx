import { useContext } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { observer } from 'mobx-react-lite';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import ProfileFeed from 'components/ProfileFeed';

const Likes: NextPageWithLayout = observer(() => {
    const { firestore, userStore } = useContext(AppContext);

    return (
        <ProfileFeed fetchCandidates={() => getDocs(query(collection(firestore, 'users'),
            where('activity.liked', 'array-contains', userStore.user!.uid),
        ))} />
    );
});

Likes.getLayout = MainPageLayout;

export default Likes;