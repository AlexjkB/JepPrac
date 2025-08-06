"use client";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from  "next/image";

type RightSidebarProps = {
    title: string;
}

function cleanTitle(title: string): string {
    return title
        .replace(/_/g, " ") 
        .replace(/['"`]/g, "")
        .replace(/[()]/g, "")
        .trim()
        .replace(/^(the|a|an)\s+/i, "");
}

type WikiData = {
    normalizedTitle: string;
    thumbnailUrl: string | null;
    extract: string;
}


export function RightSidebar({ title }: RightSidebarProps) {
    const [wikiData, setWikiData] = useState<WikiData | null>(null);

    useEffect(() => {
        if (!title) return;

        const fetchWikiData = async () => {
            try {
                const cleaned = cleanTitle(title);
                const res = await fetch(`/api/wiki?title=${encodeURIComponent(cleaned)}`);
                if (!res.ok) throw new Error("Failed to fetch wiki data");

                const data = await res.json();
                setWikiData(data);
            } catch (err) {
                console.error(err);
                setWikiData(null);
            }
        };

        fetchWikiData();
    }, [title]);

    return (
        <Sidebar side="right" className="w-96">
            <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className="p-4" >
                        <AnimatePresence mode="wait">
                            {wikiData ? (
                                <motion.div
                                    key={title} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    <p className="font-bold">{title}</p>
                                    {wikiData.thumbnailUrl && (
                                        <Image
                                            src={wikiData.thumbnailUrl}
                                            alt={wikiData.normalizedTitle}
                                            width={400}       
                                            height={300}      
                                            className="w-full rounded object-cover"
                                        />
                                    )}
                                    <div className="space-y-3 text-justify">
                                        {wikiData.extract.split("\n").map((para, idx) => (
                                            <p key={idx} className="text-sm leading-relaxed">
                                                {para}
                                            </p>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.p
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    Loading Wikipedia info...
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
        </Sidebar>
    );
}