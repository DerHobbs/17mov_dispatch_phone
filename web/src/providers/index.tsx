import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import store from '@/store';

import LanguageProvider from './LanguageProvider';
import NavigateProvider from './NavigateProvider';
import NuiProvider from './NuiProvider';

const ProvidersManager = ({ children }: { children: ReactNode }) => {
    return (
        <Provider store={store}>
            <NavigateProvider>
                <NuiProvider>
                    <LanguageProvider>{children}</LanguageProvider>
                </NuiProvider>
            </NavigateProvider>
        </Provider>
    );
};

export default ProvidersManager;
