"use server";

import { redirect } from "next/navigation";
import { createKlienSesiAdmin } from "@/lib/supabase/server";

export async function login(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const email = form?.get("email");
  const password = form?.get("password");

  if (!email || !password) {
    return {
      error: "Email dan password wajib diisi.",
    };
  }

  const supabase = await createKlienSesiAdmin();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email).trim(),
    password: String(password),
  });

  if (error) {
    let pesanError = "Email atau password salah. Silakan periksa kembali.";
    if (error.message && error.message !== "Invalid login credentials") {
      pesanError = error.message;
    }
    return { error: pesanError };
  }

  redirect("/admin");
}

export async function keluar() {
  const supabase = await createKlienSesiAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const passwordBaru = form?.get("password_baru");
  const konfirmasiPassword = form?.get("konfirmasi_password");

  if (!passwordBaru || typeof passwordBaru !== "string" || passwordBaru.length < 8) {
    return {
      error: "Password baru minimal 8 karakter.",
    };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return {
      error: "Konfirmasi password harus sama dengan password baru.",
    };
  }

  const supabase = await createKlienSesiAdmin();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Kamu harus login terlebih dahulu untuk mengganti password.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return {
      error: `Gagal mengganti password: ${error.message}`,
    };
  }

  return {
    success: true,
    message: "Password berhasil diganti.",
  };
}


