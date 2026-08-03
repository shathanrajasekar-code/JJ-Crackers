export default function ProductsLoading() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-1.5 sm:px-8 md:px-12 py-8 sm:py-12 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="mb-8 sm:mb-12">
        <div className="h-3 w-32 bg-[var(--surface-high)] rounded mb-3" />
        <div className="h-10 w-64 bg-[var(--surface-high)] rounded-xl mb-3" />
        <div className="h-4 w-96 max-w-full bg-[var(--surface-high)] rounded" />
      </div>

      <div className="flex flex-row gap-2 sm:gap-6 md:gap-8">
        {/* Sidebar Skeleton */}
        <aside className="w-[75px] sm:w-48 lg:w-60 flex-shrink-0">
          <div className="glass-card rounded-xl md:rounded-2xl p-1 md:p-3 flex flex-col gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-[42px] bg-[var(--surface-high)] rounded-lg" />
            ))}
          </div>
        </aside>

        {/* Product Grid Skeleton */}
        <div className="flex-1 min-w-0">
          <div className="h-4 w-48 bg-[var(--surface-high)] rounded mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <div className="w-full pt-[100%] bg-[var(--surface-high)]" />
                <div className="p-2.5 sm:p-4 space-y-2">
                  <div className="h-2 w-16 bg-[var(--surface-high)] rounded" />
                  <div className="h-3 w-full bg-[var(--surface-high)] rounded" />
                  <div className="h-3 w-2/3 bg-[var(--surface-high)] rounded" />
                  <div className="flex items-center gap-2 mt-3">
                    <div className="h-5 w-16 bg-[var(--surface-high)] rounded" />
                    <div className="h-3 w-10 bg-[var(--surface-high)] rounded" />
                  </div>
                  <div className="h-[34px] w-full bg-[var(--surface-high)] rounded-lg mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
