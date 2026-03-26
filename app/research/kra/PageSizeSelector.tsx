"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function PageSizeSelector({ currentSize }: { currentSize: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", e.target.value);
    params.set("page", "1"); // Go back to page 1 when changing size
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
      <span className="text-[10px] text-slate-400 uppercase font-black tracking-tight">Show</span>
      <select
        value={currentSize}
        onChange={handleChange}
        className="text-xs font-bold outline-none bg-transparent cursor-pointer text-slate-700"
      >
        <option value={15}>15 rows</option>
        <option value={25}>25 rows</option>
        <option value={50}>50 rows</option>
        <option value={100}>100 rows</option>
      </select>
    </div>
  );
}