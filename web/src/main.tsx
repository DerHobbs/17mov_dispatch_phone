import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import App from '@/App.tsx';
import ProvidersManager from '@/providers/index.tsx';
import ExternalRpcBridge from '@/ExternalRpcBridge.tsx';

import '@/index.css';
import { StoreManagers } from './managers';

window.LoadRoot = () => {
    createRoot(document.getElementById('root')!).render(
        <HashRouter future={{ v7_relativeSplatPath: false, v7_startTransition: false }}>
            <ProvidersManager>
                <ExternalRpcBridge />
                <StoreManagers />
                <App />
            </ProvidersManager>
        </HashRouter>,
    );
};