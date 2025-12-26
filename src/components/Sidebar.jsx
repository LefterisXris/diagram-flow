const Sidebar = () => {
  return (
    <aside
      className="w-64 border-r flex flex-col"
      style={{
        borderColor: "var(--border-primary)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <div className="p-4">
        <h2 className="text-sm font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
          Tools
        </h2>
      </div>
      {/* Tool palette will go here */}
    </aside>
  );
};

export default Sidebar;
