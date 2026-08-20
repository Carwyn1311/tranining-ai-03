import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://yqwsxpsrrqoiblxheqrs.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_tI_qBApqG-v7_SDu8LpZIw_we7WUGPh";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
