import { View, Text } from "react-native";
import { SumberData } from "../types/cache";
import { useTema } from "../contexts/TemaContext";

interface StatusDataProps {
  sumber: SumberData;
  disimpanPada: number;
}

function formatUmur(disimpanPada: number): string {
  const menit = Math.floor((Date.now() - disimpanPada) / 60000);

  if (menit < 1) return "baru saja";
  if (menit < 60) return menit + " menit lalu";

  const jam = Math.floor(menit / 60);
  if (jam < 24) return jam + " jam lalu";

  return Math.floor(jam / 24) + " hari lalu";
}

function labelSumber(sumber: SumberData): string {
  if (sumber === "jaringan") return "Data terbaru dari internet";
  if (sumber === "cache-segar") return "Data tersimpan (masih segar)";

  return "Mode offline - data tersimpan mungkin sudah usang";
}

export default function StatusData({
  sumber,
  disimpanPada,
}: StatusDataProps) {
  const { temaGelap } = useTema();

  const basi = sumber === "cache-basi";
  const label = labelSumber(sumber);
  const umur = formatUmur(disimpanPada);

  const warna = {
    latarSegar: temaGelap ? "#14352F" : "#EAFBF6",
    latarBasi: temaGelap ? "#422F1C" : "#FEF3E2",
    teksSegar: temaGelap ? "#86EFAC" : "#13795F",
    teksBasi: temaGelap ? "#FCD34D" : "#B45309",
    keterangan: temaGelap ? "#CBD5E1" : "#666666",
  };

  return (
    <View
      accessible
      accessibilityLabel={label + ", diperbarui " + umur}
      style={{
        padding: 8,
        borderRadius: 8,
        backgroundColor: basi ? warna.latarBasi : warna.latarSegar,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: basi ? warna.teksBasi : warna.teksSegar,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: warna.keterangan,
        }}
      >
        Diperbarui {umur}
      </Text>
    </View>
  );
}