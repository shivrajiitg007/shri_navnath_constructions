"use client";

import { useState, useRef, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "./auth-provider";
import { sendOtp, verifyOtp } from "@/lib/actions/auth";
import { otpEmailSchema, otpCodeSchema } from "@/lib/validations";

type Step = "email" | "otp" | "success";

export function LoginModal() {
  const { loginOpen, closeLogin, refresh } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  function reset() {
    setStep("email");
    setEmail("");
    setCode(["", "", "", "", "", ""]);
    setError(null);
    setBusy(false);
  }

  function handleClose() {
    closeLogin();
    setTimeout(reset, 300);
  }

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = otpEmailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setBusy(true);
    const res = await sendOtp(email.trim());
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setStep("otp");
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  }

  async function handleVerify(tokenOverride?: string) {
    const token = tokenOverride ?? code.join("");
    const parsed = otpCodeSchema.safeParse({ token });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setBusy(true);
    setError(null);
    const res = await verifyOtp(email.trim(), token);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setStep("success");
    await refresh();
    setTimeout(handleClose, 1100);
  }

  function handleDigit(i: number, val: string) {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) inputsRef.current[i + 1]?.focus();
    if (next.every((d) => d !== "") && next.join("").length === 6) {
      handleVerify(next.join(""));
    }
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[i] && i > 0) inputsRef.current[i - 1]?.focus();
  }

  return (
    <AnimatePresence>
      {loginOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-charcoal-950/70 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-warmwhite shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-1 w-full bg-gold-500" />
            <button
              onClick={handleClose}
              className="absolute right-5 top-6 text-concrete-500 transition hover:text-charcoal-900"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-8 py-10 sm:px-10">
              {step === "email" && (
                <>
                  <div className="mb-1 eyebrow">Sign in</div>
                  <h3 className="font-display mt-2 text-2xl font-semibold text-charcoal-900">Welcome back</h3>
                  <p className="mt-2 text-sm text-concrete-600">
                    Enter your email and we&apos;ll send you a 6-digit code. No password needed.
                  </p>
                  <form onSubmit={handleSendOtp} className="mt-7 space-y-4">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-concrete-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-concrete-200 bg-white py-3.5 pl-11 pr-4 text-sm text-charcoal-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                        autoFocus
                      />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button
                      type="submit"
                      disabled={busy}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal-900 py-3.5 text-sm font-semibold text-warmwhite transition hover:bg-charcoal-800 disabled:opacity-60"
                    >
                      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                      Send code
                    </button>
                  </form>
                </>
              )}

              {step === "otp" && (
                <>
                  <div className="mb-1 eyebrow">Verify</div>
                  <h3 className="font-display mt-2 text-2xl font-semibold text-charcoal-900">Enter the code</h3>
                  <p className="mt-2 text-sm text-concrete-600">
                    We sent a 6-digit code to <span className="font-medium text-charcoal-900">{email}</span>
                  </p>
                  <div className="mt-7 flex justify-between gap-2">
                    {code.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputsRef.current[i] = el; }}
                        value={d}
                        onChange={(e) => handleDigit(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        inputMode="numeric"
                        maxLength={1}
                        className="h-14 w-12 rounded-xl border border-concrete-200 bg-white text-center text-xl font-semibold text-charcoal-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                      />
                    ))}
                  </div>
                  {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                  <button
                    onClick={() => handleVerify()}
                    disabled={busy}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-charcoal-900 py-3.5 text-sm font-semibold text-warmwhite transition hover:bg-charcoal-800 disabled:opacity-60"
                  >
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    Verify &amp; continue
                  </button>
                  <button
                    onClick={() => setStep("email")}
                    className="mt-4 w-full text-center text-sm text-concrete-500 transition hover:text-charcoal-900"
                  >
                    Use a different email
                  </button>
                </>
              )}

              {step === "success" && (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100">
                    <ShieldCheck className="h-7 w-7 text-gold-600" />
                  </div>
                  <h3 className="font-display mt-5 text-xl font-semibold text-charcoal-900">You&apos;re in</h3>
                  <p className="mt-1 text-sm text-concrete-600">Signed in successfully.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
