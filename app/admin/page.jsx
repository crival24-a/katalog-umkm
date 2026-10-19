import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createKlienSesiAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  const supabase = await createKlienSesiAdmin();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  let daftarProduk = [];
  let pesanError = null;

  try {
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      pesanError = `Gagal memuat produk dari database: ${error.message}`;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = `Gagal terhubung ke database: ${err.message}`;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {pesanError ? (
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
          <p className="font-semibold">Terjadi kesalahan</p>
          <p className="mt-1">{pesanError}</p>
        </div>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}


