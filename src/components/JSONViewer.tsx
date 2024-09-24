import { CheckIcon, ChevronRightIcon, CopyIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { capitalizeFirstLetter } from "@/lib/utils";

type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

interface IProps {
    data: JsonValue;
}
const JsonViewer = ({ data }: IProps) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
        $: true,
    });
    const [copied, setCopied] = useState<string | null>(null);

    const toggleExpand = useCallback((path: string) => {
        setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
    }, []);

    const copyToClipboard = useCallback((path: string) => {
        navigator.clipboard.writeText(path).then(() => {
            setCopied(path);

            toast("Copied to clipboard!", {
                description: `Json path: ${path}`,
                duration: 5000,
            });
            setTimeout(() => setCopied(null), 2000);
        });
    }, []);

    const renderValue = useCallback(
        (value: JsonValue, path: string, key?: string): JSX.Element => {
            console.log("Path:", path);
            const isExpandable = typeof value === "object" && value !== null;
            const isExpanded = expanded[path];

            const itemCount = isExpandable
                ? Array.isArray(value)
                    ? value.length
                    : Object.keys(value).length
                : 0;

            const handleToggle = () => toggleExpand(path);
            const handleCopy = (e: React.MouseEvent) => {
                e.stopPropagation();
                copyToClipboard(path);
            };

            const renderPrimitiveValue = () => {
                if (value === null)
                    return <span className="text-gray-500">null</span>;
                if (typeof value === "boolean")
                    return (
                        <span className="text-blue-600">
                            {value.toString()}
                        </span>
                    );
                if (typeof value === "number")
                    return <span className="text-green-600">{value}</span>;
                if (typeof value === "string")
                    return <span className="text-slate-600">{value}</span>;
            };

            return (
                <>
                    <div className=" py-1">
                        <div className="flex items-center group ">
                            {isExpandable ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto mr-1   hover:bg-transparent "
                                    onClick={handleToggle}
                                >
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            rotate: isExpanded ? 90 : 0,
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronRightIcon
                                            size={16}
                                            className="text-gray-500"
                                        />
                                    </motion.div>
                                </Button>
                            ) : (
                                <span className="w-4 h-4 mr-3" />
                            )}

                            <div
                                className={`flex-1 flex items-center group  ${
                                    !isExpandable && "ml-[-1.55rem] "
                                } `}
                            >
                                {key !== undefined && (
                                    <span className="text-slate-900 font-semibold mr-2 ">
                                        <div className=" flex items-center gap-2">
                                            {!isExpandable && (
                                                <p className=" bg-blue-200 text-blue-600 text-center w-4 text-xs h-4 p-1 rounded border border-blue-400 flex items-center justify-center">
                                                    T
                                                </p>
                                            )}
                                            <span className="">
                                                {capitalizeFirstLetter(key)}
                                            </span>
                                        </div>
                                    </span>
                                )}
                                {isExpandable ? (
                                    <span className="text-gray-700">
                                        {/* {Array.isArray(value) ? "[" : "{"} */}
                                        {itemCount > 0 && (
                                            <span className="text-gray-500   text-sm">
                                                {`[${itemCount}`}
                                                {itemCount === 1
                                                    ? " item]"
                                                    : " items]"}
                                            </span>
                                        )}
                                    </span>
                                ) : (
                                    renderPrimitiveValue()
                                )}
                            </div>
                            {!isExpandable && (
                                <div
                                    onClick={handleCopy}
                                    className="flex items-center justify-center gap-1"
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className=" p-1 h-auto w-auto border ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        {copied === path ? (
                                            <CheckIcon
                                                size={14}
                                                className="text-green-500"
                                            />
                                        ) : (
                                            <CopyIcon
                                                size={14}
                                                className="text-gray-400 hover:text-gray-600"
                                            />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className=" p-0 px-1 border h-auto text-sm ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Create column
                                    </Button>
                                </div>
                            )}
                        </div>
                        <AnimatePresence>
                            {isExpanded && isExpandable && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-2 pl-2 border-l border-gray-200 overflow-hidden"
                                >
                                    {Array.isArray(value)
                                        ? value.map((item, index) => (
                                              <div key={index}>
                                                  {renderValue(
                                                      item,
                                                      `${path}[${index}]`,
                                                      index.toString()
                                                  )}
                                              </div>
                                          ))
                                        : Object.entries(value).map(
                                              ([childKey, childValue]) => (
                                                  <div key={childKey}>
                                                      {renderValue(
                                                          childValue,
                                                          `${path}.${childKey}`,
                                                          childKey
                                                      )}
                                                  </div>
                                              )
                                          )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            );
        },
        [expanded, toggleExpand, copyToClipboard, copied]
    );

    return <div className="font-mono text-sm">{renderValue(data, "$")}</div>;
};

export default JsonViewer;
