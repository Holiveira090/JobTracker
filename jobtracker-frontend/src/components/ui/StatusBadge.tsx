import {
  ApplicationStatus,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  APPLICATION_STATUS_DOT_COLORS,
} from '../../types/enums/application-status.enum';

type StatusBadgeProps = {
  status: ApplicationStatus;
  className?: string;
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${APPLICATION_STATUS_COLORS[status]} ${className}`}
      title={APPLICATION_STATUS_LABELS[status]}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${APPLICATION_STATUS_DOT_COLORS[status]}`} aria-hidden="true" />
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}
