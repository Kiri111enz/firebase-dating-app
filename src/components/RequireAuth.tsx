import { useContext, PropsWithChildren } from 'react';
import { Loader } from '@mantine/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AppContext } from 'pages/_app';
import Auth from './Auth';

const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
    const { auth } = useContext(AppContext);
    const [user, loading] = useAuthState(auth);

    return loading ? <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /> : 
        user ? <>{children}</> : <Auth />;
};

export default RequireAuth;