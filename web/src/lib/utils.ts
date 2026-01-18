import type { RouteType } from '@/types/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tw-merge';

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export const normalizePath = (path: string) => {
    const clean = path.split("?")[0];
    const parts = clean.split("/").filter(Boolean);

    if (parts.length === 0) return "_root";
    return parts.join("/");
};

export const normalizeRoute = (route: RouteType): string => {
    if (route.index) return "_root";
    if (!route.path) return "_unknown";
    return normalizePath(route.path);
};

export const getLastNumber = (path: string) => {
    const parts = path.split("/");
    const last = parts[parts.length - 1];
    const num = Number(last);
    return isNaN(num) ? null : num;
};