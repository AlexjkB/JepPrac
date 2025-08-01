import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarFooter, SidebarProvider } from "@/components/ui/sidebar";

type LeftSidebarProps = {
    totalScore: number;
    totalCorrect: number;
    totalWrong: number;
    totalSkipped: number;
}

export function LeftSidebar({ totalScore, totalCorrect, totalWrong, totalSkipped }: LeftSidebarProps) {
    return (
        <Sidebar>
             <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
            <SidebarGroup>
                <p>Total Score: {totalScore}</p>
                <p>Total Correct: {totalCorrect}</p>
                <p>Total Wrong: {totalWrong}</p>
                <p>Total Skipped: {totalSkipped}</p>
            </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
        </Sidebar>
    );
}