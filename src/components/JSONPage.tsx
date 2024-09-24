"use client";

import { useState, useCallback, useEffect } from "react";
import { ListCollapse } from "lucide-react";

import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import JsonViewer from "./JSONViewer";

type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

export default function Component() {
    const [jsonInput, setJsonInput] = useState("");
    const [parsedJson, setParsedJson] = useState<JsonValue | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setJsonInput(e.target.value);
            try {
                const parsed = JSON.parse(e.target.value);
                setParsedJson(parsed);
                setError(null);
            } catch (err) {
                console.log({ err });
                setParsedJson(null);
                setError("Invalid JSON");
            }
        },
        []
    );

    useEffect(() => {
        const initialJson = {
            name: "John Doe",
            age: 30,
            isActive: true,
            hobbies: ["reading", "gaming", "hiking"],
            address: {
                street: "123 Main St",
                city: "Anytown",
                postalCode: "12345",
            },
            projects: [
                {
                    title: "Project A",
                    status: "completed",
                },
                {
                    title: "Project B",
                    status: "in progress",
                },
            ],
        };
        setJsonInput(JSON.stringify(initialJson, null, 2));
        setParsedJson(initialJson);
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50 p-4 gap-4">
            <div className="flex-1">
                <Textarea
                    placeholder="Enter your JSON here..."
                    className="w-full h-full resize-none p-4 font-mono text-sm border-gray-200 rounded-lg shadow-sm"
                    value={jsonInput}
                    onChange={handleInputChange}
                />
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 ">
                <ScrollArea className="h-full ">
                    {error ? (
                        <div className="text-red-500 font-semibold p-4">
                            {error}
                        </div>
                    ) : parsedJson ? (
                        <>
                            <div className="flex items-center justify-start gap-2 p-4 ">
                                <ListCollapse
                                    size={21}
                                    className="bg-slate-200  p-1 rounded text-slate-950 "
                                />
                                <h1 className="font-semibold text-slate-950">
                                    Cell details
                                </h1>
                            </div>
                            <hr />
                            <div className="p-4 ">
                                <JsonViewer data={parsedJson} />
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500 p-4 ">
                            Enter valid JSON to see the formatted output
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}
