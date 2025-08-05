import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type LeftSidebarProps = {
    totalScore: number;
    totalCorrect: number;
    totalWrong: number;
    totalSeen: number;
    timerEnabled: boolean;
    toggleTimer: () => void;
}

const formatScore = (score: number) => {
    const abs = Math.abs(score).toLocaleString("en-US");
    return score < 0 ? `-$${abs}` : `$${abs}`;
};

export function LeftSidebar({ totalScore, totalCorrect, totalWrong, totalSeen, timerEnabled, toggleTimer }: LeftSidebarProps) {
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
                            <p>Seen:</p>
                            <Badge variant="secondary">{totalSeen}</Badge>
                        </div>
                    </SidebarGroup>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <div className="p-4">
                    <SidebarGroup className="space-y-1">
                        <Badge className="mb-2 text-lg">Settings</Badge>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="timer-toggle">Timer</Label>
                            <Switch
                                id="timer-toggle"
                                checked={timerEnabled}
                                onCheckedChange={toggleTimer}
                            />
                        </div>
                    </SidebarGroup>
                </div>
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