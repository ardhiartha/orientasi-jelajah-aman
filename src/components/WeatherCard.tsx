// src/components/WeatherCard.tsx
import { View, Text } from "react-native";
import { WeatherCardProps, TingkatAQI } from "../types/cuaca";
import { typeScale, spacing } from "../constants/styles";
import { useTema } from "../contexts/TemaContext";

const warnaPerTingkat: Record<TingkatAQI, string> = {
  BAIK: "green",
  SEDANG: "goldenrod",
  TIDAK_SEHAT: "orange",
  BERBAHAYA: "crimson",
};

export default function WeatherCard({
  kota,
  suhu,
  tingkatAQI,
  indeksAQI,
}: WeatherCardProps) {
  const { temaGelap } = useTema();

  const warna = {
    kartu: temaGelap ? "#1E293B" : "#F4F7FA",
    teks: temaGelap ? "#F8FAFC" : "#0F172A",
  };
  const teksAQI =
    indeksAQI !== undefined
      ? `AQI: ${indeksAQI} (${tingkatAQI})`
      : `AQI: ${tingkatAQI}`;

  const labelAksesibilitas =
    indeksAQI !== undefined
      ? `Cuaca ${kota}, suhu ${suhu} derajat, indeks kualitas udara ${indeksAQI}, kategori ${tingkatAQI}`
      : `Cuaca ${kota}, suhu ${suhu} derajat, kualitas udara ${tingkatAQI}`;

  return (
    <View
      accessible
      accessibilityLabel={labelAksesibilitas}
      style={{
        padding: spacing.sedang,
        borderRadius: 8,
        backgroundColor: warna.kartu,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: typeScale.judul,
          color: warna.teks,
        }}
      >
        {kota}
      </Text>
      <Text style={{ fontSize: 32, color: warna.teks }}>
        {suhu}°C
      </Text>
      <Text style={{ color: warnaPerTingkat[tingkatAQI], fontSize: typeScale.isi }}>
        {teksAQI}
      </Text>
    </View>
  );
}