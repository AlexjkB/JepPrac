import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserProfile } from "@/types/shared-states";
import { getAllCategoriesSorted, getPerformanceBadgeVariant } from "@/lib/statistics";

type CategoryStatsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onReset?: () => void;
};

export function CategoryStatsModal({
  open,
  onOpenChange,
  profile,
  onReset,
}: CategoryStatsModalProps) {
  const [sortBy, setSortBy] = useState<"accuracy" | "totalSeen" | "category">("accuracy");
  const categories = getAllCategoriesSorted(profile, sortBy);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all statistics? This cannot be undone.")) {
      onReset?.();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Category Performance</DialogTitle>
          <DialogDescription>
            Detailed breakdown of your performance across all categories
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={sortBy === "accuracy" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("accuracy")}
          >
            By Accuracy
          </Button>
          <Button
            variant={sortBy === "totalSeen" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("totalSeen")}
          >
            By Count
          </Button>
          <Button
            variant={sortBy === "category" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("category")}
          >
            Alphabetical
          </Button>
        </div>

        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No data yet. Play some questions to see your statistics!
            </p>
          ) : (
            <div className="space-y-3">
              {categories.map((stat) => (
                <div
                  key={stat.category}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex-1">
                    <p className="font-medium">{stat.category}</p>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Correct: {stat.correct}</span>
                      <span>Wrong: {stat.wrong}</span>
                      <span>Skipped: {stat.skipped}</span>
                      <span>Total: {stat.totalSeen}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPerformanceBadgeVariant(stat.accuracy)}>
                      {(stat.accuracy * 100).toFixed(0)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      ${stat.avgValue.toFixed(0)} avg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="destructive" size="sm" onClick={handleReset}>
            Reset All Stats
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
