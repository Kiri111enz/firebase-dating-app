import React, { useState, useEffect, useContext, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { Loader } from '@mantine/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { AppContext } from 'pages/_app';

const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
    const { auth, firestore } = useContext(AppContext);
    const [user, loading] = useAuthState(auth);
    const [profileSetUp, setProfileSetUp] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!user)
            return;

        const unsubscribe = onSnapshot(doc(firestore, 'users', user.uid),
            (doc) => setProfileSetUp(doc.data()?.profileSetUp));

        return () => unsubscribe();
    }, [user]);

    if (loading)
        return <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />;
    if (!user)
        void router.push('/auth');
    if (!profileSetUp)
        void router.push('/profile');
    return <>{children}</>;
};

export default RequireAuth;