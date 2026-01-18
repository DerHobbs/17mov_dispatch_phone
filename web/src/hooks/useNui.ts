import { useState, useRef, useCallback, useEffect, useContext } from 'react';
import { NuiContext } from '@/providers/NuiProvider';

export const useNuiEvent = <Payload = unknown>(action: string, handler: (payload: Payload) => void) => {
    const context = useContext(NuiContext);
    const handlerRef = useRef(handler);

    if (!context) throw new Error('useNuiEvent must be used within a NuiProvider');

    const { registerCallback, unregisterCallback } = context;

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        const wrappedHandler = (payload: unknown) => {
            handlerRef.current(payload as Payload);
        };

        registerCallback(action, wrappedHandler);

        return () => {
            unregisterCallback(action);
        };
    }, [registerCallback, unregisterCallback, action]);
};

export const useNuiCallback = <Payload = unknown, Response = unknown>(
    action: string,
): [
    sendNuiCallback: Payload extends Record<string, unknown>
        ? (payload: Payload) => Promise<Response | null>
        : () => Promise<Response | null>,
    loading: boolean,
] => {
    const [isLoading, setIsLoading] = useState(false);
    const isSending = useRef(false);

    const sendNuiCallback = useCallback(
        async (payload?: Payload) => {
            isSending.current = true;
            setIsLoading(true);

            try {
                const res = await fetch(`https://${window.name}/${action}`, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: payload !== undefined ? JSON.stringify(payload) : null,
                });

                return (await res.json()) as Response;
            } catch (err: unknown) {
                console.error(`Error occurred while calling ${action} NUI callback:`, err);
                return null;
            } finally {
                setIsLoading(false);
                isSending.current = false;
            }
        },
        [action],
    );

    return [
        sendNuiCallback as Payload extends Record<string, unknown>
            ? (payload: Payload) => Promise<Response | null>
            : () => Promise<Response | null>,
        isLoading,
    ];
};
