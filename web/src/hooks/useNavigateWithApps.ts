import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { type NavigateOptions, useLocation } from 'react-router-dom';

import { useNavigate } from './useNavigate';
import { updateApp } from '@/store/appSlice';

export const useNavigateWithApps = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation() as {
        pathname: string;
        state?: { from?: string };
    };
    const isLocked = useRef(false);

    return useCallback(
        (toPath: string | -1, options?: NavigateOptions & { forceAuthenticate?: boolean }) => {
            if (isLocked.current) return;

            isLocked.current = true;

            dispatch(updateApp('toPage', toPath));

            if (toPath === -1) {
                if (location.state?.from) {
                    navigate(location.state.from, options);
                } else {
                    navigate(-1, options);
                }
            } else {
                navigate(toPath, {
                    state: { from: location.pathname },
                    ...options,
                });
            }

            setTimeout(() => {
                isLocked.current = false;
            }, 200);
        },
        [dispatch, navigate, location.pathname, location.state],
    );
};
