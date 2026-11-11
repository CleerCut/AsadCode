import useApplicationsSubtabToggle from "./use-applications-subtab-toggle.hook";

function ApplicationsSubtabToggle({ activeSubTab, onSubTabChange, counts }) {
  const { segments, handleSelect } = useApplicationsSubtabToggle({
    activeSubTab,
    onSubTabChange,
    counts,
  });

  return (
    <div
      className="flex h-9 min-w-0 flex-1 items-center gap-1 sm:gap-1.5 md:w-auto md:flex-none"
      role="tablist"
      aria-label="Applications workflow"
    >
      {segments.map((segment) => {
        const isActive = activeSubTab === segment.id;
        return (
          <button
            key={segment.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(segment.id)}
            className={`inline-flex h-9 min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden rounded-md border px-1.5 text-[11px] font-semibold leading-none transition-colors sm:gap-1.5 sm:px-3 sm:text-xs md:w-auto md:flex-none md:px-4 md:text-sm ${
              isActive
                ? "border-[#4552DF] bg-[#4552DF] text-white shadow-sm"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="truncate">{segment.label}</span>
            <span
              className={`inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded px-1 text-[10px] font-bold leading-none tabular-nums ${
                isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {segment.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default ApplicationsSubtabToggle;
