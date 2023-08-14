import { useContext, useState, useEffect } from 'react';
import { Loader, Text } from '@mantine/core';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextPageWithLayout, MainPageLayout, AppContext } from './_app';
import ProfileCard from 'components/ProfileCard';
import { Profile } from 'stores/ProfileStore';

const Feed: NextPageWithLayout = () => {
    const { firestore, filterStore } = useContext(AppContext);
    const [candidates, setCandidates] = useState<Profile[]>(new Array(0));
    const [candidateIndex, setCandidateIndex] = useState(0);

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

    if (!candidates.length)
        return <Loader />;

    if (candidateIndex >= candidates.length)
        return <Text>Sorry, no new candidates for you...</Text>;

    return (
        <ProfileCard imgClassName='max-h-[25rem] max-w-[40rem]'
            profile={candidates[candidateIndex]}
            onLike={() => setCandidateIndex(candidateIndex + 1)}
            onPass={() => setCandidateIndex(candidateIndex + 1)} />
    );
};

Feed.getLayout = MainPageLayout;

export default Feed;