import { useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTema } from "../../contexts/TemaContext";
import { hapusSemuaCache } from "../../services/cacheRepository";
import type { PilihanTema } from "../../services/temaStorage";

const pilihan: { label: string; nilai: PilihanTema; keterangan: string }[] = [
  {
    label: "Terang",
    nilai: "light",
    keterangan: "Tampilan dengan latar terang",
  },
  {
    label: "Gelap",
    nilai: "dark",
    keterangan: "Tampilan dengan latar gelap",
  },
  {
    label: "Sistem",
    nilai: "system",
    keterangan: "Mengikuti tema perangkat",
  },
];

export default function TabPengaturan() {
  const [pesan, setPesan] = useState<string | null>(null);
  const { pilihanTema, temaGelap, ubahTema } = useTema();

  const warna = {
    latar: temaGelap ? "#0F172A" : "#FFFFFF",
    kartu: temaGelap ? "#1E293B" : "#F1F5F9",
    teks: temaGelap ? "#F8FAFC" : "#0F172A",
    sekunder: temaGelap ? "#CBD5E1" : "#64748B",
    aksen: "#2563EB",
    garis: temaGelap ? "#475569" : "#CBD5E1",
  };

  async function hapusDataTersimpan() {
    try {
      await hapusSemuaCache();
      setPesan("Data cuaca tersimpan sudah dihapus.");
    } catch {
      setPesan("Gagal menghapus data cuaca tersimpan.");
    }
  }

  async function pilihTema(tema: PilihanTema) {
    try {
      await ubahTema(tema);
      setPesan(
        `Tema ${tema === "light" ? "Terang" : tema === "dark" ? "Gelap" : "Sistem"} berhasil dipilih.`,
      );
    } catch {
      setPesan("Gagal menyimpan pilihan tema.");
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
        backgroundColor: warna.latar,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", color: warna.teks }}>
        Pengaturan
      </Text>

      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 17, fontWeight: "600", color: warna.teks }}>
          Tampilan
        </Text>

        {pilihan.map((item) => {
          const aktif = pilihanTema === item.nilai;

          return (
            <Pressable
              key={item.nilai}
              onPress={() => void pilihTema(item.nilai)}
              style={{
                padding: 14,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: aktif ? warna.aksen : warna.garis,
                backgroundColor: aktif
                  ? temaGelap
                    ? "#1D3559"
                    : "#EFF6FF"
                  : warna.kartu,
              }}
            >
              <Text
                style={{
                  color: aktif ? warna.aksen : warna.teks,
                  fontWeight: "600",
                }}
              >
                {aktif ? "● " : "○ "}
                {item.label}
              </Text>

              <Text style={{ color: warna.sekunder, marginTop: 4 }}>
                {item.keterangan}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 17, fontWeight: "600", color: warna.teks }}>
          Data tersimpan
        </Text>

        <Button
          title="Hapus Data Cuaca Tersimpan"
          onPress={hapusDataTersimpan}
          color="#DC2626"
        />
      </View>

      {pesan && (
        <Text style={{ color: warna.teks }} accessibilityLabel={pesan}>
          {pesan}
        </Text>
      )}

      <Text style={{ color: warna.sekunder }}>Jelajah Aman · Versi 1.0.0</Text>
    </SafeAreaView>
  );
}
