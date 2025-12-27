import { useEffect, useState } from "react";
import { X, Calendar, User, Tag, Link as LinkIcon, AlertCircle } from "lucide-react";
import * as Icons from "lucide-react";
import ReactMarkdown from "react-markdown";

const normalizeNodeData = (data = {}) => {
  const metadata = data.metadata || {};

  return {
    ...data,
    label: data.label || "",
    shortDescription: data.shortDescription || "",
    detailedDescription: data.detailedDescription || "",
    metadata: {
      status: metadata.status || "planned",
      owner: metadata.owner || "",
      criticality: metadata.criticality || "low",
      version: metadata.version || "",
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      links: Array.isArray(metadata.links) ? metadata.links : [],
      dateAdded: metadata.dateAdded || "",
      dateModified: metadata.dateModified || ""
    }
  };
};

const NodeDetailPanel = ({ node, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(() => normalizeNodeData(node?.data));

  useEffect(() => {
    setEditedData(normalizeNodeData(node?.data));
  }, [node]);

  if (!node) return null;

  // Get the icon component
  const IconComponent = editedData.icon && Icons[editedData.icon]
    ? Icons[editedData.icon]
    : Icons.Box;

  const handleSave = () => {
    onUpdate(node.id, editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(node.data);
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const updateMetadata = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  const addTag = (tag) => {
    if (tag && !(editedData.metadata?.tags || []).includes(tag)) {
      updateMetadata('tags', [...(editedData.metadata?.tags || []), tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    updateMetadata('tags', (editedData.metadata?.tags || []).filter(t => t !== tagToRemove));
  };

  const addLink = () => {
    updateMetadata('links', [...(editedData.metadata?.links || []), { url: '', label: '' }]);
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...(editedData.metadata?.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateMetadata('links', newLinks);
  };

  const removeLink = (index) => {
    updateMetadata('links', (editedData.metadata?.links || []).filter((_, i) => i !== index));
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString();
  };

  return (
    <aside
      className="w-80 border-l flex flex-col h-full overflow-hidden"
      style={{
        borderColor: "var(--border-primary)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Node Details
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-opacity-10"
          style={{ color: "var(--text-secondary)" }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Info Section */}
        <section>
          <h3 className="text-sm font-semibold uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
            Basic Info
          </h3>

          {/* Name */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.label}
                onChange={(e) => updateField('label', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            ) : (
              <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {editedData.label}
              </div>
            )}
          </div>

          {/* Type */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Type
            </label>
            <div className="flex items-center gap-2">
              <IconComponent className="w-4 h-4" style={{ color: "var(--accent-blue)" }} />
              <span className="text-sm capitalize" style={{ color: "var(--text-primary)" }}>
                {node.type}
              </span>
            </div>
          </div>
        </section>

        {/* Descriptions Section */}
        <section>
          <h3 className="text-sm font-semibold uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
            Descriptions
          </h3>

          {/* Short Description */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Short Description
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.shortDescription}
                onChange={(e) => updateField('shortDescription', e.target.value)}
                placeholder="Brief summary..."
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            ) : (
              <div className="text-sm" style={{ color: "var(--text-primary)" }}>
                {editedData.shortDescription || <span style={{ color: "var(--text-secondary)" }}>No description</span>}
              </div>
            )}
          </div>

          {/* Detailed Description */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Detailed Description
            </label>
            {isEditing ? (
              <textarea
                value={editedData.detailedDescription}
                onChange={(e) => updateField('detailedDescription', e.target.value)}
                placeholder="Full description (supports markdown)..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            ) : editedData.detailedDescription ? (
              <div
                className="text-sm prose prose-sm max-w-none"
                style={{ color: "var(--text-primary)" }}
              >
                <ReactMarkdown>{editedData.detailedDescription}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                No detailed description
              </div>
            )}
          </div>
        </section>

        {/* Metadata Section */}
        <section>
          <h3 className="text-sm font-semibold uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
            Metadata
          </h3>

          {/* Status */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Status
            </label>
            {isEditing ? (
              <select
                value={editedData.metadata.status}
                onChange={(e) => updateMetadata('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="deployed">Deployed</option>
                <option value="deprecated">Deprecated</option>
              </select>
            ) : (
              <span className="inline-block px-2 py-1 rounded text-xs font-medium capitalize" style={{
                backgroundColor: editedData.metadata.status === 'deployed' ? 'rgba(16, 185, 129, 0.2)' :
                               editedData.metadata.status === 'in-progress' ? 'rgba(59, 130, 246, 0.2)' :
                               editedData.metadata.status === 'deprecated' ? 'rgba(239, 68, 68, 0.2)' :
                               'rgba(156, 163, 175, 0.2)',
                color: editedData.metadata.status === 'deployed' ? '#10b981' :
                       editedData.metadata.status === 'in-progress' ? '#3b82f6' :
                       editedData.metadata.status === 'deprecated' ? '#ef4444' :
                       '#9ca3af',
              }}>
                {editedData.metadata.status}
              </span>
            )}
          </div>

          {/* Owner */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              <User className="w-3 h-3 inline mr-1" />
              Owner
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.metadata.owner}
                onChange={(e) => updateMetadata('owner', e.target.value)}
                placeholder="Team or person..."
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            ) : (
              <div className="text-sm" style={{ color: "var(--text-primary)" }}>
                {editedData.metadata.owner || <span style={{ color: "var(--text-secondary)" }}>Not assigned</span>}
              </div>
            )}
          </div>

          {/* Criticality */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Criticality
            </label>
            {isEditing ? (
              <select
                value={editedData.metadata.criticality}
                onChange={(e) => updateMetadata('criticality', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            ) : (
              <span className="inline-block px-2 py-1 rounded text-xs font-medium capitalize" style={{
                backgroundColor: editedData.metadata.criticality === 'critical' ? 'rgba(239, 68, 68, 0.2)' :
                               editedData.metadata.criticality === 'high' ? 'rgba(249, 115, 22, 0.2)' :
                               editedData.metadata.criticality === 'medium' ? 'rgba(59, 130, 246, 0.2)' :
                               'rgba(156, 163, 175, 0.2)',
                color: editedData.metadata.criticality === 'critical' ? '#ef4444' :
                       editedData.metadata.criticality === 'high' ? '#f97316' :
                       editedData.metadata.criticality === 'medium' ? '#3b82f6' :
                       '#9ca3af',
              }}>
                {editedData.metadata.criticality}
              </span>
            )}
          </div>

          {/* Version */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Version
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.metadata.version}
                onChange={(e) => updateMetadata('version', e.target.value)}
                placeholder="e.g., v1.0.0"
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            ) : (
              <div className="text-sm" style={{ color: "var(--text-primary)" }}>
                {editedData.metadata.version || <span style={{ color: "var(--text-secondary)" }}>Not set</span>}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              <Tag className="w-3 h-3 inline mr-1" />
              Tags
            </label>
            {isEditing ? (
              <div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {editedData.metadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        color: "#3b82f6",
                      }}
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tag and press Enter..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addTag(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-1">
                {editedData.metadata?.tags && editedData.metadata.tags.length > 0 ? (
                  editedData.metadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        color: "#3b82f6",
                      }}
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>No tags</span>
                )}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              <LinkIcon className="w-3 h-3 inline mr-1" />
              Links
            </label>
            {isEditing ? (
              <div className="space-y-2">
                {editedData.metadata.links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(index, 'label', e.target.value)}
                      placeholder="Label"
                      className="flex-1 px-2 py-1 rounded border text-xs"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      placeholder="URL"
                      className="flex-1 px-2 py-1 rounded border text-xs"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <button
                      onClick={() => removeLink(index)}
                      className="px-2 py-1 rounded text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addLink}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  + Add Link
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {editedData.metadata.links.length > 0 ? (
                  editedData.metadata.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm hover:underline"
                      style={{ color: "var(--accent-blue)" }}
                    >
                      {link.label || link.url}
                    </a>
                  ))
                ) : (
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>No links</span>
                )}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="mb-3 pt-3 border-t" style={{ borderColor: "var(--border-primary)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-3 h-3" style={{ color: "var(--text-secondary)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                Created: {formatDate(editedData.metadata.dateAdded)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" style={{ color: "var(--text-secondary)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                Modified: {formatDate(editedData.metadata.dateModified)}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Footer with action buttons */}
      <div
        className="p-4 border-t flex gap-2"
        style={{ borderColor: "var(--border-primary)" }}
      >
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: "var(--accent-blue)",
                color: "#ffffff",
              }}
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border"
              style={{
                borderColor: "var(--border-primary)",
                color: "var(--text-secondary)",
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "var(--accent-blue)",
              color: "#ffffff",
            }}
          >
            Edit Node
          </button>
        )}
      </div>
    </aside>
  );
};

export default NodeDetailPanel;
