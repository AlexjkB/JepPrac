"use client";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarFooter, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

type RightSidebarProps = {
    title: string;
}

function cleanTitle(title: string): string {
    return title
        .replace(/_/g, " ")
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
                        {wikiData ? (
                            <div className="space-y-4">
                                <p className="font-bold">{wikiData.normalizedTitle}</p>
                                {wikiData.thumbnailUrl && (
                                    <img
                                        src={wikiData.thumbnailUrl}
                                        alt={wikiData.normalizedTitle}
                                        className="w-full rounded"
                                    />
                                )}
                                <div className="space-y-3 text-justify">
                                    {wikiData.extract.split("\n").map((para, idx) => (
                                        <p key={idx} className="text-sm leading-relaxed">
                                            {para}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>Loading Wikipedia info...</p>
                        )}
                    </div>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                </SidebarFooter>
        </Sidebar>
    );
}