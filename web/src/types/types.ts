import type { HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

export interface SettingsType {
    configured?: boolean;
    ringtoneVolume: number;
    notificationVolume: number;
    mediaVolume: number;
    easydrop: boolean;
    planemode: boolean;
    location: boolean;
    silentMode: boolean;
    flashlight: boolean;
    theme: 'light' | 'dark';
    wallpaper: string;
    ringtoneSound: string | null;
    notificationSound: string | null;
    streamerMode: boolean;
    pinCode: string | null;
    unlocked: boolean;
    faceId: string | null;
    frameColor: string;
    scale: number;
    performanceMode: boolean;
    temperatureUnit: string;
    language: string | null;
    companiesCalls: boolean;
    companiesNotifications: boolean;
    hideNumber: boolean;
    mycard: {
        image?: string;
        firstname?: string;
        lastname?: string;
        notes: string;
    };
}

export interface RouteType {
    path?: string;
    index?: boolean;
    element?: ReactNode;
    framerMotion?: boolean;
    className?: string;
    classNameOverride?: string;
    motion?: {
        initial?: HTMLMotionProps<'div'>['initial'];
        animate?: HTMLMotionProps<'div'>['animate'];
        exit?: HTMLMotionProps<'div'>['exit'];
    };
}
