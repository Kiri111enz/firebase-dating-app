import React, { useState, useEffect, createContext, useContext, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { Loader } from '@mantine/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { AppContext } from 'pages/_app';

export const ProfileContext = createContext({ profileSetUp: false });

const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
    const { auth, firestore } = useContext(AppContext);
    const [user, loading] = useAuthState(auth);
    const [profileSetUp, setProfileSetUp] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!user)
            return;

        const docRef = doc(firestore, 'users', user.uid);
        getDoc(docRef).then(snapshot => setProfileSetUp(snapshot.data()?.profileSetUp));
        const unsubscribe = onSnapshot(docRef, (doc) => setProfileSetUp(doc.data()?.profileSetUp));

        return () => unsubscribe();
    }, [user]);

    if (loading || profileSetUp === null)
        return <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />;
    if (!user)
        void router.push('/auth');
    if (!profileSetUp && router.pathname !== '/profile')
        void router.push('/profile');
    return (
        <ProfileContext.Provider value={{ profileSetUp }}>
            {children}
        </ProfileContext.Provider>
    );
};

export default RequireAuth;