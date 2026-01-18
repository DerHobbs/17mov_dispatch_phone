import { type ReactNode, useCallback } from 'react';
import { type NavigateOptions, type To, useLocation, useNavigate as useNavigateReactRouter } from 'react-router-dom';

import NavigateContext from '@/contexts/NavigateContext';

const NavigateProvider = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const navigateReactRouter = useNavigateReactRouter();

    const navigate = useCallback(
        (to: To | number, options?: NavigateOptions & { forceAuthenticate?: boolean }): void => {
            if (typeof to === 'number') {
                navigateReactRouter(to);
            } else {
                if (typeof to === 'string' && !to.startsWith('/')) {
                    to = (location.pathname == '/' ? location.pathname : location.pathname + '/') + to;
                }

                navigateReactRouter(to, options);
            }
        },
        [navigateReactRouter, location.pathname],
    );

    return <NavigateContext.Provider value={{ navigate }}>{children}</NavigateContext.Provider>;
};

export default NavigateProvider;
