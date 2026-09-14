type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZES: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={`inline-block animate-spin rounded-full border-brand-600 border-t-transparent ${SIZES[size]} ${className}`}
    />
  );
}

export function LoadingBlock({ label = 'Carregando...', size = 'md' }: SpinnerProps & { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Spinner size={size} />
      <p className="text-sm">{label}</p>
    </div>
  );
}