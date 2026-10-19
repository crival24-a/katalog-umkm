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

