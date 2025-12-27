import { useState, useEffect, useCallback, useRef } from 'react';
import { simulateFlow } from '../utils/simulationEngine';

/**
 * Hook for managing simulation state and controls
 * Handles play, pause, step forward/back, reset, and speed control
 */
export const useSimulation = (exampleCase, nodes, edges) => {
  const [simulationResult, setSimulationResult] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0); // 1.0 = normal speed (1 second per step)
  const [isPausedAtDecision, setIsPausedAtDecision] = useState(false);
  const [conditionalEvaluationData, setConditionalEvaluationData] = useState(null);
  const intervalRef = useRef(null);
  const decisionPauseTimeoutRef = useRef(null);

  // Run simulation when example case changes
  useEffect(() => {
    if (exampleCase && nodes && edges) {
      const result = simulateFlow(exampleCase, nodes, edges);
      setSimulationResult(result);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsPausedAtDecision(false);
      setConditionalEvaluationData(null);
    } else {
      setSimulationResult(null);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsPausedAtDecision(false);
      setConditionalEvaluationData(null);
    }
  }, [exampleCase, nodes, edges]);

  // Helper function to prepare conditional evaluation data
  const prepareConditionalEvaluationData = useCallback((step, nodes, edges) => {
    if (!step || step.nodeType !== 'decision') {
      return null;
    }

    // Find all outgoing edges from this decision node
    const outgoingEdges = edges.filter(e => e.source === step.nodeId);

    if (outgoingEdges.length === 0) {
      return null;
    }

    // Prepare conditions data
    const conditions = outgoingEdges.map(edge => {
      const condition = edge.data?.condition || edge.condition || '';
      const conditionType = edge.data?.conditionType || 'conditional';
      const priority = edge.data?.priority || edge.priority || 999;

      // Find the target node to get its label
      const targetNode = nodes.find(n => n.id === edge.target);
      const edgeLabel = targetNode?.data?.label || edge.label || edge.data?.label || 'Next';

      return {
        edgeId: edge.id,
        condition,
        conditionType,
        priority,
        edgeLabel,
        result: null, // Will be set based on evaluation
      };
    });

    // If we have condition evaluation data in the step, use it
    if (step.conditionEvaluated) {
      const chosenCondition = step.conditionEvaluated.condition;

      // Mark conditions as true/false based on evaluation
      // For now, we'll mark the chosen one as true and others as false
      // In reality, multiple conditions could be true, but we take the first one (by priority)
      conditions.forEach(cond => {
        if (cond.condition === chosenCondition || (!chosenCondition && cond.conditionType === 'default')) {
          cond.result = true;
        } else {
          cond.result = false;
        }
      });

      // Find which edge was actually taken
      const chosenEdgeData = step.edgeTaken;
      const chosenEdge = edges.find(e => e.id === chosenEdgeData?.id);
      const chosenCond = conditions.find(c => c.edgeId === chosenEdge?.id);

      return {
        conditions: conditions.sort((a, b) => a.priority - b.priority),
        chosenCondition: chosenCond || null,
        chosenEdge: chosenEdge || null,
      };
    }

    return null;
  }, []);

  // Detect decision nodes and prepare evaluation data
  useEffect(() => {
    if (simulationResult?.success && currentStepIndex < simulationResult.steps.length) {
      const currentStep = simulationResult.steps[currentStepIndex];

      if (currentStep.nodeType === 'decision') {
        const evalData = prepareConditionalEvaluationData(currentStep, nodes, edges);
        setConditionalEvaluationData(evalData);
      } else {
        setConditionalEvaluationData(null);
      }
    }
  }, [currentStepIndex, simulationResult, nodes, edges, prepareConditionalEvaluationData]);

  // Auto-play effect with decision node pause
  useEffect(() => {
    if (isPlaying && simulationResult?.success && !isPausedAtDecision) {
      const delay = (1000 / speed); // Base delay is 1000ms, adjusted by speed

      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const maxIndex = simulationResult.steps.length - 1;
          if (prev >= maxIndex) {
            setIsPlaying(false);
            return maxIndex;
          }

          const nextIndex = prev + 1;
          const nextStep = simulationResult.steps[nextIndex];

          // If next step is a decision node, pause for 1.5 seconds
          if (nextStep.nodeType === 'decision') {
            setIsPausedAtDecision(true);
            setIsPlaying(false);

            // Resume after decision pause (1.5 seconds)
            decisionPauseTimeoutRef.current = setTimeout(() => {
              setIsPausedAtDecision(false);
              setIsPlaying(true);
            }, 1500); // 1.5 second pause at decision nodes
          }

          return nextIndex;
        });
      }, delay);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }

    // Cleanup decision pause timeout
    return () => {
      if (decisionPauseTimeoutRef.current) {
        clearTimeout(decisionPauseTimeoutRef.current);
      }
    };
  }, [isPlaying, speed, simulationResult, isPausedAtDecision]);

  // Play: Start auto-advancing through steps
  const play = useCallback(() => {
    if (simulationResult?.success) {
      const maxIndex = simulationResult.steps.length - 1;
      if (currentStepIndex >= maxIndex) {
        // If at end, restart from beginning
        setCurrentStepIndex(0);
      }
      setIsPlaying(true);
    }
  }, [simulationResult, currentStepIndex]);

  // Pause: Stop auto-advancing
  const pause = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Step forward: Move to next step
  const stepForward = useCallback(() => {
    if (simulationResult?.success) {
      const maxIndex = simulationResult.steps.length - 1;
      setCurrentStepIndex((prev) => Math.min(prev + 1, maxIndex));
      setIsPlaying(false);
    }
  }, [simulationResult]);

  // Step back: Move to previous step
  const stepBack = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    setIsPlaying(false);
  }, []);

  // Reset: Go back to first step
  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // Change speed
  const changeSpeed = useCallback((newSpeed) => {
    setSpeed(newSpeed);
  }, []);

  // Get current step data
  const currentStep = simulationResult?.steps?.[currentStepIndex] || null;

  // Calculate progress
  const progress = simulationResult?.steps
    ? {
        current: currentStepIndex + 1,
        total: simulationResult.steps.length,
        percentage: ((currentStepIndex + 1) / simulationResult.steps.length) * 100,
      }
    : null;

  // Check if at start or end
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = simulationResult?.steps
    ? currentStepIndex >= simulationResult.steps.length - 1
    : true;

  // Create simulation state for highlighting and conditional evaluation
  const simulationState = simulationResult?.success
    ? {
        isActive: true,
        currentStepIndex,
        path: simulationResult.path,
        steps: simulationResult.steps,
        currentNodeId: currentStep?.nodeId,
        conditionalEvaluationData, // Include conditional evaluation data
      }
    : null;

  return {
    // Simulation data
    simulationResult,
    currentStep,
    currentStepIndex,
    progress,

    // State
    isPlaying,
    isAtStart,
    isAtEnd,
    speed,
    isPausedAtDecision,
    simulationState, // Export for highlighting
    conditionalEvaluationData, // Export for conditional evaluation popup

    // Controls
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    changeSpeed,
  };
};
