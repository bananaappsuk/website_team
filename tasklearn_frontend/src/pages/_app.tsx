import { AppProps } from 'next/app';
import { TaskProvider } from '../components/TaskContext';
import { AuthProvider } from '../auth';
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <TaskProvider>
                <Component {...pageProps} />
            </TaskProvider>
        </AuthProvider>
    );
}

export default MyApp;
