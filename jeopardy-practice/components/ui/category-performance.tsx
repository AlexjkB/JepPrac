import { SidebarGroup } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/shared-states";
import { getWeakPoints, getPerformanceBadgeVariant } from "@/lib/statistics";
import { useState } from "react";
import { CategoryStatsModal } from "./category-stats-modal";

type CategoryPerformanceProps = {
  profile: UserProfile;
  onReset?: () => void;
  onStartPractice?: (categories: string[], sessionSize: number) => void;
};

export function CategoryPerformance({ profile, onReset, onStartPractice }: CategoryPerformanceProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const weakPoints = getWeakPoints(profile, 3);
  const hasData = Object.keys(profile.categoryStats).length > 0;

  if (!hasData) {
    return (
      <SidebarGroup className="space-y-2">
        <Badge className="mb-2 text-lg">Category Performance</Badge>
        <p className="text-sm text-muted-foreground">
          Play some questions to see your category performance!
        </p>
      </SidebarGroup>
    );
  }

  return (
    <>
      <SidebarGroup className="space-y-2">
        <Badge className="mb-2 text-lg">Category Performance</Badge>

        {weakPoints.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Weak Points:</p>
              {onStartPractice && weakPoints.length > 1 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStartPractice(weakPoints.map(w => w.category), 15)}
                  className="text-xs h-7"
                >
                  Practice All
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {weakPoints.map((stat) => (
                <div key={stat.category} className="flex justify-between items-center gap-2">
                  <span className="text-sm truncate flex-1">{stat.category}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPerformanceBadgeVariant(stat.accuracy)}>
                      {(stat.accuracy * 100).toFixed(0)}%
                    </Badge>
                    {onStartPractice && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onStartPractice([stat.category], 10)}
                        className="text-xs h-7 px-2"
                      >
                        Practice
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Answer more questions to see insights!
          </p>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2"
          onClick={() => setModalOpen(true)}
        >
          View All Categories →
        </Button>
      </SidebarGroup>

      <CategoryStatsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        profile={profile}
        onReset={onReset}
      />
    </>
  );
}
