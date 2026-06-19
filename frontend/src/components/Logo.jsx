import { Columns3 } from "lucide-react";

export const Logo = ({ compact = false, light = false }) => (
  <div className="flex items-center gap-2.5">
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
      <Columns3 size={19} />
    </span>
    {!compact && (
      <span
        className={`font-['Manrope'] text-xl font-extrabold ${
          light ? "text-white" : "text-ink"
        }`}
      >
        Boardly
      </span>
    )}
  </div>
);
