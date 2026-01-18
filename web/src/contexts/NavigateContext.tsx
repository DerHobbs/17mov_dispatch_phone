import { createContext } from 'react';

import { type NavigateOptions, type To } from 'react-router-dom';

interface NavigateType {
    navigate: (to: To | number, options?: NavigateOptions) => void;
}

const NavigateContext = createContext<NavigateType | null>(null);

export default NavigateContext;
