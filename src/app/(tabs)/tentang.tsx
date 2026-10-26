import { useTema } from "../../contexts/TemaContext";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typeScale, spacing } from "../../constants/styles";


export default function TabTentang() {
  const { temaGelap } = useTema();

  const warna = {
    latar: temaGelap ? "#0F172A" : "#FFFFFF",
    teks: temaGelap ? "#F8FAFC" : "#0F172A",
    sekunder: temaGelap ? "#CBD5E1" : "#666666",
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: spacing.sedang,
        gap: spacing.kecil,
        backgroundColor: warna.latar,
      }}
    >
      <Text
        style={{
          fontSize: typeScale.judul,
          fontWeight: "bold",
          color: warna.teks,
        }}
        accessibilityLabel="Judul Halaman Tentang Aplikasi Jelajah Aman"
      >
        Jelajah Aman
      </Text>

      <Text
        style={{
          fontSize: typeScale.subjudul,
          color: warna.teks,
        }}
      >
        Versi 1.0.0
      </Text>

      <Text
        style={{
          fontSize: typeScale.isi,
          color: warna.teks,
        }}
      >
        Dibuat oleh: Surya
      </Text>

      <Text
        style={{
          fontSize: typeScale.keterangan,
          color: warna.sekunder,
        }}
      >
        Aplikasi pemantau cuaca dan navigasi lingkungan.
      </Text>
    </SafeAreaView>
  );
}
