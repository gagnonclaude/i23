"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Level = "discret" | "accompagnement" | "intensif";
type Message = { role: "user" | "assistant"; content: string };

export function IACoach() {
  const t = useTranslations("ia");
  const [level, setLevel] = useState<Level>("accompagnement");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthenticated(!!user);
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ia/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          level,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: t("error") }]);
    }

    setLoading(false);
  };

  if (!authenticated) {
    return (
      <div className="py-20 text-center">
        <p className="text-i23-gris-fonce/70">{t("loginRequired")}</p>
        <Button className="mt-4" onClick={() => (window.location.href = "/auth/login")}>
          {t("login")}
        </Button>
      </div>
    );
  }

  const levels: { key: Level; label: string; desc: string }[] = [
    { key: "discret", label: t("levels.discret"), desc: t("levels.discretDesc") },
    { key: "accompagnement", label: t("levels.accompagnement"), desc: t("levels.accompagnementDesc") },
    { key: "intensif", label: t("levels.intensif"), desc: t("levels.intensifDesc") },
  ];

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-i23-gris-fonce mb-2">{t("title")}</h1>
          <p className="text-sm text-i23-gris-fonce/70">{t("description")}</p>
        </div>

        <div className="flex gap-2 mb-6 justify-center">
          {levels.map(({ key, label, desc }) => (
            <button
              key={key}
              onClick={() => setLevel(key)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                level === key
                  ? "bg-i23-turquoise text-white"
                  : "bg-i23-gris-pale/50 text-i23-gris-fonce/70 hover:bg-i23-gris-pale"
              }`}
              title={desc}
            >
              {label}
            </button>
          ))}
        </div>

        <Card padding="md" className="mb-4">
          <div className="h-96 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 && (
              <div className="text-center text-sm text-i23-gris-fonce/50 pt-32">
                <p>{t("welcome")}</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-i23-turquoise text-white rounded-br-md"
                      : "bg-i23-gris-pale/50 text-i23-gris-fonce rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-i23-gris-pale/50 px-4 py-2.5 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-i23-gris-fonce/30 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-i23-gris-fonce/30 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-2 h-2 bg-i23-gris-fonce/30 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise disabled:opacity-50"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {t("send")}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
