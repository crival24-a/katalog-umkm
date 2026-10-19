import { createClient } from "@supabase/supabase-js";

/**
 * Koneksi Supabase di sisi server menggunakan kunci rahasia (SUPABASE_SECRET_KEY).
 * Digunakan untuk membaca data publik seperti katalog dan detail produk yang
 * melewati aturan RLS.
 */
export function createKlienServer(
  url = process.env.SUPABASE_URL,
  key = process.env.SUPABASE_SECRET_KEY
) {
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY harus diisi di environment variable."
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = createKlienServer;

