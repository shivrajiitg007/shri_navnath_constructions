"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Users, Phone, Mail } from "lucide-react";
import { AdminModal } from "./modal";
import { MediaPicker } from "./media-picker";
import { createEmployee, updateEmployee, deleteEmployee } from "@/lib/actions/employees";
import type { Employee } from "@/lib/types";

type FormState = {
  name: string;
  designation: string;
  experience_years: string;
  phone: string;
  email: string;
  photo_url: string;
};

const EMPTY: FormState = { name: "", designation: "", experience_years: "", phone: "", email: "", photo_url: "" };
const inputClass = "w-full rounded-xl border border-concrete-200 bg-white px-4 py-3 text-sm text-charcoal-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-concrete-500";

export function EmployeesManager({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function openNew() {
    setEditingId(null);
    setForm(EMPTY);
    setError(null);
    setModalOpen(true);
  }

  function openEdit(emp: Employee) {
    setEditingId(emp.id);
    setForm({
      name: emp.name,
      designation: emp.designation ?? "",
      experience_years: emp.experience_years?.toString() ?? "",
      phone: emp.phone ?? "",
      email: emp.email ?? "",
      photo_url: emp.photo_url ?? "",
    });
    setError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = { ...form, experience_years: form.experience_years ? Number(form.experience_years) : undefined };
    const res = editingId ? await updateEmployee(editingId, payload) : await createEmployee(payload);
    if (res.error) {
      setError(res.error);
      return;
    }
    setModalOpen(false);
    if (editingId) {
      setEmployees((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...form, experience_years: payload.experience_years ?? null } as Employee : x)));
    } else {
      setEmployees((prev) => [
        { ...form, experience_years: payload.experience_years ?? null, id: crypto.randomUUID(), sort_order: 0, created_at: new Date().toISOString() } as Employee,
        ...prev,
      ]);
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Remove this team member?")) return;
    setEmployees((prev) => prev.filter((x) => x.id !== id));
    startTransition(() => { void deleteEmployee(id); });
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-concrete-500">{employees.length} team member{employees.length === 1 ? "" : "s"}</p>
        <button onClick={openNew} className="flex items-center gap-1.5 rounded-full bg-charcoal-900 px-5 py-2.5 text-sm font-semibold text-warmwhite hover:bg-charcoal-800">
          <Plus className="h-4 w-4" /> Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-concrete-300 bg-white p-14 text-center">
          <Users className="mx-auto h-8 w-8 text-concrete-300" />
          <p className="mt-3 text-sm text-concrete-500">No team members added yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((emp) => (
            <div key={emp.id} className="rounded-2xl border border-concrete-200 bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-concrete-100">
                  {emp.photo_url ? (
                    <Image src={emp.photo_url} alt={emp.name} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-concrete-400">
                      {emp.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-charcoal-900">{emp.name}</p>
                  <p className="truncate text-xs text-concrete-500">{emp.designation || "—"}{emp.experience_years ? ` · ${emp.experience_years} yrs` : ""}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-concrete-500">
                {emp.phone && <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {emp.phone}</p>}
                {emp.email && <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {emp.email}</p>}
              </div>
              <div className="mt-4 flex items-center gap-1.5">
                <button onClick={() => openEdit(emp)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-concrete-200 py-1.5 text-xs font-medium text-charcoal-700 hover:border-charcoal-400">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button onClick={() => handleDelete(emp.id)} className="flex items-center justify-center rounded-lg border border-concrete-200 p-1.5 text-red-600 hover:border-red-300">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Employee" : "Add Employee"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Photo</label>
            <MediaPicker value={form.photo_url} onChange={(url) => setForm((f) => ({ ...f, photo_url: url }))} folder="employees" />
          </div>
          <div>
            <label className={labelClass}>Name</label>
            <input required className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Designation</label>
              <input className={inputClass} value={form.designation} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Experience (years)</label>
              <input type="number" min={0} className={inputClass} value={form.experience_years} onChange={(e) => setForm((f) => ({ ...f, experience_years: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-charcoal-900 py-3 text-sm font-semibold text-warmwhite hover:bg-charcoal-800">
            {editingId ? "Save Changes" : "Add Employee"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
