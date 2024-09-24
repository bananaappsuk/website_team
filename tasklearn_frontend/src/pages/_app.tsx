import { AppProps } from 'next/app';
import { TaskProvider } from '../components/TaskContext';
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <TaskProvider>
            <Component {...pageProps} />
        </TaskProvider>
    );
}

export default MyApp;
