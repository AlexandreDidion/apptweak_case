import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon } from "lucide-react";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SortableTrackItemProps {
  id: string;
  /** Shows the drag handle. False when sorted by a field or not editable */
  isReorderable: boolean;
  trackName: string;
  children: ReactNode;
}

/** A track row that can be dragged by its handle */
export function SortableTrackItem({
  id,
  isReorderable,
  trackName,
  children
}: SortableTrackItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled: !isReorderable });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "flex items-center gap-1 border-t bg-background py-2 first:border-t-0",
        isDragging && "relative z-10 shadow-md"
      )}
    >
      {isReorderable && (
        <Button
          ref={setActivatorNodeRef}
          variant="ghost"
          size="icon-sm"
          className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
          aria-label={`Move "${trackName}"`}
          {...attributes}
          {...listeners}
        >
          <GripVerticalIcon />
        </Button>
      )}
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}
