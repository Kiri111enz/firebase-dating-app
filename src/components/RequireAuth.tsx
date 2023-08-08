import React, { useState, useEffect, useContext, PropsWithChildren } from 'react';
import { Loader } from '@mantine/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { AppContext } from 'pages/_app';
import Auth from './Auth';
import ProfileEdit from './ProfileEdit';

const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
    const { auth, firestore } = useContext(AppContext);
    const [user, loading] = useAuthState(auth);
    const [profileSetUp, setProfileSetUp] = useState(false);

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
        return <Auth />;
    if (!profileSetUp)
        return <ProfileEdit />;
    return <>{children}</>;
};

export default RequireAuth;