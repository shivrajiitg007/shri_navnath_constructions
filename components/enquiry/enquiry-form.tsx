"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Paperclip, X } from "lucide-react";
import { enquirySchema, type EnquiryFormValues } from "@/lib/validations";
import { submitEnquiry } from "@/lib/actions/enquiries";
import { cn } from "@/lib/utils";

const CONSTRUCTION_TYPES = ["Residential", "Commercial", "Civil / Infrastructure", "Renovation", "Other"] as const;

const inputClass =
  "w-full rounded-xl border border-concrete-200 bg-white px-4 py-3.5 text-sm text-charcoal-900 outline-none transition placeholder:text-concrete-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";
const labelClass = "mb-2 block text-sm font-medium text-charcoal-800";
const errorClass = "mt-1.5 text-xs text-red-600";

export function EnquiryForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { construction_type: "Residential" },
  });

  async function onSubmit(values: EnquiryFormValues) {
    setSubmitError(null);
    const res = await submitEnquiry(values, file);
    if (res.error) {
      setSubmitError(res.error);
      return;
    }
    router.push("/enquire/thank-you");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">Full name</label>
          <input id="name" className={inputClass} placeholder="Your name" {...register("name")} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="mobile">Mobile number</label>
          <input id="mobile" className={inputClass} placeholder="+91 XXXXX XXXXX" {...register("mobile")} />
          {errors.mobile && <p className={errorClass}>{errors.mobile.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="email">Email (optional)</label>
          <input id="email" className={inputClass} placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="project_location">Project location</label>
          <input id="project_location" className={inputClass} placeholder="City / area" {...register("project_location")} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="construction_type">Construction type</label>
          <select id="construction_type" className={inputClass} {...register("construction_type")}>
            {CONSTRUCTION_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="budget">Budget (optional)</label>
          <input id="budget" className={inputClass} placeholder="e.g. 20-30 lakh" {...register("budget")} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="description">Tell us about your project</label>
        <textarea
          id="description"
          rows={5}
          className={cn(inputClass, "resize-none")}
          placeholder="Plot size, timeline, what you're looking to build..."
          {...register("description")}
        />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Attach a file (optional)</label>
        {!file ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-concrete-300 bg-white py-4 text-sm text-concrete-500 transition hover:border-gold-500 hover:text-gold-600"
          >
            <Paperclip className="h-4 w-4" /> Upload a plan, photo, or reference document
          </button>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-concrete-200 bg-white px-4 py-3.5 text-sm text-charcoal-800">
            <span className="truncate">{file.name}</span>
            <button type="button" onClick={() => setFile(null)} className="ml-3 text-concrete-400 hover:text-red-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {submitError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal-900 py-4 text-sm font-semibold text-warmwhite transition hover:bg-charcoal-800 disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit Enquiry
      </button>
    </form>
  );
}
