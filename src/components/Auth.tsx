import { useContext, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import GoogleAuthButton from './GoogleAuthButton';
import { AppContext } from 'pages/_app';

const Auth: React.FC = () => {
    const { auth } = useContext(AppContext);
    const [provider] = useState(new GoogleAuthProvider());

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <GoogleAuthButton onClick={() => signInWithPopup(auth, provider).catch(() => void 0)} />
        </div>
    );
};

export default Auth;