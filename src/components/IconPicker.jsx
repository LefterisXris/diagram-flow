import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import * as Icons from "lucide-react";

// Curated list of commonly used icons for diagrams
const commonIcons = [
  "Box", "Server", "Database", "Monitor", "GitBranch",
  "Cloud", "CloudDownload", "CloudUpload", "Globe", "Lock",
  "Unlock", "Key", "Shield", "AlertCircle", "CheckCircle",
  "XCircle", "Info", "HelpCircle", "Settings", "Sliders",
  "FileText", "File", "Folder", "Archive", "Package",
  "Inbox", "Mail", "Send", "MessageSquare", "Bell",
  "User", "Users", "UserPlus", "Activity", "BarChart",
  "PieChart", "TrendingUp", "TrendingDown", "Zap", "Cpu",
  "HardDrive", "Wifi", "Radio", "Bluetooth", "Cast",
  "Smartphone", "Tablet", "Laptop", "Desktop", "Tv",
  "Camera", "Video", "Image", "Music", "Headphones",
  "Play", "Pause", "StopCircle", "SkipForward", "SkipBack",
  "Volume2", "VolumeX", "Mic", "MicOff", "Search",
  "Filter", "List", "Grid", "Calendar", "Clock",
  "MapPin", "Map", "Navigation", "Compass", "Target",
  "Flag", "Bookmark", "Tag", "Hash", "AtSign",
  "Link", "ExternalLink", "Download", "Upload", "Share",
  "Copy", "Clipboard", "Edit", "Trash", "Save",
  "RefreshCw", "RotateCw", "RotateCcw", "Plus", "Minus",
  "Check", "X", "ChevronUp", "ChevronDown", "ChevronLeft",
  "ChevronRight", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "Code", "Terminal", "Command", "Layers", "Layout",
  "Sidebar", "Menu", "MoreVertical", "MoreHorizontal", "Circle",
  "Square", "Triangle", "Hexagon", "Star", "Heart",
];

const IconPicker = ({ selectedIcon, onSelectIcon, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter icons based on search term
  const filteredIcons = useMemo(() => {
    if (!searchTerm) return commonIcons;
    const lowerSearch = searchTerm.toLowerCase();
    return commonIcons.filter(icon => icon.toLowerCase().includes(lowerSearch));
  }, [searchTerm]);

  const handleIconClick = (iconName) => {
    onSelectIcon(iconName);
    if (onClose) onClose();
  };

  return (
    <div
      className="absolute z-50 rounded-lg shadow-xl border-2 p-4 w-80"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-primary)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Choose Icon
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-opacity-10"
            style={{ color: "var(--text-secondary)" }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
          style={{ color: "var(--text-secondary)" }}
        />
        <input
          type="text"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg border text-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Icon Grid */}
      <div className="max-h-64 overflow-y-auto">
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-6 gap-2">
            {filteredIcons.map((iconName) => {
              const IconComponent = Icons[iconName];
              const isSelected = selectedIcon === iconName;

              return (
                <button
                  key={iconName}
                  onClick={() => handleIconClick(iconName)}
                  className="p-2 rounded hover:bg-opacity-10 transition-all border-2"
                  style={{
                    backgroundColor: isSelected ? "rgba(59, 130, 246, 0.2)" : "transparent",
                    borderColor: isSelected ? "#3b82f6" : "transparent",
                    color: isSelected ? "#3b82f6" : "var(--text-secondary)",
                  }}
                  title={iconName}
                >
                  <IconComponent className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-sm" style={{ color: "var(--text-secondary)" }}>
            No icons found
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
        {filteredIcons.length} icon{filteredIcons.length !== 1 ? "s" : ""} available
      </div>
    </div>
  );
};

export default IconPicker;
