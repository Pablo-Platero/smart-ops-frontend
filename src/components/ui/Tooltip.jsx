export default function Tooltip({ label, children }) {
  return (
    <div className="group relative flex justify-center">
      {children}

      <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-black px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        {label}
      </div>
    </div>
  );
}
