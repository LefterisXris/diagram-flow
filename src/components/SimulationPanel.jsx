import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, AlertCircle, CheckCircle, XCircle, PlayCircle, List } from 'lucide-react';
import { useSimulation } from '../hooks/useSimulation';
import { simulateFlow } from '../utils/simulationEngine';

const SimulationPanel = ({ exampleCases, selectedCaseId, nodes, edges, onSimulationStateChange, onCaseChange, onSimulationComplete }) => {
  // State for batch mode
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchResults, setBatchResults] = useState([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [simulationStartTime, setSimulationStartTime] = useState(null);

  // Get the currently selected case
  const exampleCase = exampleCases?.find(c => c.id === selectedCaseId) || exampleCases?.[0];
  const {
    simulationResult,
    currentStep,
    currentStepIndex,
    progress,
    isPlaying,
    isAtStart,
    isAtEnd,
    speed,
    isPausedAtDecision,
    simulationState,
    conditionalEvaluationData,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    changeSpeed,
  } = useSimulation(exampleCase, nodes, edges);

  // Notify parent of simulation state changes
  React.useEffect(() => {
    if (onSimulationStateChange) {
      onSimulationStateChange(simulationState);
    }
  }, [simulationState, onSimulationStateChange]);

  // Batch mode: Run all cases when batch mode is activated
  useEffect(() => {
    if (isBatchMode && exampleCases && exampleCases.length > 0 && nodes && edges) {
      // Run simulation for each case
      const results = exampleCases.map(caseItem => {
        // Run simulation for this specific case
        const result = simulateFlow(caseItem, nodes, edges);
        const actualPath = result?.path || [];
        const expectedPath = caseItem.expectedPath || [];

        // Check if paths match
        const pathsMatch = actualPath.length === expectedPath.length &&
          actualPath.every((nodeId, index) => nodeId === expectedPath[index]);

        return {
          caseId: caseItem.id,
          caseName: caseItem.name,
          success: result?.success || false,
          pathMatches: pathsMatch,
          actualPath,
          expectedPath,
          error: result?.error,
        };
      });

      setBatchResults(results);
    } else if (!isBatchMode) {
      setBatchResults([]);
    }
  }, [isBatchMode, exampleCases, nodes, edges]);

  // Track simulation start time when simulation begins
  useEffect(() => {
    if (simulationResult && !isBatchMode) {
      setSimulationStartTime(Date.now());
    }
  }, [simulationResult, isBatchMode]);

  // Track when simulation reaches the end and add to history
  useEffect(() => {
    if (
      !isBatchMode &&
      simulationResult?.success &&
      isAtEnd &&
      exampleCase &&
      simulationStartTime &&
      onSimulationComplete
    ) {
      const duration = Date.now() - simulationStartTime;
      const actualPath = simulationResult.path || [];
      const expectedPath = exampleCase.expectedPath || [];
      const pathsMatch = actualPath.length === expectedPath.length &&
        actualPath.every((nodeId, index) => nodeId === expectedPath[index]);

      onSimulationComplete({
        caseId: exampleCase.id,
        caseName: exampleCase.name,
        actualPath,
        expectedPath,
        success: simulationResult.success,
        pathMatches: pathsMatch,
        duration,
        inputData: exampleCase.input?.data || {},
      });

      // Reset start time to avoid duplicate history entries
      setSimulationStartTime(null);
    }
  }, [isAtEnd, simulationResult, exampleCase, isBatchMode, simulationStartTime, onSimulationComplete]);

  // Handle case selector change
  const handleCaseChange = (caseId) => {
    if (onCaseChange) {
      onCaseChange(caseId);
    }
    setIsBatchMode(false);
  };

  // Start batch mode
  const handleRunAllCases = () => {
    setIsBatchMode(true);
    setCurrentBatchIndex(0);
  };

  // Exit batch mode
  const handleExitBatchMode = () => {
    setIsBatchMode(false);
    setBatchResults([]);
    setCurrentBatchIndex(0);
  };

  // Calculate pass/fail summary
  const batchSummary = batchResults.length > 0 ? {
    total: batchResults.length,
    passed: batchResults.filter(r => r.success && r.pathMatches).length,
    failed: batchResults.filter(r => !r.success || !r.pathMatches).length,
  } : null;

  // Show loading state while simulation is being computed
  if (!simulationResult) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Computing simulation...
          </div>
        </div>
      </div>
    );
  }

  // Show error state if simulation failed
  if (!simulationResult.success) {
    return (
      <div className="p-4">
        <div
          className="p-4 rounded-lg border-l-4 space-y-2"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            borderColor: '#ef4444',
          }}
        >
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
            <h3 className="font-semibold" style={{ color: '#ef4444' }}>
              Simulation Error
            </h3>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
            {simulationResult.error}
          </p>
        </div>
      </div>
    );
  }

  // Render successful simulation controls
  return (
    <div className="p-4 space-y-4">
      {/* Case selector dropdown */}
      {exampleCases && exampleCases.length > 1 && !isBatchMode && (
        <div className="space-y-2">
          <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Example Case
          </label>
          <select
            value={selectedCaseId || exampleCase?.id}
            onChange={(e) => handleCaseChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border transition-colors"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            {exampleCases.map(caseItem => (
              <option key={caseItem.id} value={caseItem.id}>
                {caseItem.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Run All Cases button */}
      {exampleCases && exampleCases.length > 1 && !isBatchMode && (
        <button
          onClick={handleRunAllCases}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium"
          style={{
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderColor: '#8b5cf6',
            border: '1px solid',
            color: '#8b5cf6',
          }}
        >
          <PlayCircle className="w-4 h-4" />
          Run All {exampleCases.length} Cases
        </button>
      )}

      {/* Batch mode summary */}
      {isBatchMode && batchSummary && (
        <div className="space-y-3">
          <div
            className="p-4 rounded-lg border-l-4"
            style={{
              backgroundColor: batchSummary.passed === batchSummary.total
                ? 'rgba(16, 185, 129, 0.05)'
                : 'rgba(239, 68, 68, 0.05)',
              borderColor: batchSummary.passed === batchSummary.total ? '#10b981' : '#ef4444',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Batch Results
              </h3>
              <button
                onClick={handleExitBatchMode}
                className="text-xs px-2 py-1 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-secondary)',
                }}
              >
                ← Back
              </button>
            </div>

            <div className="text-2xl font-bold mb-2" style={{
              color: batchSummary.passed === batchSummary.total ? '#10b981' : '#ef4444'
            }}>
              {batchSummary.passed} of {batchSummary.total} cases passed
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" style={{ color: '#10b981' }} />
                <span style={{ color: '#10b981' }}>{batchSummary.passed} passed</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
                <span style={{ color: '#ef4444' }}>{batchSummary.failed} failed</span>
              </div>
            </div>
          </div>

          {/* Individual case results */}
          <div className="space-y-2">
            <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Case Results
            </div>
            {batchResults.map((result, index) => {
              const passed = result.success && result.pathMatches;
              return (
                <div
                  key={result.caseId}
                  className="p-3 rounded-lg border flex items-center justify-between"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: passed ? '#10b981' : '#ef4444',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {passed ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#10b981' }} />
                      ) : (
                        <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#ef4444' }} />
                      )}
                      <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {result.caseName}
                      </span>
                    </div>
                    {!result.pathMatches && result.success && (
                      <div className="text-xs mt-1 ml-6" style={{ color: '#ef4444' }}>
                        Path mismatch: Expected {result.expectedPath.length} nodes, got {result.actualPath.length}
                      </div>
                    )}
                    {!result.success && (
                      <div className="text-xs mt-1 ml-6" style={{ color: '#ef4444' }}>
                        Simulation failed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Success indicator - only show when not in batch mode */}
      {!isBatchMode && (
        <div
          className="p-3 rounded-lg border-l-4 flex items-center gap-2"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderColor: '#10b981',
          }}
        >
          <CheckCircle className="w-4 h-4" style={{ color: '#10b981' }} />
          <span className="text-sm font-medium" style={{ color: '#10b981' }}>
            Simulation Ready
          </span>
        </div>
      )}

      {/* Progress indicator - only show when not in batch mode */}
      {!isBatchMode && progress && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Step {progress.current} of {progress.total}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {Math.round(progress.percentage)}%
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--border-primary)' }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progress.percentage}%`,
                backgroundColor: 'var(--accent-blue)',
              }}
            />
          </div>
        </div>
      )}

      {/* Current step info - only show when not in batch mode */}
      {!isBatchMode && currentStep && (
        <div
          className="p-3 rounded-lg border"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-primary)',
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Current Node
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded font-mono"
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: 'var(--accent-blue)',
                }}
              >
                {currentStep.nodeType}
              </span>
            </div>
            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {currentStep.nodeName}
            </div>
            {currentStep.conditionEvaluated?.condition && (
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-mono bg-opacity-10 px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--accent-green)' }}>
                  {currentStep.conditionEvaluated.condition}
                </span>
                {' → '}
                <span style={{ color: currentStep.conditionEvaluated.result ? '#10b981' : '#ef4444' }}>
                  {currentStep.conditionEvaluated.result ? 'true' : 'false'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Playback controls - only show when not in batch mode */}
      {!isBatchMode && (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {/* Reset button */}
          <button
            onClick={reset}
            disabled={isAtStart}
            className="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
              border: '1px solid',
            }}
            title="Reset to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step back button */}
          <button
            onClick={stepBack}
            disabled={isAtStart}
            className="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
              border: '1px solid',
            }}
            title="Step back"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play/Pause button */}
          {isPlaying ? (
            <button
              onClick={pause}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium"
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
              }}
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          ) : (
            <button
              onClick={play}
              disabled={isAtEnd}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--accent-blue)',
                color: '#ffffff',
              }}
            >
              <Play className="w-4 h-4" />
              {isAtEnd ? 'Completed' : 'Play'}
            </button>
          )}

          {/* Step forward button */}
          <button
            onClick={stepForward}
            disabled={isAtEnd}
            className="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
              border: '1px solid',
            }}
            title="Step forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Speed
            </label>
            <span className="text-xs font-mono" style={{ color: 'var(--text-primary)' }}>
              {speed.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(e) => changeSpeed(parseFloat(e.target.value))}
            className="w-full"
            style={{
              accentColor: 'var(--accent-blue)',
            }}
          />
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>0.5x</span>
            <span>1.0x</span>
            <span>1.5x</span>
            <span>2.0x</span>
            <span>2.5x</span>
            <span>3.0x</span>
          </div>
        </div>
      </div>

      {/* Path visualization */}
      <div className="space-y-2">
        <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Execution Path
        </div>
        <div className="flex flex-wrap gap-1">
          {simulationResult.path.map((nodeId, index) => {
            const node = nodes.find((n) => n.id === nodeId);
            const isCurrent = index === currentStepIndex;
            const isPast = index < currentStepIndex;

            return (
              <div
                key={`${nodeId}-${index}`}
                className="text-xs px-2 py-1 rounded font-mono transition-all"
                style={{
                  backgroundColor: isCurrent
                    ? 'var(--accent-blue)'
                    : isPast
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(148, 163, 184, 0.1)',
                  color: isCurrent
                    ? '#ffffff'
                    : isPast
                    ? '#10b981'
                    : 'var(--text-secondary)',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                }}
              >
                {node?.data?.label || nodeId}
              </div>
            );
          })}
        </div>
      </div>
      </div>
      )}
    </div>
  );
};

export default SimulationPanel;
