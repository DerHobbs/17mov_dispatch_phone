import { type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';

import { cn, getLastNumber, normalizePath, normalizeRoute } from '@/lib/utils';
import { appStore } from '@/store/appSlice';
import type { RouteType } from '@/types/types';

const GetEnterMotionFromSiblings = (
    siblings: RouteType[],
    currentLocation: string,
    toPage: string | -1
) => {
    if (toPage === -1) return { x: "-100%" };

    const fromNorm = normalizePath(currentLocation);
    const toNorm = normalizePath(toPage);

    let fromIndex = siblings.findIndex((r) => normalizeRoute(r) === fromNorm);
    let toIndex = siblings.findIndex((r) => normalizeRoute(r) === toNorm);

    if (fromIndex === -1) fromIndex = siblings.length - 1;
    if (toIndex === -1) toIndex = 0;

    if (fromIndex === toIndex && fromIndex !== -1) {
        const fromNum = getLastNumber(fromNorm);
        const toNum = getLastNumber(toNorm);

        if (fromNum !== null && toNum !== null) {
            if (fromNum > toNum) return { x: "-100%" };
            if (fromNum < toNum) return { x: "100%" };
        }
    }

    const isBack = fromIndex > toIndex;
    return isBack ? { x: "100%" } : { x: "-100%" };
};

const GetExitMotionFromSiblings = (
    siblings: RouteType[],
    currentLocation: string,
    fromPage: string | -1
) => {
    if (fromPage === -1) return { x: "100%" };

    const toNorm = normalizePath(currentLocation);
    const fromNorm = normalizePath(fromPage);

    let fromIndex = siblings.findIndex((r) => normalizeRoute(r) === fromNorm);
    let toIndex = siblings.findIndex((r) => normalizeRoute(r) === toNorm);

    if (fromIndex === -1) fromIndex = siblings.length - 1;
    if (toIndex === -1) toIndex = 0;

    if (fromIndex === toIndex && fromIndex !== -1) {
        const fromNum = getLastNumber(fromNorm);
        const toNum = getLastNumber(toNorm);

        if (fromNum !== null && toNum !== null) {
            if (fromNum > toNum) return { x: "100%" };
            if (fromNum < toNum) return { x: "-100%" };
        }
    }

    const isBack = fromIndex > toIndex;
    return isBack ? { x: "-100%" } : { x: "100%" };
};


interface InsideAppVariantProps {
    from?: string;
    currentLocation: string;
    toPage: string | -1 | null;
    siblings: RouteType[];
}

const InsideAppAnimation = ({
    children,
    className,
    classNameOverride,
    siblings,
    animationEnabled,
}: {
    children: ReactNode;
    className?: string;
    classNameOverride?: string;
    motionProps?: HTMLMotionProps<'div'>;
    enable?: boolean;
    siblings: RouteType[];
    animationEnabled: boolean;
}) => {
    const app = useSelector(appStore);
    const location = useLocation();
    const state = location.state as { from?: string };

    if (!animationEnabled) {
        return (
            <div
                className={
                    classNameOverride ??
                    cn(
                        "absolute left-[-1px] top-0 size-full !w-[302px] will-change-transform overflow-y-auto overflow-x-hidden px-3 pt-4 pb-12 bg-white dark:bg-[#03050B]",
                        className
                    )
                }
            >
                {children}
            </div>
        );
    }

    return (
        <motion.div
            className={
                classNameOverride ??
                cn(
                    "absolute left-[-1px] top-0 size-full !w-[302px] will-change-transform overflow-y-auto overflow-x-hidden px-3 pt-4 pb-12 bg-white dark:bg-[#03050B]",
                    className
                )
            }
            variants={{
                initial: ({
                    from,
                    currentLocation,
                    toPage,
                    siblings,
                }: InsideAppVariantProps) => {
                    if (from && from !== currentLocation && toPage) {
                        const fromNorm = normalizePath(from);
                        const toNorm = normalizePath(currentLocation);

                        let fromIndex = siblings.findIndex(
                            (r) => normalizeRoute(r) === fromNorm
                        );
                        let toIndex = siblings.findIndex(
                            (r) => normalizeRoute(r) === toNorm
                        );

                        if (fromIndex === -1) fromIndex = siblings.length - 1;
                        if (toIndex === -1) toIndex = 0;

                        const isBack = fromIndex > toIndex;

                        return isBack
                            ? { x: "-100%" }
                            : { x: "100%" };
                    }

                    if (!toPage) return { x: "0%" };

                    return { x: "100%" };
                },
                animate: {
                    x: "0%",
                },
                exit: ({
                    toPage,
                    siblings,
                    currentLocation,
                }: InsideAppVariantProps) => {
                    if (toPage) {
                        return GetExitMotionFromSiblings(
                            siblings,
                            currentLocation,
                            toPage
                        );
                    }

                    return { x: "100%" };
                },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={{
                from: state?.from,
                currentLocation: location.pathname,
                toPage: app.toPage,
                siblings,
            }}
            transition={{
                ease: "easeInOut",
                duration: 0.2,
            }}
        >
            {children}
        </motion.div>
    );
};

const AppSubRoutes = ({ routes }: { routes: RouteType[] }) => {
    const location = useLocation();

    const segments = location.pathname.split("/").filter(Boolean);
    const activeKey = segments.length === 0 
        ? "_root" 
        : segments.join("/");

    return (
        <AnimatePresence mode="sync" initial={false}>
            <Routes location={location} key={activeKey}>
                {routes.map((route) => (
                    <Route
                        key={route.index ? "_" : (route.path ?? "_")}
                        index={route.index}
                        path={route.index ? undefined : route.path}
                        element={
                            <InsideAppAnimation
                                classNameOverride={route.classNameOverride}
                                className={route.className}
                                motionProps={route.motion}
                                siblings={routes}
                                animationEnabled={route.framerMotion ?? true}
                            >
                                {route.element}
                            </InsideAppAnimation>
                        }
                    />
                ))}
            </Routes>
        </AnimatePresence>
    );
};

export { AppSubRoutes, GetEnterMotionFromSiblings, GetExitMotionFromSiblings };