import React, { createContext, ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import RequireAuth from 'components/RequireAuth';
import Layout from 'components/Layout';
import AppStore from 'stores/AppStore';
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

export const AppContext = createContext({} as AppStore);
const appStore = new AppStore();

const App: React.FC<AppPropsWithLayout> = ({ Component, pageProps }) => {
    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <>
            <Head>
                <title>Dating App</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>

            <MantineProvider withGlobalStyles withNormalizeCSS>
                <AppContext.Provider value={appStore}>
                    {getLayout(<Component {...pageProps} />)}
                </AppContext.Provider>
            </MantineProvider>
        </>
    );
};

export default App;