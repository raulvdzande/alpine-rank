"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function ResortSearch({ current }: { current: string }) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = ref.current?.value.trim() ?? "";
    const url = q ? `/resorts?q=${encodeURIComponent(q)}` : "/resorts";
    router.push(url);
  }

  function clear() {
    if (ref.current) ref.current.value = "";
    router.push("/resorts");
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ position: "relative" }}>
        <input
          ref={ref}
          defaultValue={current}
          placeholder="Search resort by name..."
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 8,
            color: "white",
            padding: "8px 36px 8px 14px",
            fontSize: 13,
            outline: "none",
            width: 240,
          }}
        />
        {current && (
          <button
            type="button"
            onClick={clear}
            style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "#64748b",
              cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0,
            }}
          >
            ×
          </button>
        )}
      </div>
      <button
        type="submit"
        style={{
          background: "#3b82f6", color: "white", border: "none",
          borderRadius: 8, padding: "8px 16px", fontSize: 13,
          fontWeight: 600, cursor: "pointer",
        }}
      >
        Search
      </button>
    </form>
  );
}
