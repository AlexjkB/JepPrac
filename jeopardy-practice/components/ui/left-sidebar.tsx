import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

type LeftSidebarProps = {
	totalScore: number;
	totalCorrect: number;
	totalWrong: number;
	totalSeen: number;
	timerEnabled: boolean;
	toggleTimer: () => void;
	timerValue: number;
	changeTimerValue: (val: number) => void;
}

const formatScore = (score: number) => {
	const abs = Math.abs(score).toLocaleString("en-US");
	return score < 0 ? `-$${abs}` : `$${abs}`;
};

export function LeftSidebar({ totalScore, totalCorrect, totalWrong, totalSeen, timerEnabled, toggleTimer, timerValue, changeTimerValue }: LeftSidebarProps) {
	return (
		<Sidebar>
			<SidebarHeader>
				<div className="p-4">
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
							<Badge variant="secondary">{totalSeen - totalWrong - totalCorrect - 1 < 0 ? 0 : totalSeen - totalWrong - totalCorrect - 1}</Badge>
						</div>
					</SidebarGroup>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<div className="p-4">
					<SidebarGroup className="space-y-4">
						<Badge className="mb-2 text-lg">Settings</Badge>
						<div className="flex items-center justify-between">
							<Label htmlFor="timer-toggle">Timer (sec)</Label>
							<Switch
								id="timer-toggle"
								checked={timerEnabled}
								aria-label='timer-toggle'
								onCheckedChange={toggleTimer}
							/>
						</div>
						<AnimatePresence mode="wait">
							{timerEnabled === true &&
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.3 }}
									className="flex space-x-4">
									<p>2</p>
									<Slider
										value={[timerValue]}
										max={8}
										min={2}
										step={1}
										onValueChange={(vals) => { changeTimerValue(vals[0]) }}
									/>
									<p>8</p>
								</motion.div>
							}
						</AnimatePresence>
						<div className="flex items-center justify-between">
							<Label htmlFor="dark-mode-toggle">Dark Mode</Label>
							<Switch
								id="dark-mode-toggle"
								aria-label='dark-mode-toggle'
								defaultChecked={true}
								onCheckedChange={() => {
									document.body.classList.toggle('dark');
								}}
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