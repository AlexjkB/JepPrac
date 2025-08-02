import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

type LeftSidebarProps = {
    totalScore: number;
    totalCorrect: number;
    totalWrong: number;
    totalSkipped: number;
}

const formatScore = (score: number) => {
  const abs = Math.abs(score).toLocaleString("en-US");
  return score < 0 ? `-$${abs}` : `$${abs}`;
};

export function LeftSidebar({ totalScore, totalCorrect, totalWrong, totalSkipped }: LeftSidebarProps) {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="p-4 ">
                    <SidebarGroup className="space-y-1">
                        <Badge className="mb-2 text-lg">Game Stats</Badge>
                        <div className="flex items-center justify-between w-full">
                            <p>Score:</p>
                            <Badge className="bg-blue-500 text-white">{formatScore(totalScore)}</Badge>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p>Correct:</p>
                            <Badge className="bg-green-500 text-white">{totalCorrect}</Badge>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p>Incorrect:</p>
                            <Badge className="bg-red-500 text-white">{totalWrong}</Badge>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p>Skipped:</p>
                            <Badge className="bg-yellow-500 text-white">{totalSkipped}</Badge>
                        </div>
                    </SidebarGroup>
                </div>
            </SidebarHeader>
            <SidebarContent>
            </SidebarContent>
            <SidebarFooter>

                <div className="p-4">

                    <Badge className="mb-2 text-lg">Hotkeys</Badge>
                    <ul>
                        <li><Badge variant="secondary">j</Badge> - New Question</li>
                        <li><Badge variant="secondary">s</Badge> - Show Answer</li>
                        <li><Badge variant="secondary">space</Badge> - Attempt Answer</li>
                    </ul>
                </div>
            </SidebarFooter>
        </Sidebar >
    );
}