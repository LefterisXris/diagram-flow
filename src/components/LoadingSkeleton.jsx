/**
 * LoadingSkeleton Component
 *
 * Displays a loading skeleton while the application is initializing.
 * Provides visual feedback for better user experience during initial load.
 */
const LoadingSkeleton = () => {
  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Header Skeleton */}
      <div
        className="h-16 border-b flex items-center justify-between px-6 animate-pulse"
        style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-elevated)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          />
          <div
            className="h-6 w-32 rounded"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          />
        </div>
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-24 rounded-lg"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          />
          <div
            className="h-10 w-24 rounded-lg"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          />
          <div
            className="h-10 w-10 rounded-lg"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Skeleton */}
        <div
          className="w-80 border-r p-4 space-y-4 animate-pulse"
          style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}
        >
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 flex-1 rounded-lg"
                style={{ backgroundColor: 'var(--bg-tertiary)' }}
              />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 rounded-lg"
                style={{ backgroundColor: 'var(--bg-tertiary)' }}
              />
            ))}
          </div>
        </div>

        {/* Canvas Skeleton */}
        <div className="flex-1 relative animate-pulse" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className="inline-block w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4"
                style={{ borderColor: 'var(--accent-blue)', borderTopColor: 'transparent' }}
              />
              <div
                className="h-6 w-48 rounded mx-auto"
                style={{ backgroundColor: 'var(--bg-tertiary)' }}
              />
            </div>
          </div>
          {/* Skeleton nodes */}
          <div className="absolute inset-0 p-8">
            {[
              { top: '20%', left: '20%' },
              { top: '30%', left: '50%' },
              { top: '50%', left: '30%' },
              { top: '60%', left: '60%' },
              { top: '40%', left: '70%' },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute w-32 h-16 rounded-lg"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  top: pos.top,
                  left: pos.left,
                  opacity: 0.3,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p
          className="text-sm font-medium animate-pulse"
          style={{ color: 'var(--text-secondary)' }}
        >
          Loading DiagramFlow...
        </p>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
