"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { MediaPicker } from "./media-picker";
import { updateSiteContent } from "@/lib/actions/website-content";
import type { SiteContentMap } from "@/lib/types";

const inputClass = "w-full rounded-xl border border-concrete-200 bg-white px-4 py-3 text-sm text-charcoal-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-concrete-500";

const TABS = ["Homepage", "About", "Contact", "Footer"] as const;
type Tab = (typeof TABS)[number];

export function WebsiteEditor({ content }: { content: SiteContentMap }) {
  const [tab, setTab] = useState<Tab>("Homepage");
  const [homepage, setHomepage] = useState(content.homepage);
  const [about, setAbout] = useState(content.about);
  const [contact, setContact] = useState(content.contact);
  const [footer, setFooter] = useState(content.footer);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    if (tab === "Homepage") await updateSiteContent("homepage", homepage);
    if (tab === "About") await updateSiteContent("about", about);
    if (tab === "Contact") await updateSiteContent("contact", contact);
    if (tab === "Footer") await updateSiteContent("footer", footer);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              tab === t ? "bg-charcoal-900 text-warmwhite" : "border border-concrete-200 bg-white text-concrete-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="max-w-xl rounded-2xl border border-concrete-200 bg-white p-7">
        {tab === "Homepage" && (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Hero Image</label>
              <MediaPicker value={homepage.heroImage} onChange={(url) => setHomepage((h) => ({ ...h, heroImage: url }))} folder="homepage" />
            </div>
            <div>
              <label className={labelClass}>Hero Heading</label>
              <input className={inputClass} value={homepage.heroHeading} onChange={(e) => setHomepage((h) => ({ ...h, heroHeading: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Hero Subheading</label>
              <textarea rows={3} className={inputClass} value={homepage.heroSubheading} onChange={(e) => setHomepage((h) => ({ ...h, heroSubheading: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Primary Button</label>
                <input className={inputClass} value={homepage.heroButtonPrimary} onChange={(e) => setHomepage((h) => ({ ...h, heroButtonPrimary: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Secondary Button</label>
                <input className={inputClass} value={homepage.heroButtonSecondary} onChange={(e) => setHomepage((h) => ({ ...h, heroButtonSecondary: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {tab === "About" && (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Heading</label>
              <input className={inputClass} value={about.heading} onChange={(e) => setAbout((a) => ({ ...a, heading: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Body</label>
              <textarea rows={6} className={inputClass} value={about.body} onChange={(e) => setAbout((a) => ({ ...a, body: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Founded Year</label>
                <input className={inputClass} value={about.foundedYear} onChange={(e) => setAbout((a) => ({ ...a, foundedYear: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Years Experience</label>
                <input className={inputClass} value={about.yearsExperience} onChange={(e) => setAbout((a) => ({ ...a, yearsExperience: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {tab === "Contact" && (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input className={inputClass} value={contact.address} onChange={(e) => setContact((c) => ({ ...c, address: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Map Search Query</label>
              <input className={inputClass} value={contact.mapsQuery} onChange={(e) => setContact((c) => ({ ...c, mapsQuery: e.target.value }))} />
            </div>
          </div>
        )}

        {tab === "Footer" && (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Tagline</label>
              <textarea rows={2} className={inputClass} value={footer.tagline} onChange={(e) => setFooter((f) => ({ ...f, tagline: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Copyright Name</label>
              <input className={inputClass} value={footer.copyrightName} onChange={(e) => setFooter((f) => ({ ...f, copyrightName: e.target.value }))} />
            </div>
          </div>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="mt-7 flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-charcoal-950 hover:bg-gold-400 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saved && <Check className="h-4 w-4" />}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
