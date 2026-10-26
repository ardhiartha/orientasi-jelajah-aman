import AsyncStorage from "@react-native-async-storage/async-storage";

export type PilihanTema = "light" | "dark" | "system";

const KUNCI_TEMA = "@jelajah_aman:pilihan_tema";

export async function ambilPilihanTema(): Promise<PilihanTema> {
  const tersimpan = await AsyncStorage.getItem(KUNCI_TEMA);

  if (tersimpan === "light" || tersimpan === "dark" || tersimpan === "system") {
    return tersimpan;
  }

  return "system";
}

export async function simpanPilihanTema(tema: PilihanTema): Promise<void> {
  await AsyncStorage.setItem(KUNCI_TEMA, tema);
}
