import React, { useId } from "react";

const Textarea = React.forwardRef(function Textarea(
  { label, className = "", ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1 text-muted text-sm" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        className={`px-3 py-2 rounded-lg bg-bg text-text outline-none focus:border-accent duration-200 border border-muted w-full font-mono resize-none ${className}`}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Textarea;