import { useState } from 'react';
import { History, Trash2, Play, CheckCircle, XCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const SimulationHistory = ({ history, onReplay, onDelete, onClear, nodes }) => {
  const [expandedItem, setExpandedItem] = useState(null);

  // Get node name by ID
  const getNodeName = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node?.data?.label || nodeId;
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format duration
  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Calculate statistics
  const stats = {
    total: history.length,
    successful: history.filter(h => h.success && h.pathMatches).length,
    failed: history.filter(h => !h.success || !h.pathMatches).length,
    successRate: history.length > 0
      ? ((history.filter(h => h.success && h.pathMatches).length / history.length) * 100).toFixed(1)
      : 0,
  };

  // Toggle expanded item
  const toggleExpand = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  // Compare paths and show diff
  const renderPathComparison = (item) => {
    const { actualPath, expectedPath } = item;
    const maxLength = Math.max(actualPath.length, expectedPath.length);

    return (
      <div className="mt-3 space-y-2">
        <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Path Comparison
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Expected Path */}
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              Expected ({expectedPath.length} nodes)
            </div>
            <div className="space-y-1">
              {expectedPath.map((nodeId, index) => {
                const matches = actualPath[index] === nodeId;
                return (
                  <div
                    key={`expected-${index}`}
                    className="text-xs px-2 py-1 rounded font-mono"
                    style={{
                      backgroundColor: matches ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: matches ? '#10b981' : '#ef4444',
                    }}
                  >
                    {index + 1}. {getNodeName(nodeId)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actual Path */}
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              Actual ({actualPath.length} nodes)
            </div>
            <div className="space-y-1">
              {actualPath.map((nodeId, index) => {
                const matches = expectedPath[index] === nodeId;
                return (
                  <div
                    key={`actual-${index}`}
                    className="text-xs px-2 py-1 rounded font-mono"
                    style={{
                      backgroundColor: matches ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: matches ? '#10b981' : '#ef4444',
                    }}
                  >
                    {index + 1}. {getNodeName(nodeId)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Path mismatch indicators */}
        {actualPath.length > expectedPath.length && (
          <div className="text-xs p-2 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}>
            ⚠️ Actual path has {actualPath.length - expectedPath.length} extra node(s)
          </div>
        )}
        {actualPath.length < expectedPath.length && (
          <div className="text-xs p-2 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}>
            ⚠️ Actual path is missing {expectedPath.length - actualPath.length} node(s)
          </div>
        )}
      </div>
    );
  };

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <History className="w-12 h-12 mb-4" style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          No simulation history yet.
        </p>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
          Run a simulation to see history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Statistics
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Runs</div>
            <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{stats.total}</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Success Rate</div>
            <div className="text-lg font-bold" style={{ color: stats.successRate >= 80 ? '#10b981' : '#ef4444' }}>
              {stats.successRate}%
            </div>
          </div>
          <div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Passed</div>
            <div className="text-lg font-bold" style={{ color: '#10b981' }}>{stats.successful}</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Failed</div>
            <div className="text-lg font-bold" style={{ color: '#ef4444' }}>{stats.failed}</div>
          </div>
        </div>
      </div>

      {/* Clear History Button */}
      {onClear && (
        <button
          onClick={onClear}
          className="w-full px-3 py-2 rounded-lg text-sm transition-colors border"
          style={{
            borderColor: 'var(--border-primary)',
            color: 'var(--text-secondary)',
          }}
        >
          Clear All History
        </button>
      )}

      {/* History Items */}
      <div className="space-y-3">
        <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Recent Runs ({history.length})
        </div>
        {history.map((item) => {
          const passed = item.success && item.pathMatches;
          const isExpanded = expandedItem === item.id;

          return (
            <div
              key={item.id}
              className="rounded-lg border transition-all"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: passed ? '#10b981' : '#ef4444',
              }}
            >
              {/* Header - clickable to expand */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-3 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Case name and status */}
                    <div className="flex items-center gap-2 mb-1">
                      {passed ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#10b981' }} />
                      ) : (
                        <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#ef4444' }} />
                      )}
                      <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {item.caseName}
                      </span>
                    </div>

                    {/* Timestamp and duration */}
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span>{formatTimestamp(item.timestamp)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(item.duration)}
                      </span>
                    </div>

                    {/* Path info */}
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Path: {item.actualPath.length} nodes
                      {item.expectedPath.length > 0 && ` (expected ${item.expectedPath.length})`}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {onReplay && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReplay(item);
                        }}
                        className="p-1.5 rounded transition-colors hover:bg-opacity-10"
                        style={{ color: 'var(--accent-blue)' }}
                        title="Replay this simulation"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="p-1.5 rounded transition-colors hover:bg-opacity-10"
                        style={{ color: '#ef4444' }}
                        title="Delete this history item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div
                  className="px-3 pb-3 border-t"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  {/* Success/Failure reason */}
                  {!passed && (
                    <div className="mt-3 p-2 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                      <div className="flex items-center gap-2 text-xs" style={{ color: '#ef4444' }}>
                        <AlertCircle className="w-4 h-4" />
                        {!item.success ? 'Simulation failed' : 'Path mismatch'}
                      </div>
                    </div>
                  )}

                  {/* Path comparison */}
                  {item.expectedPath.length > 0 && renderPathComparison(item)}

                  {/* Input data preview */}
                  {item.inputData && Object.keys(item.inputData).length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                        Input Data
                      </div>
                      <pre
                        className="text-xs p-2 rounded overflow-x-auto"
                        style={{
                          backgroundColor: 'rgba(59, 130, 246, 0.05)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {JSON.stringify(item.inputData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimulationHistory;
