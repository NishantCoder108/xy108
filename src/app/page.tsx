"use client";

import JsonPage from "@/components/JSONPage";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
    return (
        <div>
            <JsonPage />
            <Toaster />
        </div>
    );
}
