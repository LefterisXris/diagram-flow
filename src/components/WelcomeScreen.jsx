import { useState } from 'react';
import { Sparkles, Play, FileText, Zap, GitBranch, History, Database } from 'lucide-react';

/**
 * Welcome Screen Component
 *
 * Displays on first launch to help users get started with DiagramFlow.
 * Shows feature highlights and offers choice between Pet Clinic template or empty canvas.
 *
 * Based on architect.md Section 12.1 (Onboarding)
 */
const WelcomeScreen = ({ onStartWithTemplate, onStartEmpty, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleStartWithTemplate = () => {
    setIsClosing(true);
    setTimeout(() => {
      onStartWithTemplate();
      onClose();
    }, 300);
  };

  const handleStartEmpty = () => {
    setIsClosing(true);
    setTimeout(() => {
      onStartEmpty();
      onClose();
    }, 300);
  };

  const features = [
    {
      icon: GitBranch,
      title: 'Interactive Flow Diagrams',
      description: 'Build system diagrams with drag & drop. Multiple node types with rich metadata.',
    },
    {
      icon: Zap,
      title: 'Conditional Logic',
      description: 'Add decision nodes with conditional branching. Visualize complex flows clearly.',
    },
    {
      icon: Play,
      title: 'Flow Simulation',
      description: 'Run example cases and watch data flow through your system step-by-step.',
    },
    {
      icon: Database,
      title: 'Data Inspector',
      description: 'Track data transformations at each node. See input, output, and changes in real-time.',
    },
    {
      icon: History,
      title: 'Simulation History',
      description: 'Track all simulation runs, replay previous executions, and compare results.',
    },
    {
      icon: FileText,
      title: '100% Client-Side',
      description: 'No backend required. All data stored locally. Export to JSON or Mermaid.',
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className={`relative w-full max-w-4xl mx-4 rounded-2xl shadow-2xl transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 border-b"
          style={{
            borderColor: 'var(--border-primary)',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              }}
            >
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Welcome to DiagramFlow
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Build, Simulate, Visualize
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* Introduction */}
          <p className="text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
            DiagramFlow is an interactive tool for creating system diagrams with conditional logic,
            running simulations with real data, and visualizing how information flows through your architecture.
          </p>

          {/* Features Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-primary)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                          {feature.title}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Getting Started */}
          <div
            className="p-6 rounded-lg border-l-4 mb-6"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              borderColor: 'var(--accent-blue)',
            }}
          >
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              How would you like to start?
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Choose the Pet Clinic template to explore all features with a working example,
              or start with an empty canvas to build your own diagram from scratch.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start with Template */}
            <button
              onClick={handleStartWithTemplate}
              className="group relative p-6 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                borderColor: 'var(--accent-blue)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--accent-blue)',
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--accent-blue)' }}>
                    Start with Pet Clinic Template
                  </h3>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Recommended for first-time users
                  </span>
                </div>
              </div>
              <p className="text-sm text-left" style={{ color: 'var(--text-secondary)' }}>
                Explore a complete 3-tier application with Angular, Spring Boot, and MySQL.
                Includes example cases and simulations ready to run.
              </p>
              <div
                className="mt-4 text-sm font-medium"
                style={{ color: 'var(--accent-blue)' }}
              >
                Load Template →
              </div>
            </button>

            {/* Start Empty */}
            <button
              onClick={handleStartEmpty}
              className="group relative p-6 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '2px solid var(--border-primary)',
                  }}
                >
                  <FileText className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Start with Empty Canvas
                  </h3>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    For experienced users
                  </span>
                </div>
              </div>
              <p className="text-sm text-left" style={{ color: 'var(--text-secondary)' }}>
                Begin with a blank diagram and build your architecture from scratch.
                Perfect for custom systems and unique workflows.
              </p>
              <div
                className="mt-4 text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                Start Fresh →
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-4 border-t flex items-center justify-between"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            This welcome screen will only show once. You can always load templates later from the menu.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-blue)' }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--border-primary)' }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--border-primary)' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
