"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const TARGET_DATE = new Date("2026-06-02T13:22:00-04:00");

function calcTimeLeft() {
  const diff = TARGET_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function ComingSoon() {
  const t = useTranslations("coming_soon");
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft());
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/attente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale: "fr" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-auto flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <img src="/logo.png" alt="i23" className="h-[52px] mx-auto mb-8" />

        <h1 className="text-3xl md:text-4xl font-bold text-i23-gris-fonce mb-4">
          {t("title")}
        </h1>
        <p className="text-i23-gris-fonce/70 mb-2 leading-relaxed">
          {t("description")}
        </p>
        <p className="text-sm text-i23-turquoise font-semibold mb-10">
          {t("optimisation")}
        </p>

        <div className="flex justify-center gap-3 md:gap-5 mb-12">
          {[
            { value: timeLeft.days, label: t("days") },
            { value: timeLeft.hours, label: t("hours") },
            { value: timeLeft.minutes, label: t("minutes") },
            { value: timeLeft.seconds, label: t("seconds") },
          ].map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
              <div className="w-16 md:w-20 h-16 md:h-20 rounded-xl bg-i23-gris-fonce text-white flex items-center justify-center text-2xl md:text-3xl font-bold">
                {pad(unit.value)}
              </div>
              <span className="text-xs text-i23-gris-fonce/60 mt-2 uppercase tracking-wide">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-i23-gris-pale/30 rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-semibold text-i23-gris-fonce mb-2">
            {t("notify_title")}
          </h2>
          <p className="text-sm text-i23-gris-fonce/70 mb-5">
            {t("notify_description")}
          </p>

          {status === "success" ? (
            <div className="bg-i23-turquoise/10 border border-i23-turquoise/30 rounded-lg px-4 py-3">
              <p className="text-sm text-i23-turquoise font-medium">{t("success")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email_placeholder")}
                  required
                />
              </div>
              <Button type="submit" loading={status === "loading"} size="md">
                {t("notify_button")}
              </Button>
            </form>
          )}
          {status === "error" && (
            <p className="text-xs text-red-500 mt-2">{t("error")}</p>
          )}
        </div>

        <p className="text-xs text-i23-gris-fonce/40 mt-8">
          i23.ca &middot; {t("method_line")}
        </p>
      </div>
    </div>
  );
}
