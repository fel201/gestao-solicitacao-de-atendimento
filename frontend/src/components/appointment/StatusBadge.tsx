import type { Status } from "../../interfaces/Appointment";
import { statusBadgeClasses } from "../../constants/appointment";
import Badge from "../ui/Badge";

type StatusBadgeProps = {
  status: Status;
  className?: string;
};

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  return (
    <Badge className={`px-3 ${statusBadgeClasses[status]} ${className}`}>
      {status}
    </Badge>
  );
}
