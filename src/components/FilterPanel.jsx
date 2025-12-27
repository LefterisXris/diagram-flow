import { Filter, X } from "lucide-react";

/**
 * FilterPanel Component
 *
 * Provides filtering controls for nodes by type, status, owner, and tags.
 * Displays in the Sidebar as a separate tab.
 */
const FilterPanel = ({
  filters,
  onFiltersChange,
  filterOptions,
  visibleCount,
  totalCount,
  onClearFilters,
}) => {
  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.statuses.length > 0 ||
    filters.owners.length > 0 ||
    filters.tags.length > 0;

  const toggleFilter = (category, value) => {
    const currentValues = filters[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFiltersChange({
      ...filters,
      [category]: newValues,
    });
  };

  const FilterSection = ({ title, category, options }) => {
    if (!options || options.length === 0) {
      return null;
    }

    return (
      <div className="space-y-2">
        <h3
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          {title}
        </h3>
        <div className="space-y-1">
          {options.map((option) => {
            const isChecked = filters[category]?.includes(option) || false;
            return (
              <label
                key={option}
                className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-opacity-50 transition-colors"
                style={{
                  backgroundColor: isChecked
                    ? "var(--bg-tertiary)"
                    : "transparent",
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleFilter(category, option)}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: "var(--accent-blue)",
                  }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: "var(--accent-blue)" }} />
          <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Filters
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors"
            style={{
              color: "var(--accent-blue)",
              backgroundColor: "var(--bg-tertiary)",
            }}
            title="Clear all filters"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Count */}
      <div
        className="px-4 py-3 text-sm border-b"
        style={{
          borderColor: "var(--border-primary)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <span style={{ color: "var(--text-primary)" }}>
          <strong>{visibleCount}</strong> of <strong>{totalCount}</strong> nodes visible
        </span>
      </div>

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <FilterSection
          title="Node Type"
          category="types"
          options={filterOptions.types}
        />
        <FilterSection
          title="Status"
          category="statuses"
          options={filterOptions.statuses}
        />
        <FilterSection
          title="Owner"
          category="owners"
          options={filterOptions.owners}
        />
        <FilterSection
          title="Tags"
          category="tags"
          options={filterOptions.tags}
        />

        {/* Empty State */}
        {filterOptions.types.length === 0 &&
          filterOptions.statuses.length === 0 &&
          filterOptions.owners.length === 0 &&
          filterOptions.tags.length === 0 && (
            <div
              className="text-center py-8 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No filter options available.
              <br />
              Add nodes to see filters.
            </div>
          )}
      </div>
    </div>
  );
};

export default FilterPanel;
