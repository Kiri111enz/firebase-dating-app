import { useContext, useState, useEffect } from 'react';
import { Loader, Text } from '@mantine/core';
import { useAnimate } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { observer } from 'mobx-react-lite';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import ProfileCard from 'components/ProfileCard';
import { User } from 'stores/UserStore';

const Feed: NextPageWithLayout = observer(() => {
    const { firestore, userStore } = useContext(AppContext);
    const [candidates, setCandidates] = useState<User[] | null>(null);
    const [candidateIndex, setCandidateIndex] = useState(0);
    const [scope, animate] = useAnimate();

    const nextCandidate = async (): Promise<void> => {
        await animate(scope.current, { y: +100, opacity: 0 }, { duration: 0.3 });
        await animate(scope.current, { y: -100 }, { duration: 0 });
        setCandidateIndex(candidateIndex + 1);
    };

    useEffect(() => {
        const filter = userStore.user!.filter;
        getDocs(query(collection(firestore, 'users'),
            where('profile.gender', 'in', filter.genders),
            where('profile.age', '<=', filter.maxAge),
            where('profile.age', '>=', filter.minAge),
            where('profile.city', '==', filter.city))
        ).then((querySnapshot) => {
            const users = querySnapshot.docs.map((docSnapshot) => docSnapshot.data() as User);
            const watched = new Set<string>(userStore.user!.activity.watched);
            setCandidates(users.filter((user) => !watched.has(user.uid)));
        });
    }, [userStore.user?.filter]);

    if (candidates === null)
        return <Loader />;

    if (candidateIndex >= candidates.length)
        return <Text>Sorry, no new candidates for you...</Text>;

    return (
        <div ref={scope} style={{ opacity: 0 }}>
            <ProfileCard imgClassName='max-h-[25rem] max-w-[40rem]' imgOnLoad={() =>
                animate(scope.current, { y: 0, opacity: 1 }, { duration: 0.5 })}
            profile={candidates[candidateIndex].profile}
            onLike={async () => {
                const candidate = candidates[candidateIndex];
                await nextCandidate();
                await userStore.like(candidate);
            }}
            onPass={async () => {
                const candidate = candidates[candidateIndex];
                await nextCandidate();
                await userStore.pass(candidate);
            }} />
        </div>
    );
});

Feed.getLayout = MainPageLayout;

export default Feed;