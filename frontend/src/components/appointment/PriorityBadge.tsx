import type { Priority } from "../../interfaces/Appointment";
import {
  priorityBadgeClasses,
  priorityLabels,
} from "../../constants/appointment";
import Badge from "../ui/Badge";

type PriorityBadgeProps = {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
};

export default function PriorityBadge({
  priority,
  showLabel = false,
  className = "",
}: PriorityBadgeProps) {
  return (
    <Badge className={`${priorityBadgeClasses[priority]} ${className}`}>
      {showLabel ? `Prioridade: ${priorityLabels[priority]}` : priorityLabels[priority]}
    </Badge>
  );
}
