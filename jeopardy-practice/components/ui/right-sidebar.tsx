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
        <Sidebar side="right">
            <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
            <SidebarGroup>
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
                    <p className="text-sm">{wikiData.extract}</p>
                    </div>
                ) : (
                    <p>Loading Wikipedia info...</p>    
                )}
            </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
        </Sidebar>
    );
}