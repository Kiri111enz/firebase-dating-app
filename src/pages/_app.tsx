import { createContext } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from 'firebaseConfig';
import 'styles/globals.css';

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);

export const AppContext = createContext({ firebase, auth });

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
    <>
        <Head>
            <title>Dating App</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>

        <MantineProvider withGlobalStyles withNormalizeCSS>
            <AppContext.Provider value={{ firebase, auth }}>
                <Component {...pageProps} />
            </AppContext.Provider>
        </MantineProvider>
    </>
);

export default App;