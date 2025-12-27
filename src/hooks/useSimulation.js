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
  const intervalRef = useRef(null);

  // Run simulation when example case changes
  useEffect(() => {
    if (exampleCase && nodes && edges) {
      const result = simulateFlow(exampleCase, nodes, edges);
      setSimulationResult(result);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    } else {
      setSimulationResult(null);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    }
  }, [exampleCase, nodes, edges]);

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && simulationResult?.success) {
      const delay = (1000 / speed); // Base delay is 1000ms, adjusted by speed

      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const maxIndex = simulationResult.steps.length - 1;
          if (prev >= maxIndex) {
            setIsPlaying(false);
            return maxIndex;
          }
          return prev + 1;
        });
      }, delay);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPlaying, speed, simulationResult]);

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

  // Create simulation state for highlighting
  const simulationState = simulationResult?.success
    ? {
        isActive: true,
        currentStepIndex,
        path: simulationResult.path,
        steps: simulationResult.steps,
        currentNodeId: currentStep?.nodeId,
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
    simulationState, // Export for highlighting

    // Controls
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    changeSpeed,
  };
};
