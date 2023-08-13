import React, { useContext, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import GoogleAuthButton from 'components/GoogleAuthButton';
import { AppContext } from 'pages/_app';

const Auth: NextPage = () => {
    const { auth } = useContext(AppContext);
    const [provider] = useState(new GoogleAuthProvider());
    const router = useRouter();

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <GoogleAuthButton onClick={() =>
                signInWithPopup(auth, provider)
                    .then(() => void router.push('/'))
                    .catch(() => void 0)} />
        </div>
    );
};

export default Auth;