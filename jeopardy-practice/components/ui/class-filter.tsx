import { SidebarGroup } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// These class IDs match the API's /classified endpoint parameters
const AI_CLASSES = [
  { id: 'history', label: 'History' },
  { id: 'science', label: 'Science' },
  { id: 'literature', label: 'Literature' },
  { id: 'geography', label: 'Geography' },
  { id: 'sports', label: 'Sports' },
  { id: 'music', label: 'Music' },
  { id: 'movies', label: 'Movies & TV' },
  { id: 'art', label: 'Art' },
  { id: 'politics', label: 'Politics' },
  { id: 'religion', label: 'Religion' },
];

type ClassFilterProps = {
  selectedClasses: string[];
  onClassesChange: (classes: string[]) => void;
};

export function ClassFilter({ selectedClasses, onClassesChange }: ClassFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleClass = (classId: string) => {
    let newClasses: string[];
    if (selectedClasses.includes(classId)) {
      newClasses = selectedClasses.filter(c => c !== classId);
      console.log('Removed class:', classId, 'New classes:', newClasses);
    } else {
      newClasses = [...selectedClasses, classId];
      console.log('Added class:', classId, 'New classes:', newClasses);
    }
    onClassesChange(newClasses);
  };

  const clearAll = () => {
    onClassesChange([]);
  };

  const selectAll = () => {
    onClassesChange(AI_CLASSES.map(c => c.id));
  };

  const isFiltered = selectedClasses.length > 0 && selectedClasses.length < AI_CLASSES.length;
  const allSelected = selectedClasses.length === AI_CLASSES.length;

  return (
    <SidebarGroup className="space-y-2">
      <div className="flex items-center justify-between">
        <Badge className="text-lg">
          {isFiltered ? `Filter (${selectedClasses.length})` : 'Class Filter'}
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs h-6 px-2"
        >
          {isExpanded ? '▼' : '▶'}
        </Button>
      </div>

      {isFiltered && !isExpanded && (
        <div className="flex flex-wrap gap-1">
          {selectedClasses.map(classId => {
            const aiClass = AI_CLASSES.find(c => c.id === classId);
            return (
              <Badge key={classId} variant="secondary" className="text-xs">
                {aiClass?.label}
              </Badge>
            );
          })}
        </div>
      )}

      {isExpanded && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={allSelected ? "default" : "outline"}
              onClick={selectAll}
              className="text-xs h-7 flex-1"
            >
              All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearAll}
              className="text-xs h-7 flex-1"
              disabled={selectedClasses.length === 0}
            >
              Clear
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {AI_CLASSES.map(aiClass => {
              const isSelected = selectedClasses.includes(aiClass.id);
              return (
                <button
                  key={aiClass.id}
                  onClick={() => toggleClass(aiClass.id)}
                  className={`text-xs p-2 rounded border transition-colors ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-accent border-border'
                  }`}
                >
                  {aiClass.label}
                </button>
              );
            })}
          </div>

          {isFiltered && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Questions will only come from selected classes
            </p>
          )}
        </div>
      )}
    </SidebarGroup>
  );
}
