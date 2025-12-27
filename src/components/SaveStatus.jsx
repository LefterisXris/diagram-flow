import { Check, AlertCircle } from 'lucide-react';

/**
 * Save Status Indicator
 * Shows "Saved" or "Unsaved changes" based on dirty state
 */
export default function SaveStatus({ isDirty, lastSaved }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isDirty) {
    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm"
        style={{
          backgroundColor: 'var(--accent-yellow)',
          color: '#000',
        }}
      >
        <AlertCircle size={14} />
        <span className="font-medium">Unsaved changes</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm"
        style={{
          backgroundColor: 'var(--accent-green)',
          color: '#fff',
        }}
      >
        <Check size={14} />
        <span className="font-medium">
          Saved {formatTime(lastSaved)}
        </span>
      </div>
    );
  }

  return null;
}
