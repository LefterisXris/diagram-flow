import { useState, useEffect, useRef } from 'react';
import { Minimize2, Maximize2, GripVertical, X } from 'lucide-react';

/**
 * DataInspectorPanel - Floating draggable panel showing current step data
 *
 * Displays:
 * - Input data (JSON formatted)
 * - Output data (JSON formatted)
 * - Diff highlighting (added fields in green, removed in red)
 * - Minimizable with position persistence
 */
const DataInspectorPanel = ({ currentStep, isActive, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState(() => {
    // Load saved position from localStorage
    const saved = localStorage.getItem('dataInspectorPosition');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { x: 20, y: 100 };
      }
    }
    return { x: 20, y: 100 }; // Default position (left side, below header)
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);

  // Persist position to localStorage
  useEffect(() => {
    localStorage.setItem('dataInspectorPosition', JSON.stringify(position));
  }, [position]);

  // Handle drag start
  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  // Handle drag move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Keep panel within viewport bounds
        const maxX = window.innerWidth - (panelRef.current?.offsetWidth || 400);
        const maxY = window.innerHeight - (panelRef.current?.offsetHeight || 300);

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Calculate diff between input and output
  const calculateDiff = (inputData, outputData) => {
    const diff = {
      added: {},
      removed: {},
      modified: {},
      unchanged: {},
    };

    const inputKeys = Object.keys(inputData || {});
    const outputKeys = Object.keys(outputData || {});

    // Find added keys
    outputKeys.forEach(key => {
      if (!inputKeys.includes(key)) {
        diff.added[key] = outputData[key];
      } else if (JSON.stringify(inputData[key]) !== JSON.stringify(outputData[key])) {
        diff.modified[key] = { from: inputData[key], to: outputData[key] };
      } else {
        diff.unchanged[key] = outputData[key];
      }
    });

    // Find removed keys
    inputKeys.forEach(key => {
      if (!outputKeys.includes(key)) {
        diff.removed[key] = inputData[key];
      }
    });

    return diff;
  };

  if (!isActive || !currentStep) {
    return null;
  }

  const inputData = currentStep.inputData || {};
  const outputData = currentStep.outputData || {};
  const diff = calculateDiff(inputData, outputData);
  const hasChanges = Object.keys(diff.added).length > 0 ||
                     Object.keys(diff.removed).length > 0 ||
                     Object.keys(diff.modified).length > 0;

  return (
    <div
      ref={panelRef}
      className="fixed"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 900,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="rounded-lg shadow-2xl border-2 flex flex-col"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: '#3b82f6',
          width: isMinimized ? '250px' : '400px',
          maxHeight: isMinimized ? 'auto' : '600px',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 border-b drag-handle"
          style={{
            borderColor: 'var(--border-primary)',
            cursor: 'grab',
          }}
        >
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Data Inspector
            </h3>
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#3b82f6' }}
            />
          </div>

          <div className="flex items-center gap-1">
            {/* Minimize/Maximize button */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded hover:bg-opacity-20 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded hover:bg-opacity-20 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Step Info */}
            <div
              className="text-xs px-2 py-1 rounded"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--text-secondary)',
              }}
            >
              <strong style={{ color: 'var(--text-primary)' }}>Current Node:</strong> {currentStep.nodeName}
              <span className="ml-2 font-mono" style={{ color: '#3b82f6' }}>
                ({currentStep.nodeType})
              </span>
            </div>

            {/* Input Data */}
            <div>
              <div
                className="text-xs font-semibold mb-1 flex items-center gap-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                <div className="w-1 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
                INPUT DATA
              </div>
              <div
                className="rounded p-2 text-xs font-mono overflow-x-auto"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <pre style={{ margin: 0, color: 'var(--text-primary)' }}>
                  {JSON.stringify(inputData, null, 2)}
                </pre>
              </div>
            </div>

            {/* Output Data */}
            <div>
              <div
                className="text-xs font-semibold mb-1 flex items-center gap-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                <div className="w-1 h-4 rounded" style={{ backgroundColor: '#10b981' }} />
                OUTPUT DATA
              </div>
              <div
                className="rounded p-2 text-xs font-mono overflow-x-auto"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <pre style={{ margin: 0, color: 'var(--text-primary)' }}>
                  {JSON.stringify(outputData, null, 2)}
                </pre>
              </div>
            </div>

            {/* Diff Display */}
            {hasChanges && (
              <div>
                <div
                  className="text-xs font-semibold mb-1 flex items-center gap-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <div className="w-1 h-4 rounded" style={{ backgroundColor: '#f59e0b' }} />
                  CHANGES
                </div>

                <div className="space-y-2">
                  {/* Added fields */}
                  {Object.keys(diff.added).length > 0 && (
                    <div
                      className="rounded p-2 text-xs"
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid #10b981',
                      }}
                    >
                      <div className="font-semibold mb-1" style={{ color: '#10b981' }}>
                        + Added Fields
                      </div>
                      <div className="font-mono space-y-0.5">
                        {Object.entries(diff.added).map(([key, value]) => (
                          <div key={key} style={{ color: '#10b981' }}>
                            + {key}: {JSON.stringify(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modified fields */}
                  {Object.keys(diff.modified).length > 0 && (
                    <div
                      className="rounded p-2 text-xs"
                      style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid #f59e0b',
                      }}
                    >
                      <div className="font-semibold mb-1" style={{ color: '#f59e0b' }}>
                        ~ Modified Fields
                      </div>
                      <div className="font-mono space-y-0.5">
                        {Object.entries(diff.modified).map(([key, { from, to }]) => (
                          <div key={key}>
                            <div style={{ color: '#ef4444' }}>
                              - {key}: {JSON.stringify(from)}
                            </div>
                            <div style={{ color: '#10b981' }}>
                              + {key}: {JSON.stringify(to)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Removed fields */}
                  {Object.keys(diff.removed).length > 0 && (
                    <div
                      className="rounded p-2 text-xs"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                      }}
                    >
                      <div className="font-semibold mb-1" style={{ color: '#ef4444' }}>
                        - Removed Fields
                      </div>
                      <div className="font-mono space-y-0.5">
                        {Object.entries(diff.removed).map(([key, value]) => (
                          <div key={key} style={{ color: '#ef4444' }}>
                            - {key}: {JSON.stringify(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No changes message */}
            {!hasChanges && (
              <div
                className="text-xs text-center py-2 rounded"
                style={{
                  backgroundColor: 'rgba(100, 100, 100, 0.1)',
                  color: 'var(--text-secondary)',
                }}
              >
                No data transformations at this step
              </div>
            )}

            {/* Transformations (if any) */}
            {currentStep.transformations && currentStep.transformations.length > 0 && (
              <div>
                <div
                  className="text-xs font-semibold mb-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  TRANSFORMATIONS APPLIED
                </div>
                <div className="space-y-1">
                  {currentStep.transformations.map((transform, index) => (
                    <div
                      key={index}
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        color: '#8b5cf6',
                      }}
                    >
                      {transform}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Minimized content */}
        {isMinimized && (
          <div className="p-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            Step {currentStep.stepIndex + 1} • {currentStep.nodeName}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataInspectorPanel;
