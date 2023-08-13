import React, { useContext, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { Loader } from '@mantine/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { observer } from 'mobx-react-lite';
import { AppContext } from 'pages/_app';

const RequireAuth: React.FC<PropsWithChildren> = observer(({ children }) => {
    const { auth, profileStore: { profile } } = useContext(AppContext);
    const [user, userLoading] = useAuthState(auth);
    const router = useRouter();

    if (!user && !userLoading)
        void router.push('/auth');
    else if (userLoading || !profile)
        return <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />;
    else if (!profile.setUp && router.pathname !== '/profile')
        void router.push('/profile');
    else return <>{children}</>;
});

export default RequireAuth;