// src/app/(tabs)/index.tsx
import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import { HasilGeocoding } from "../../types/geocoding";

export default function HalamanUtama() {
  const [teksCari, setTeksCari] = useState("");
  const [hasil, setHasil] = useState<HasilGeocoding[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);

  // Latihan Mandiri #2: Ubah delay debounce menjadi 800ms
  const teksTertunda = useDebounce(teksCari, 800);

  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasil([]);
      setPesanError(null);
      return;
    }

    ambilData(teksTertunda);
  }, [teksTertunda]);

  async function ambilData(nama: string) {
    setSedangMemuat(true);
    setPesanError(null);

    try {
      const data = await cariKota(nama);
      setHasil(data);
    } catch (err) {
      setPesanError("Gagal mengambil data. Periksa koneksi internet Anda.");
    } finally {
      setSedangMemuat(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 16 }}>
      <SearchBox onCari={setTeksCari} />

      {sedangMemuat && <ActivityIndicator />}

      {/* Latihan Mandiri #3: Accessibility Label pada Pesan Error */}
      {pesanError && (
        <View accessibilityLabel="Pesan kesalahan jaringan atau data">
          <Text>{pesanError}</Text>
          <Button title="Coba Lagi" onPress={() => ambilData(teksTertunda)} />
        </View>
      )}

      {/* Latihan Mandiri #3: Accessibility Label pada Pesan Kosong */}
      {!sedangMemuat && !pesanError && teksTertunda.length > 0 && hasil.length === 0 && (
        <Text accessibilityLabel="Hasil pencarian tidak ditemukan">
          Kota tidak ditemukan
        </Text>
      )}

      {/* Latihan Mandiri #1: Indikator Jumlah Hasil */}
      {!sedangMemuat && !pesanError && hasil.length > 0 && (
        <Text style={{ fontWeight: "bold" }}>
          Ditemukan {hasil.length} kota
        </Text>
      )}

      {!sedangMemuat &&
        !pesanError &&
        hasil.map((kota) => (
          <WeatherCard key={kota.id} kota={kota.name} suhu={29} tingkatAQI="BAIK" />
        ))}
    </SafeAreaView>
  );
}