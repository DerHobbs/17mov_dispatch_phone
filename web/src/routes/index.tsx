import type { RouteType } from '@/types/types';

import Homepage from '@/views/Homepage';
import Page from '@/views/Page';

export const AppRoutes: RouteType[] = [
    {
        path: '/',
        element: <Homepage />,
        className: '',
    },
    {
        path: '/page',
        element: <Page />,
        className: '',
    },
];
