import { createClient } from "@supabase/supabase-js";
import { createServerClient as createSsrServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

/**
 * Koneksi Supabase sesi admin menggunakan kunci publik (SUPABASE_PUBLISHABLE_KEY)
 * dan cookie login via @supabase/ssr.
 * Digunakan untuk login, keluar, ganti password, dan aksi kelola produk.
 */
export async function createKlienSesiAdmin(
  url = process.env.SUPABASE_URL,
  key = process.env.SUPABASE_PUBLISHABLE_KEY
) {
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY harus diisi di environment variable."
    );
  }

  const cookieStore = await cookies();

  return createSsrServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Abaikan jika dipanggil dari Server Component
        }
      },
    },
  });
}

export const createServerClient = createKlienServer;
