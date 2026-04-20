"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from "date-fns";
import Link from "next/link";

// 1. Define the interface based on your kam_content schema
interface KamContent {
  id: number;
  title: string;
  slug: string;
  content_type: string;
  is_active: boolean;
  updated_at: Date | string;
  sector_relation?: {
    name: string;
  } | null;
}

interface EditableRowProps {
  item: KamContent;
  onDelete: (id: number) => Promise<void>;
}

function EditableRow({ item, onDelete }: EditableRowProps) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    title: item.title,
    content_type: item.content_type,
    is_active: item.is_active,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/content/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEdit(false);
      window.location.reload();
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr className="group hover:bg-blue-50/30 transition-colors text-sm">
      <td className="p-4">
        {edit ? (
          <input
            className="border px-2 py-1 rounded w-full outline-[#193C8D]"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
        ) : (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">{item.title}</span>
            <span className="text-[10px] text-slate-400 font-mono">/{item.slug}</span>
          </div>
        )}
      </td>
      <td className="p-4">
        {edit ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={form.content_type}
            onChange={e => setForm(f => ({ ...f, content_type: e.target.value }))}
          />
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
            {item.content_type}
          </span>
        )}
      </td>
      <td className="p-4 text-slate-600">
        {item.sector_relation?.name || "General"}
      </td>
      <td className="p-4">
        {edit ? (
          <select
            className="border px-2 py-1 rounded"
            value={form.is_active ? "active" : "hidden"}
            onChange={e => setForm(f => ({ ...f, is_active: e.target.value === "active" }))}
          >
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        ) : (
          <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-tighter ${item.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
            {item.is_active ? 'Active' : 'Hidden'}
          </span>
        )}
      </td>
      <td className="p-4 text-xs text-slate-500 font-mono">
        {format(new Date(item.updated_at), "MMM dd, yyyy")}
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          {edit ? (
            <>
              <button onClick={handleSave} disabled={saving} className="text-emerald-700 font-bold text-[11px] hover:underline">
                {saving ? "..." : "SAVE"}
              </button>
              <button onClick={() => setEdit(false)} className="text-slate-400 font-bold text-[11px] hover:underline">
                CANCEL
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEdit(true)} className="text-[#193C8D] font-bold text-[11px] hover:underline">
                EDIT
              </button>
              <button onClick={() => onDelete(item.id)} className="text-red-600 font-bold text-[11px] hover:underline">
                DELETE
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function AdminContentClient({ content }: { content: KamContent[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.slug.toLowerCase().includes(search.toLowerCase()) ||
    item.content_type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContent.length / pageSize) || 1;
  const paginatedContent = filteredContent.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this resource from the library?")) return;
    try {
      await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
      window.location.reload();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#193C8D]">Content Manager</h1>
        <Link href="/admin/content/new" className="bg-[#193C8D] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm">
          + New Resource
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <input
          type="text"
          placeholder="Filter by title, type, or slug..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border px-3 py-2 rounded-md w-full max-w-sm text-sm outline-[#193C8D]"
        />
        <div className="flex gap-4 items-center text-xs font-bold text-slate-500">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1} 
            className="px-3 py-1.5 rounded border bg-slate-50 disabled:opacity-30 hover:bg-white transition-colors"
          >
            PREV
          </button>
          <span>PAGE {page} OF {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages} 
            className="px-3 py-1.5 rounded border bg-slate-50 disabled:opacity-30 hover:bg-white transition-colors"
          >
            NEXT
          </button>
        </div>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
          <CardTitle className="text-[#193C8D] text-sm font-bold uppercase tracking-widest">
            Content Library ({filteredContent.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-left text-[10px] uppercase tracking-widest text-slate-400 font-black">
                  <th className="p-4 border-b border-slate-100">Resource Information</th>
                  <th className="p-4 border-b border-slate-100">Format</th>
                  <th className="p-4 border-b border-slate-100">Industry Sector</th>
                  <th className="p-4 border-b border-slate-100">Status</th>
                  <th className="p-4 border-b border-slate-100">Last Modified</th>
                  <th className="p-4 border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedContent.map((item) => (
                  <EditableRow key={item.id} item={item} onDelete={handleDelete} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}