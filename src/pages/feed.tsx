import { useContext, useState, useEffect } from 'react';
import { Loader, Text } from '@mantine/core';
import { useAnimate } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import ProfileCard from 'components/ProfileCard';
import { Profile } from 'stores/ProfileStore';

const Feed: NextPageWithLayout = () => {
    const { firestore, filterStore } = useContext(AppContext);
    const [candidates, setCandidates] = useState<Profile[] | null>(null);
    const [candidateIndex, setCandidateIndex] = useState(0);
    const [scope, animate] = useAnimate();

    const nextCandidate = async (): Promise<void> => {
        await animate(scope.current, { y: +100, opacity: 0 }, { duration: 0.3 });
        await animate(scope.current, { y: -100 }, { duration: 0 });
        setCandidateIndex(candidateIndex + 1);
    };

    useEffect(() => {
        filterStore.getFilter().then((filter) => {
            getDocs(query(collection(firestore, 'profiles'),
                where('gender', '==', filter!.gender),
                where('age', '<=', filter!.maxAge),
                where('age', '>=', filter!.minAge),
                where('city', '==', filter!.city))
            ).then((querySnapshot) => setCandidates(
                querySnapshot.docs.map((docSnapshot) => docSnapshot.data() as Profile))
            );
        });
    }, []);

    if (candidates === null)
        return <Loader />;

    if (candidateIndex >= candidates.length)
        return <Text>Sorry, no new candidates for you...</Text>;

    return (
        <div ref={scope} style={{ opacity: 0 }}>
            <ProfileCard imgClassName='max-h-[25rem] max-w-[40rem]' imgOnLoad={() =>
                animate(scope.current, { y: 0, opacity: 1 }, { duration: 0.5 })}
            profile={candidates[candidateIndex]}
            onLike={nextCandidate}
            onPass={nextCandidate} />
        </div>
    );
};

Feed.getLayout = MainPageLayout;

export default Feed;