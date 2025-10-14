import { supabase } from "@/lib/supabase";

export function getVideoPublicUrl(filePath: string) {
  const { data } = supabase.storage.from("fish-videos").getPublicUrl(filePath);
  return data.publicUrl;
}


