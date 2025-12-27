import { useState, useEffect } from 'react';
import { ChevronRight, X, HelpCircle } from 'lucide-react';

/**
 * Interactive Tutorial Overlay Component
 *
 * Provides a 5-step walkthrough for new users with:
 * - Overlay with spotlight effect on target elements
 * - Step-by-step instructions
 * - Next and Skip Tutorial buttons
 * - Can be retriggered from Help menu
 *
 * Based on architect.md Section 12.1 and plan.md Phase 7 Step 5
 */
const TutorialOverlay = ({ isActive, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Define tutorial steps
  const tutorialSteps = [
    {
      id: 'canvas',
      title: 'Welcome to DiagramFlow!',
      content: 'This is the canvas. Double-click anywhere to add a node, or use the Tools panel on the left.',
      target: 'canvas',
      position: 'center',
    },
    {
      id: 'connect',
      title: 'Connect Your Nodes',
      content: 'Drag from the edge of one node to another to create connections. Try connecting the nodes in the Pet Clinic template!',
      target: 'node',
      position: 'center',
    },
    {
      id: 'details',
      title: 'View Node Details',
      content: 'Click any node to see its details in the right panel. You can edit descriptions, add tags, and configure metadata.',
      target: 'node',
      position: 'center',
    },
    {
      id: 'simulate',
      title: 'Run Simulations',
      content: 'Click the "Example Cases" tab in the left sidebar to run simulations. Watch data flow through your system step-by-step!',
      target: 'sidebar',
      position: 'left',
    },
    {
      id: 'save',
      title: 'Save Your Work',
      content: 'Use the Export button in the header to save your diagram as JSON. You can also import diagrams or convert from Mermaid!',
      target: 'header',
      position: 'top',
    },
  ];

  const currentStepData = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  // Handle next step
  const handleNext = () => {
    if (isLastStep) {
      // Tutorial complete
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle skip
  const handleSkip = () => {
    onSkip();
  };

  // Reset to first step when tutorial becomes active
  useEffect(() => {
    if (isActive) {
      setCurrentStep(0);
    }
  }, [isActive]);

  // Don't render if not active
  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(2px)',
      }}
    >
      {/* Tutorial Card */}
      <div
        className="fixed rounded-xl shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '2px solid var(--accent-blue)',
          maxWidth: '400px',
          // Position based on current step
          ...(currentStepData.position === 'center' && {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }),
          ...(currentStepData.position === 'left' && {
            top: '50%',
            left: '20px',
            transform: 'translateY(-50%)',
          }),
          ...(currentStepData.position === 'top' && {
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
          }),
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b"
          style={{
            borderColor: 'var(--border-primary)',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--accent-blue)',
                }}
              >
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  {currentStepData.title}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  Step {currentStep + 1} of {tutorialSteps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 rounded-lg hover:bg-opacity-10 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Skip tutorial"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {currentStepData.content}
          </p>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex items-center justify-between"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: index === currentStep
                    ? 'var(--accent-blue)'
                    : index < currentStep
                    ? 'rgba(59, 130, 246, 0.4)'
                    : 'var(--border-primary)',
                }}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSkip}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-secondary)',
              }}
            >
              Skip Tutorial
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
              style={{
                backgroundColor: 'var(--accent-blue)',
                color: '#ffffff',
              }}
            >
              {isLastStep ? 'Finish' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hint arrow (optional visual indicator) */}
      {currentStepData.position === 'left' && (
        <div
          className="fixed animate-pulse"
          style={{
            top: '50%',
            left: '280px',
            transform: 'translateY(-50%)',
            color: 'var(--accent-blue)',
            fontSize: '48px',
            pointerEvents: 'none',
          }}
        >
          ←
        </div>
      )}
      {currentStepData.position === 'top' && (
        <div
          className="fixed animate-pulse"
          style={{
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'var(--accent-blue)',
            fontSize: '48px',
            pointerEvents: 'none',
          }}
        >
          ↑
        </div>
      )}
    </div>
  );
};

export default TutorialOverlay;
