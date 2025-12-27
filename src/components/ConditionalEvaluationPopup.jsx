import { Check, X } from 'lucide-react';

/**
 * ConditionalEvaluationPopup - Shows condition evaluation results at decision nodes
 *
 * Displays:
 * - All outgoing conditions from a decision node
 * - Which condition evaluated to true (green checkmark)
 * - Which conditions evaluated to false (grayed out with X)
 * - Explanation of which path was chosen
 */
const ConditionalEvaluationPopup = ({
  evaluationData,
  onClose
}) => {
  if (!evaluationData) return null;

  const {
    conditions = [],
    chosenCondition = null,
    chosenEdge = null
  } = evaluationData;

  return (
    <div
      className="fixed top-4 right-4 z-50"
      style={{ zIndex: 1000 }}
    >
      <div
        className="rounded-lg shadow-2xl border-2 p-4 min-w-[300px] max-w-[400px]"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: '#f97316', // Orange for decision nodes
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3
            className="font-semibold text-sm flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#f97316' }}
            />
            Condition Evaluation
          </h3>
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded hover:bg-opacity-20"
            style={{ color: 'var(--text-secondary)' }}
          >
            ✕
          </button>
        </div>

        {/* Conditions List */}
        <div className="space-y-2">
          {conditions.length === 0 ? (
            <p
              className="text-xs italic"
              style={{ color: 'var(--text-secondary)' }}
            >
              No conditions defined
            </p>
          ) : (
            conditions.map((cond, index) => {
              const isChosen = cond.edgeId === chosenEdge?.id;
              const isTrue = cond.result === true;

              return (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded border"
                  style={{
                    backgroundColor: isChosen
                      ? 'rgba(34, 197, 94, 0.1)' // Green background for chosen
                      : isTrue
                        ? 'rgba(234, 179, 8, 0.05)' // Slight yellow for other true conditions
                        : 'rgba(100, 100, 100, 0.05)', // Gray for false
                    borderColor: isChosen
                      ? '#22c55e' // Green border for chosen
                      : isTrue
                        ? '#eab308' // Yellow border for other true
                        : 'var(--border-primary)',
                    opacity: isTrue ? 1 : 0.6,
                  }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isTrue ? (
                      <Check
                        className="w-4 h-4"
                        style={{
                          color: isChosen ? '#22c55e' : '#eab308'
                        }}
                      />
                    ) : (
                      <X
                        className="w-4 h-4"
                        style={{ color: '#6b7280' }}
                      />
                    )}
                  </div>

                  {/* Condition Details */}
                  <div className="flex-1 min-w-0">
                    {/* Condition Expression */}
                    <div
                      className="text-sm font-mono mb-1"
                      style={{
                        color: isTrue ? 'var(--text-primary)' : 'var(--text-secondary)',
                        wordBreak: 'break-all',
                      }}
                    >
                      {cond.condition || '(default path)'}
                    </div>

                    {/* Result Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: isTrue ? '#22c55e' : '#6b7280',
                          color: '#ffffff',
                        }}
                      >
                        → {isTrue ? 'TRUE' : 'FALSE'}
                      </span>

                      {/* Chosen Badge */}
                      {isChosen && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: '#f97316',
                            color: '#ffffff',
                          }}
                        >
                          CHOSEN PATH
                        </span>
                      )}
                    </div>

                    {/* Edge Label */}
                    {cond.edgeLabel && (
                      <div
                        className="text-xs mt-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Target: {cond.edgeLabel}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Explanation */}
        {chosenCondition && (
          <div
            className="mt-3 pt-3 border-t text-xs"
            style={{
              borderColor: 'var(--border-primary)',
              color: 'var(--text-secondary)'
            }}
          >
            <strong style={{ color: 'var(--text-primary)' }}>Why this path?</strong>
            <br />
            {chosenCondition.condition
              ? `Condition "${chosenCondition.condition}" evaluated to true`
              : 'Default path taken (no condition matched)'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConditionalEvaluationPopup;
