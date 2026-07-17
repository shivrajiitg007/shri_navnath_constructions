"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff, Building2 } from "lucide-react";
import { AdminModal } from "./modal";
import { MediaPicker } from "./media-picker";
import { createProject, updateProject, deleteProject, toggleProjectHidden } from "@/lib/actions/projects";
import type { Project, ProjectStatus } from "@/lib/types";

type FormState = {
  title: string;
  description: string;
  location: string;
  construction_type: string;
  status: ProjectStatus;
  cover_image: string;
  is_hidden: boolean;
};

const EMPTY: FormState = { title: "", description: "", location: "", construction_type: "", status: "ongoing", cover_image: "", is_hidden: false };

const inputClass = "w-full rounded-xl border border-concrete-200 bg-white px-4 py-3 text-sm text-charcoal-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-concrete-500";

export function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openNew() {
    setEditingId(null);
    setForm(EMPTY);
    setError(null);
    setModalOpen(true);
  }

  function openEdit(p: Project) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description ?? "",
      location: p.location ?? "",
      construction_type: p.construction_type ?? "",
      status: p.status,
      cover_image: p.cover_image ?? "",
      is_hidden: p.is_hidden,
    });
    setError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = editingId ? await updateProject(editingId, form) : await createProject(form);
    if (res.error) {
      setError(res.error);
      return;
    }
    setModalOpen(false);
    // optimistic-ish: just refetch page data on next navigation; also patch local state
    if (editingId) {
      setProjects((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form } as Project : p)));
    } else {
      setProjects((prev) => [{ ...form, id: crypto.randomUUID(), images: [], sort_order: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Project, ...prev]);
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this project permanently?")) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    startTransition(() => { void deleteProject(id); });
  }

  function handleToggleHidden(p: Project) {
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_hidden: !x.is_hidden } : x)));
    startTransition(() => { void toggleProjectHidden(p.id, !p.is_hidden); });
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-concrete-500">{projects.length} project{projects.length === 1 ? "" : "s"}</p>
        <button onClick={openNew} className="flex items-center gap-1.5 rounded-full bg-charcoal-900 px-5 py-2.5 text-sm font-semibold text-warmwhite hover:bg-charcoal-800">
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-concrete-300 bg-white p-14 text-center">
          <Building2 className="mx-auto h-8 w-8 text-concrete-300" />
          <p className="mt-3 text-sm text-concrete-500">No projects yet. New work you add here appears in the public Gallery.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-concrete-200 bg-white">
              <div className="relative h-40 w-full bg-concrete-100">
                {p.cover_image && <Image src={p.cover_image} alt={p.title} fill className="object-cover" sizes="360px" />}
                {p.is_hidden && (
                  <span className="absolute left-3 top-3 rounded-full bg-charcoal-950/80 px-2.5 py-1 text-[10px] font-semibold text-warmwhite">Hidden</span>
                )}
              </div>
              <div className="p-4">
                <p className="truncate font-medium text-charcoal-900">{p.title}</p>
                <p className="mt-0.5 truncate text-xs text-concrete-500">{p.location || "—"} &middot; <span className="capitalize">{p.status}</span></p>
                <div className="mt-3 flex items-center gap-1.5">
                  <button onClick={() => openEdit(p)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-concrete-200 py-1.5 text-xs font-medium text-charcoal-700 hover:border-charcoal-400">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button onClick={() => handleToggleHidden(p)} className="flex items-center justify-center rounded-lg border border-concrete-200 p-1.5 text-charcoal-700 hover:border-charcoal-400" disabled={isPending}>
                    {p.is_hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="flex items-center justify-center rounded-lg border border-concrete-200 p-1.5 text-red-600 hover:border-red-300" disabled={isPending}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Project" : "Add Project"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Cover Image</label>
            <MediaPicker value={form.cover_image} onChange={(url) => setForm((f) => ({ ...f, cover_image: url }))} folder="projects" />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input required className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Location</label>
              <input className={inputClass} value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <input className={inputClass} placeholder="Residential..." value={form.construction_type} onChange={(e) => setForm((f) => ({ ...f, construction_type: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProjectStatus }))}>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea rows={3} className={inputClass} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <label className="flex items-center gap-2 text-sm text-charcoal-700">
            <input type="checkbox" checked={form.is_hidden} onChange={(e) => setForm((f) => ({ ...f, is_hidden: e.target.checked }))} />
            Hide from public gallery
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-charcoal-900 py-3 text-sm font-semibold text-warmwhite hover:bg-charcoal-800">
            {editingId ? "Save Changes" : "Add Project"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
