import type { Category } from "../../interfaces/Appointment";
import {
  categoryBadgeClass,
  categoryLabels,
} from "../../constants/appointment";
import Badge from "../ui/Badge";

type CategoryBadgeProps = {
  category: Category;
  className?: string;
};

export default function CategoryBadge({
  category,
  className = "",
}: CategoryBadgeProps) {
  return (
    <Badge className={`${categoryBadgeClass} ${className}`}>
      {categoryLabels[category]}
    </Badge>
  );
}
