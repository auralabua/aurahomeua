import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/integrations/supabase/client";

// Start fetching data before React renders — reduces perceived loading time by ~300-600ms
void Promise.all([
  queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("position", { ascending: true })
        .limit(2000);
      if (error) throw error;
      return data;
    },
  }),
  queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return data;
    },
  }),
]);

createRoot(document.getElementById("root")!).render(<App />);
