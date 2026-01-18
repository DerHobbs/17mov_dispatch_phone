import { type ReactNode, createContext, useCallback, useEffect, useState } from 'react';

type Handler = (payload: unknown) => void;

interface NuiContextType {
    registerCallback: (name: string, cb: Handler) => void;
    unregisterCallback: (name: string) => void;
}

export const NuiContext = createContext<NuiContextType | null>(null);

const NuiProvider = ({ children }: { children: ReactNode }) => {
    const [handlers, setHandlers] = useState<Record<string, Handler>>({});

    const registerCallback = useCallback((name: string, cb: Handler) => {
        setHandlers((handlers) => ({ ...handlers, [name]: cb }));
    }, []);

    const unregisterCallback = useCallback((name: string) => {
        setHandlers((prev) => {
            const { [name]: _, ...rest } = prev;
            return rest;
        });
    }, []);

    useEffect(() => {
        const onMessage = (e: MessageEvent<{ action: string; payload?: unknown }>) => {
            const data = e.data;

            if (handlers[data.action]) {
                handlers[data.action](data.payload);
            }
        };

        window.addEventListener('message', onMessage);

        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, [handlers]);

    return (
        <NuiContext.Provider
            value={{
                registerCallback,
                unregisterCallback,
            }}
        >
            {children}
        </NuiContext.Provider>
    );
};

export default NuiProvider;
