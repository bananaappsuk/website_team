import { AppProps } from 'next/app';
import { TaskProvider } from '../components/TaskContext';
import { AuthProvider } from '../auth';
import Head from 'next/head';
import TL from "../../src/app/Logo.png";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>T-askLearn</title>
                <link rel="icon" href={TL.src} />
            </Head>
            <AuthProvider>
                <TaskProvider>
                    <Component {...pageProps} />
                </TaskProvider>
            </AuthProvider>
        </>
    );
}

export default MyApp;
