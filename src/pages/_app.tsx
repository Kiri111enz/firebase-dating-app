import React, { createContext } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from 'firebaseConfig';
import 'styles/globals.css';

const firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase);
const auth = getAuth(firebase);

export const AppContext = createContext({ firebase, firestore, auth });

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
    <>
        <Head>
            <title>Dating App</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>

        <MantineProvider withGlobalStyles withNormalizeCSS>
            <AppContext.Provider value={{ firebase, firestore, auth }}>
                <Component {...pageProps} />
            </AppContext.Provider>
        </MantineProvider>
    </>
);

export default App;