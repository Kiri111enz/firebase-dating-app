import React, { ReactElement, ReactNode, createContext } from 'react';
import { NextPage} from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from 'firebaseConfig';
import RequireAuth from '../components/RequireAuth';
import Layout from '../components/Layout';
import 'styles/globals.css';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

export const MainPageLayout = (page: ReactElement): ReactNode => (
    <RequireAuth>
        <Layout>
            {page}
        </Layout>
    </RequireAuth>
);

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase);
const auth = getAuth(firebase);
const storage = getStorage();

export const AppContext = createContext({ firebase, firestore, auth, storage });

const App: React.FC<AppPropsWithLayout> = ({ Component, pageProps }) => {
    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <>
            <Head>
                <title>Dating App</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>

            <MantineProvider withGlobalStyles withNormalizeCSS>
                <AppContext.Provider value={{ firebase, firestore, auth, storage }}>
                    {getLayout(<Component {...pageProps} />)}
                </AppContext.Provider>
            </MantineProvider>
        </>
    );
};

export default App;