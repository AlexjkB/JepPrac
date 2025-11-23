import { PracticeSession } from "@/types/shared-states";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type PracticeSessionTrackerProps = {
  session: PracticeSession;
  onExit: () => void;
  onExtend: (additionalQuestions: number) => void;
};

export function PracticeSessionTracker({
  session,
  onExit,
  onExtend,
}: PracticeSessionTrackerProps) {
  const completed = session.questionsAnswered;
  const total = session.totalQuestions;
  const progress = (completed / total) * 100;
  const remaining = session.questionsRemaining;

  return (
    <Card className="mb-4 p-4 border-purple-500 border-2 bg-purple-50 dark:bg-purple-950/20">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <span className="text-lg">🎯</span>
            Practice Session
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {session.targetCategories.length === 1
              ? session.targetCategories[0]
              : `${session.targetCategories.length} categories`}
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {completed} / {total}
        </Badge>
      </div>

      <Progress value={progress} className="mb-3 h-2" />

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span>{remaining} questions remaining</span>
        <span>{Math.round(progress)}% complete</span>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onExit} className="flex-1">
          Exit Practice
        </Button>
        {remaining <= 2 && (
          <Button
            size="sm"
            onClick={() => onExtend(5)}
            className="flex-1"
            variant="secondary"
          >
            +5 More
          </Button>
        )}
      </div>

      {session.targetCategories.length > 1 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-1">Categories:</p>
          <div className="flex flex-wrap gap-1">
            {session.targetCategories.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
