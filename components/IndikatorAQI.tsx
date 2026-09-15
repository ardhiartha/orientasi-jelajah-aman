import { View, Text } from "react-native";
import { LaporanUdara } from "../types/cuaca";

export default function IndikatorAQI({ kota, indeksAQI, tingkat, diperbaruiPada }: LaporanUdara) {
  // Fungsi penentu warna biar rapi
  const getWarna = (status: string) => {
    switch (status) {
      case "BAIK": return "green";
      case "SEDANG": return "#eab308"; // kuning/orange
      case "TIDAK_SEHAT": return "orange";
      case "BERBAHAYA": return "red";
      default: return "black";
    }
  };

  return (
    <View style={{ padding: 16, backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: getWarna(tingkat), marginTop: 10 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>{kota}</Text>
      <Text>Indeks AQI: {indeksAQI}</Text>
      <Text style={{ color: getWarna(tingkat), fontWeight: "bold", marginTop: 4 }}>
        Status: {tingkat}
      </Text>
      {/* Render kondisional: cuma muncul kalo diperbaruiPada ada isinya */}
      {diperbaruiPada && (
        <Text style={{ fontSize: 12, color: "gray", marginTop: 8 }}>
          Update: {diperbaruiPada}
        </Text>
      )}
    </View>
  );
}