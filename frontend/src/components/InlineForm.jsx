import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

export const InlineForm = ({ initialValue = "", placeholder, onSubmit, onCancel }) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => inputRef.current?.focus(), []);

  const submit = async (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    await onSubmit(value.trim());
  };

  return (
    <form onSubmit={submit}>
      <input
        ref={inputRef}
        className="field"
        value={value}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && onCancel()}
      />
      <div className="mt-2 flex gap-1">
        <button className="icon-btn bg-brand-600 text-white hover:bg-brand-700 hover:text-white" type="submit">
          <Check size={17} />
        </button>
        <button className="icon-btn" type="button" onClick={onCancel}><X size={18} /></button>
      </div>
    </form>
  );
};
