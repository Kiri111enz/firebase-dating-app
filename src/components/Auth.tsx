import React, { useContext, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import GoogleAuthButton from './GoogleAuthButton';
import { AppContext } from 'pages/_app';

const Auth: React.FC = () => {
    const { auth, firestore } = useContext(AppContext);
    const [provider] = useState(new GoogleAuthProvider());

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <GoogleAuthButton onClick={() => 
                signInWithPopup(auth, provider).
                    then(async (credentials) => {
                        const docRef = doc(firestore, 'users', credentials.user.uid);
                        const snapshot = await getDoc(docRef);
                        if (!snapshot.data())
                            await setDoc(docRef, {
                                profileSetUp: false
                            });
                    }).
                    catch(() => void 0)} />
        </div>
    );
};

export default Auth;