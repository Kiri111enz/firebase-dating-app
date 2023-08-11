import React, { useState, useEffect, createContext, useContext, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { Loader } from '@mantine/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { AppContext } from 'pages/_app';

export interface Profile {
    setUp: boolean
}

export const ProfileContext = createContext<Profile>({} as Profile);

const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
    const { auth, firestore } = useContext(AppContext);
    const [user, loading] = useAuthState(auth);
    const [profile, setProfile] = useState<Profile | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!user)
            return;

        const docRef = doc(firestore, 'profiles', user.uid);
        getDoc(docRef).then(snapshot => setProfile(snapshot.data() as Profile));
        const unsubscribe = onSnapshot(docRef, (doc) => setProfile(doc.data() as Profile));

        return () => unsubscribe();
    }, [user]);

    if (loading || (user && profile === null))
        return <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />;
    if (!user)
        void router.push('/auth');
    else if (!profile!.setUp && router.pathname !== '/profile')
        void router.push('/profile');
    else return (
        <ProfileContext.Provider value={ profile! }>
            {children}
        </ProfileContext.Provider>
    );
};

export default RequireAuth;