import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'icon';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  title?: string;
  className?: string;
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-sm',
  secondary:
    'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus:ring-brand-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-brand-500',
};

const SIZES: Record<ButtonSize, string> = {
  default: 'px-5 py-2.5 text-sm',
  sm: 'px-3 py-1.5 text-xs',
  icon: 'p-2',
};

export function Button({
  children,
  onClick,
  type = 'button',
  disabled,
  variant = 'primary',
  size = 'default',
  title,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${VARIANTS[variant]} ${SIZES[size]} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className ?? ''}`}
    >
      {children}
    </button>
  );
}

/* Exports legados (compatibilidade) */
export function PrimaryButton(props: ButtonProps) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props: ButtonProps) {
  return <Button {...props} variant="secondary" />;
}

export function DangerButton(props: ButtonProps) {
  return <Button {...props} variant="danger" />;
}