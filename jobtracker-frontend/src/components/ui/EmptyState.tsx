import type { ReactNode } from 'react';
import type { IconProps } from './Icons';
import { InboxIcon, BuildingIcon, UsersIcon, TargetIcon, FileTextIcon, SearchIcon } from './Icons';

const ICON_MAP: Record<string, (props: IconProps) => ReactNode> = {
  inbox: InboxIcon,
  building: BuildingIcon,
  users: UsersIcon,
  target: TargetIcon,
  file: FileTextIcon,
  search: SearchIcon,
};

type EmptyStateProps = {
  icon: string | ((props: IconProps) => ReactNode);
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const Icon = typeof icon === 'string' ? (ICON_MAP[icon] ?? InboxIcon) : icon;

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon size={28} />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}