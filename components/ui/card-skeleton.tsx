import { cn } from '@/lib/utils';

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-white/10 bg-[#0d1c31] p-4', className)}>
      <div className="mb-3 h-40 w-full rounded-xl bg-white/10 animate-pulse" />
      <div className="mb-2 h-4 w-3/4 rounded bg-white/10 animate-pulse" />
      <div className="mb-4 h-3 w-1/2 rounded bg-white/10 animate-pulse" />
      <div className="h-9 w-full rounded-lg bg-white/10 animate-pulse" />
    </div>
  );
}
