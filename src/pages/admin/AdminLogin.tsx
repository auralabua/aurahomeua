import { useState, FormEvent, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAdminAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) navigate("/admin", { replace: true });
  }, [loading, session, isAdmin, navigate]);

  if (!loading && session && isAdmin) return <Navigate to="/admin" replace />;

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Вхід виконано" });
      } else {
        const redirectUrl = `${window.location.origin}/admin`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast({
          title: "Акаунт створено",
          description: "Перевірте пошту для підтвердження. Після підтвердження зверніться до власника сайту, щоб призначити роль адміністратора.",
        });
      }
    } catch (err: any) {
      toast({ title: "Помилка", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-secondary px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-card shadow-card border border-border/60">
        <div className="grid place-items-center mb-6">
          <div className="h-12 w-12 grid place-items-center rounded-full bg-primary text-primary-foreground">
            <Lock className="h-5 w-5" />
          </div>
        </div>
        <h1 className="text-2xl text-center mb-2">Aura Home — Адмін</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {mode === "signin" ? "Увійдіть до панелі керування" : "Створіть обліковий запис"}
        </p>
        <form onSubmit={handle} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl h-11"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl h-11"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full rounded-full btn-caramel border-0 h-11">
            {busy ? "..." : mode === "signin" ? "Увійти" : "Створити акаунт"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-5 w-full text-sm text-muted-foreground hover:text-primary transition-smooth"
        >
          {mode === "signin" ? "Немає акаунту? Зареєструватись" : "Вже маєте акаунт? Увійти"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
