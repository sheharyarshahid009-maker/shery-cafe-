"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Plus, Send, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/store/cart";

interface ChatAction {
  type: "add_to_cart" | "link";
  menuItemId?: string;
  title?: string;
  priceCents?: number;
  imageUrl?: string | null;
  isAgeRestricted?: boolean;
  href?: string;
  label?: string;
}

interface Msg {
  role: "user" | "bot";
  text: string;
  actions?: ChatAction[];
  suggestions?: string[];
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi! I am the Shery Cafe assistant. Ask me for recommendations, prices, timings or help booking a table.",
      suggestions: ["Recommend something spicy", "Gaming rates?", "Book a table"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean || loading) return;
    setMsgs((m) => [...m, { role: "user", text: clean }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean }),
      });
      const data = await res.json();
      setMsgs((m) => [
        ...m,
        {
          role: "bot",
          text: data.reply ?? "Sorry, I could not understand that.",
          actions: data.actions ?? [],
          suggestions: data.suggestions ?? [],
        },
      ]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "bot", text: "Something went wrong — please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (a: ChatAction) => {
    if (a.type === "add_to_cart" && a.menuItemId && a.title) {
      addItem(
        {
          menuItemId: a.menuItemId,
          title: a.title,
          imageUrl: a.imageUrl ?? null,
          unitPriceCents: a.priceCents ?? 0,
          customizations: [],
          isAgeRestricted: a.isAgeRestricted ?? false,
        },
        1
      );
      setMsgs((m) => [
        ...m,
        { role: "bot", text: `${a.title} added to your cart.` },
      ]);
      document.dispatchEvent(new CustomEvent("shery:open-cart"));
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-ink-950 shadow-glow transition hover:brightness-110"
        aria-label="Chat with Shery assistant"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            className="fixed bottom-24 right-5 z-50 flex h-[480px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-card"
          >
            <div className="flex items-center gap-2 border-b border-white/10 bg-ink-800/80 px-4 py-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-500/20 text-gold-400">
                <Bot className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-zinc-50">Shery Assistant</p>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div key={i}>
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm ${
                      m.role === "user"
                        ? "ml-auto bg-gold-500 text-ink-950"
                        : "bg-white/5 text-zinc-200"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.actions.map((a, j) =>
                        a.type === "add_to_cart" ? (
                          <button
                            key={j}
                            onClick={() => handleAction(a)}
                            className="flex items-center gap-1 rounded-lg bg-gold-500/15 px-2.5 py-1.5 text-xs font-semibold text-gold-400 hover:bg-gold-500 hover:text-ink-950"
                          >
                            <Plus className="h-3.5 w-3.5" /> {a.title}
                          </button>
                        ) : (
                          <Link
                            key={j}
                            href={a.href ?? "/"}
                            className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/20"
                          >
                            {a.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-400 hover:border-gold-500/50 hover:text-gold-400"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 border-t border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about menu, prices..."
                className="input-dark"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500 text-ink-950 transition hover:brightness-110 disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
