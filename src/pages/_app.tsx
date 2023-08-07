import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { rtlCache } from 'rtl-cache';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
    <>
        <Head>
            <title>Dating App</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>

        <MantineProvider withGlobalStyles withNormalizeCSS emotionCache={rtlCache}> 
            <Component {...pageProps} />
        </MantineProvider>
    </>
);

export default App;