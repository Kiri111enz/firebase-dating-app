import React, { useContext, useState, useEffect, DependencyList } from 'react';
import { Loader, Text } from '@mantine/core';
import { useAnimate } from 'framer-motion';
import { QuerySnapshot } from '@firebase/firestore';
import { observer } from 'mobx-react-lite';
import { AppContext } from 'pages/_app';
import ProfileCard from './ProfileCard';
import { User, Choice } from 'stores/UserStore';

interface ProfileFeedProps {
    fetchCandidates: () => Promise<QuerySnapshot>
    deps?: DependencyList | undefined
}

const ProfileFeed: React.FC<ProfileFeedProps> = observer(({ fetchCandidates, deps }) => {
    const { userStore } = useContext(AppContext);
    const [candidates, setCandidates] = useState<User[] | null>(null);
    const [candidateIndex, setCandidateIndex] = useState(0);
    const [scope, animate] = useAnimate();

    const nextCandidate = async (choice: Choice): Promise<void> => {
        await animate(scope.current, { y: +100, opacity: 0 }, { duration: 0.3 });
        await animate(scope.current, { y: -100 }, { duration: 0 });
        await userStore.markAsWatched(candidates![candidateIndex], choice);
        setCandidateIndex(candidateIndex + 1);
    };

    useEffect(() => {
        fetchCandidates().then((querySnapshot) => {
            const users = querySnapshot.docs.map((docSnapshot) => docSnapshot.data() as User);
            const watched = new Set<string>(userStore.user!.activity.watched);
            const myUid = userStore.user!.uid;
            setCandidates(users.filter((user) => (!watched.has(user.uid)) && user.uid !== myUid));
        });
    }, [deps]);

    if (candidates === null)
        return <Loader />;

    if (candidateIndex >= candidates.length)
        return <Text>Sorry, no new candidates for you...</Text>;

    return (
        <div ref={scope} style={{ opacity: 0 }}>
            <ProfileCard imgClassName='max-h-[50dvh] max-w-[80vw]' imgOnLoad={() =>
                animate(scope.current, { y: 0, opacity: 1 }, { duration: 0.5 })}
            profile={candidates[candidateIndex].profile}
            onLike={() => nextCandidate(Choice.Like)}
            onPass={() => nextCandidate(Choice.Pass)} />
        </div>
    );
});

export default ProfileFeed;