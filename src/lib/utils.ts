import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const capitalizeFirstLetter = (key: string): string => {
    return key.charAt(0).toUpperCase() + key.slice(1);
};
