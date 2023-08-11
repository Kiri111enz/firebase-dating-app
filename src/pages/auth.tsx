import React, { useContext, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { AppContext } from 'pages/_app';
import { Profile } from 'components/RequireAuth';

const emptyProfile: Profile = {
    setUp: false,
    name: '',
    gender: 'M',
    age: 20,
    city: '',
    photoPath: ''
};

const Auth: NextPage = () => {
    const { auth, firestore } = useContext(AppContext);
    const [provider] = useState(new GoogleAuthProvider());
    const router = useRouter();

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <GoogleAuthButton onClick={() => 
                signInWithPopup(auth, provider)
                    .then(async (credentials) => {
                        const profileRef = doc(firestore, 'profiles', credentials.user.uid);
                        const profile = (await getDoc(profileRef)).data();
                        if (!profile) {
                            emptyProfile.photoPath = 'photos/' + credentials.user.uid;
                            await setDoc(profileRef, emptyProfile);
                        }
                        await router.push('/');
                    })
                    .catch(() => void 0)} />
        </div>
    );
};

export default Auth;