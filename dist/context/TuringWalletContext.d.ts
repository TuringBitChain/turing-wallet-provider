import { ReactNode } from "react";
import { TuringProviderType } from "/dist/types/providerTypes";
export declare const TuringContext: import("react").Context<TuringProviderType | undefined>;
interface TuringProviderProps {
    children: ReactNode;
}
export declare const TuringProvider: (props:TuringProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
