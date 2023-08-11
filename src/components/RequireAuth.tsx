import React, { useState, useEffect, createContext, useContext, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { Loader } from '@mantine/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, DocumentReference } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { AppContext } from 'pages/_app';

export interface Profile {
    setUp: boolean
    name: string
    gender: string
    age: number
    city: string
    photoPath: string
}

export const ProfileContext = createContext<Profile>({} as Profile);

const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
    const { auth, firestore } = useContext(AppContext);
    const [user, userLoading] = useAuthState(auth);
    const [profileRef, setProfileRef] = useState<DocumentReference | null>(null);
    const [profile] = useDocumentData(profileRef);
    const router = useRouter();

    useEffect(() => {
        setProfileRef(user ? doc(firestore, 'profiles', user.uid) : null);
    }, [user]);

    if (!user && !userLoading)
        void router.push('/auth');
    else if (userLoading || !profile)
        return <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />;
    else if (!profile.setUp && router.pathname !== '/profile')
        void router.push('/profile');
    else return (
        <ProfileContext.Provider value={ profile as Profile }>
            {children}
        </ProfileContext.Provider>
    );
};

export default RequireAuth;