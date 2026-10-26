import AsyncStorage from "@react-native-async-storage/async-storage";
import { HasilGeocoding } from "../types/geocoding";

const KUNCI_PENYIMPANAN = "@jelajah_aman:riwayat_pencarian";
const BATAS_RIWAYAT = 10;

export async function ambilRiwayat(): Promise<HasilGeocoding[]> {
  const json = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);

  if (!json) return [];

  try {
    const data: HasilGeocoding[] = JSON.parse(json);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function tambahRiwayat(kota: HasilGeocoding): Promise<void> {
  // Lokasi perangkat saat ini bukan hasil pencarian kota.
  if (kota.id === -1) return;

  const daftar = await ambilRiwayat();

  // Hapus entri kota yang sama agar tidak ada duplikat.
  const daftarTanpaDuplikat = daftar.filter((item) => item.id !== kota.id);

  // Kota terbaru diletakkan di urutan paling atas.
  const daftarBaru = [kota, ...daftarTanpaDuplikat].slice(0, BATAS_RIWAYAT);

  await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
}

export async function hapusRiwayat(id: number): Promise<void> {
  const daftar = await ambilRiwayat();
  const daftarBaru = daftar.filter((kota) => kota.id !== id);

  await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
}

export async function bersihkanRiwayat(): Promise<void> {
  await AsyncStorage.removeItem(KUNCI_PENYIMPANAN);
}
