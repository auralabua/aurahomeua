import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, ChevronLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TG_LINK = "https://t.me/BodyHome1";

const SESSION_KEY = "bh_chat_session";
const NAME_KEY    = "bh_chat_name";

type Screen  = "choice" | "intro" | "chat";
type Message = { id: string; sender: "customer" | "admin"; text: string; created_at: string };

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z" />
  </svg>
);

function isOnline() {
  const h = (new Date().getUTCHours() + 3) % 24;
  return h >= 9 && h < 21;
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
}

export const SupportWidget = () => {
  const [open,    setOpen]    = useState(false);
  const [screen,  setScreen]  = useState<Screen>("choice");
  const [unread,  setUnread]  = useState(false);

  const [sessionId,    setSessionId]    = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [messages,     setMessages]     = useState<Message[]>([]);
  const [isTyping,     setIsTyping]     = useState(false);

  const [name,  setName]  = useState("");
  const [input, setInput] = useState("");
  const [busy,  setBusy]  = useState(false);
  const [err,   setErr]   = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const online    = isOnline();

  // Restore session from localStorage
  useEffect(() => {
    const sid   = localStorage.getItem(SESSION_KEY);
    const sname = localStorage.getItem(NAME_KEY);
    if (sid && sname) {
      setSessionId(sid);
      setCustomerName(sname);
      setScreen("chat");
      loadMessages(sid);
    }
  }, []);

  // Realtime subscription
  useEffect(() => {
    if (!sessionId) return;
    const ch = supabase
      .channel(`chat-${sessionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages",
          filter: `session_id=eq.${sessionId}` },
        ({ new: msg }) => {
          const m = msg as Message;
          setMessages(prev => prev.some(p => p.id === m.id) ? prev : [...prev, m]);
          if (m.sender === "admin") {
            setIsTyping(false);
            if (!open) setUnread(true);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [sessionId, open]);

  // Auto-scroll
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, screen, isTyping]);

  const loadMessages = async (sid: string) => {
    const { data } = await (supabase as any)
      .from("chat_messages")
      .select("id, sender, text, created_at")
      .eq("session_id", sid)
      .order("created_at", { ascending: true });
    setMessages(data ?? []);
  };

  const handleOpen = () => {
    setOpen(true);
    setUnread(false);
    if (sessionId) setScreen("chat");
  };

  // ── Step 1: create session ──
  const startChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const { data: sess, error: dbErr } = await (supabase as any)
        .from("chat_sessions")
        .insert({ customer_name: name })
        .select("id")
        .single();
      if (dbErr) throw dbErr;

      localStorage.setItem(SESSION_KEY, sess.id);
      localStorage.setItem(NAME_KEY, name);
      setSessionId(sess.id);
      setCustomerName(name);
      setScreen("chat");
    } catch {
      setErr("Помилка. Спробуйте ще раз.");
    } finally {
      setBusy(false);
    }
  };

  // ── Step 2: send message → call AI ──
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || busy) return;
    const text = input.trim();
    setInput("");
    setBusy(true);
    setIsTyping(true);
    try {
      await (supabase as any)
        .from("chat_messages")
        .insert({ session_id: sessionId, sender: "customer", text });

      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
    } catch {
      setIsTyping(false);
    } finally {
      setBusy(false);
    }
  };

  const resetChat = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(NAME_KEY);
    setSessionId(null); setCustomerName(""); setMessages([]); setIsTyping(false);
    setName(""); setScreen("choice");
  };

  return (
    <>
      {/* ── Popup ─────────────────────────────────────────── */}
      {open && (
        <div className="fixed z-50 left-4 right-4 bottom-24 sm:left-auto sm:right-6 sm:w-80 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-border/30 overflow-hidden flex flex-col max-h-[520px]">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-white shrink-0">
              <div className="flex items-center gap-2">
                {(screen === "intro" || (screen === "chat" && customerName)) && (
                  <button onClick={() => setScreen("choice")} aria-label="Назад" className="rounded-full p-0.5 hover:bg-white/20 transition-colors mr-1">
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    {screen === "chat" ? "AI-асистент Міла" : "💬 Підтримка BodyHome"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-green-300" : "bg-gray-300"}`} />
                    <p className="text-[11px] opacity-80">
                      {screen === "chat" ? "AI · відповідає миттєво" : online ? "Онлайн · відповідь 3–5 хв" : "Не в мережі · відповімо вранці"}
                    </p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Закрити" className="rounded-full p-1 hover:bg-white/20 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── CHOICE screen ── */}
            {screen === "choice" && (
              <div className="p-4 space-y-3">
                <a
                  href={TG_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full rounded-xl bg-[#229ED9] px-4 py-3 text-white hover:bg-[#1a8bbf] transition-colors"
                >
                  <TelegramIcon />
                  <div>
                    <p className="text-sm font-semibold leading-tight">Написати в Telegram</p>
                    <p className="text-xs opacity-80">Відповідь протягом 3–5 хвилин</p>
                  </div>
                </a>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex-1 h-px bg-border" />
                  <span>або</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <button
                  onClick={() => sessionId ? setScreen("chat") : setScreen("intro")}
                  className="flex items-center gap-3 w-full rounded-xl border border-border px-4 py-3 text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold leading-tight">Чат з AI-асистентом</p>
                    <p className="text-xs text-muted-foreground">Відповідає миттєво</p>
                  </div>
                </button>

                <p className="text-center text-[11px] text-muted-foreground pt-1">Пн–Нд: 9:00 – 21:00</p>
              </div>
            )}

            {/* ── INTRO screen ── */}
            {screen === "intro" && (
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-3">Представтесь, щоб розпочати чат</p>
                <form onSubmit={startChat} className="space-y-2.5">
                  <input
                    required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Ваше ім'я"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                  {err && <p className="text-xs text-destructive">{err}</p>}
                  <button
                    type="submit" disabled={busy}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 transition-colors"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                    {busy ? "Починаємо…" : "Почати чат"}
                  </button>
                </form>
              </div>
            )}

            {/* ── CHAT screen ── */}
            {screen === "chat" && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[200px]">
                  {messages.length === 0 && !isTyping && (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                      <MessageCircle className="h-8 w-8 text-muted-foreground/30 mb-2" />
                      <p className="text-xs text-muted-foreground">Привіт, {customerName}! Задайте ваше питання — AI відповість миттєво</p>
                    </div>
                  )}
                  {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === "customer" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        m.sender === "customer"
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-secondary text-foreground rounded-bl-sm"
                      }`}>
                        <p className="leading-snug whitespace-pre-wrap">{m.text}</p>
                        <p className={`text-[10px] mt-1 ${m.sender === "customer" ? "text-white/60 text-right" : "text-muted-foreground"}`}>
                          {fmtTime(m.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3">
                        <div className="flex gap-1 items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t border-border/40 shrink-0">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Напишіть повідомлення…"
                    disabled={busy}
                    className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    aria-label="Надіслати повідомлення"
                    disabled={!input.trim() || busy}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-all"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </form>

                {/* Footer */}
                <div className="px-3 pb-2 flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">Пн–Нд: 9:00–21:00</p>
                  <button onClick={resetChat} className="text-[10px] text-muted-foreground hover:text-destructive transition-colors">
                    Новий чат
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* ── Floating button ──────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25 pointer-events-none" />
        )}
        {unread && !open && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white z-10 flex items-center justify-center">
            <span className="text-[9px] font-bold text-white">!</span>
          </span>
        )}
        <button
          onClick={open ? () => setOpen(false) : handleOpen}
          aria-label={open ? "Закрити підтримку" : "Відкрити підтримку"}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>
    </>
  );
};
