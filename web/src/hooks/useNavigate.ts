import { useContext } from 'react';
import NavigateContext from '@/contexts/NavigateContext';

export const useNavigate = () => {
    const context = useContext(NavigateContext);

    if (!context) {
        throw new Error('useNavigate must be used within a NavigateProvider');
    }

    return context.navigate;
};
