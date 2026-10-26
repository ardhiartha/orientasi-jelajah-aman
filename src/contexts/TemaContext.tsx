import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import {
  ambilPilihanTema,
  simpanPilihanTema,
  type PilihanTema,
} from "../services/temaStorage";

interface TemaContextType {
  pilihanTema: PilihanTema;
  temaGelap: boolean;
  ubahTema: (tema: PilihanTema) => Promise<void>;
}

const TemaContext = createContext<TemaContextType | undefined>(
  undefined
);

export function TemaProvider({ children }: { children: ReactNode }) {
  const skemaPerangkat = useColorScheme();
  const [pilihanTema, setPilihanTema] =
    useState<PilihanTema>("system");
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    let aktif = true;

    ambilPilihanTema()
      .then((tema) => {
        if (aktif) setPilihanTema(tema);
      })
      .catch((error) => {
        console.error("Gagal memuat pilihan tema:", error);
      })
      .finally(() => {
        if (aktif) setSiap(true);
      });

    return () => {
      aktif = false;
    };
  }, []);

  async function ubahTema(tema: PilihanTema) {
    await simpanPilihanTema(tema);
    setPilihanTema(tema);
  }

  const temaEfektif =
    pilihanTema === "system"
      ? skemaPerangkat
      : pilihanTema;

  const nilai: TemaContextType = {
    pilihanTema,
    temaGelap: temaEfektif === "dark",
    ubahTema,
  };

  if (!siap) {
    return null;
  }

  return (
    <TemaContext.Provider value={nilai}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const context = useContext(TemaContext);

  if (!context) {
    throw new Error("useTema harus digunakan di dalam TemaProvider");
  }

  return context;
}