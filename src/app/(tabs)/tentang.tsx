import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typeScale, spacing } from "../../constants/styles";

export default function TabTentang() {
  return (
    <SafeAreaView style={{ flex: 1, padding: spacing.sedang, gap: spacing.kecil }}>
      {/* 1. Aksesibilitas & Hierarki Visual (typeScale.judul) */}
      <Text 
        style={{ fontSize: typeScale.judul, fontWeight: "bold" }}
        accessibilityLabel="Judul Halaman Tentang Aplikasi Jelajah Aman"
      >
        Jelajah Aman
      </Text>

      {/* 2. Hierarki Visual (typeScale.subjudul, typeScale.isi, typeScale.keterangan) */}
      <Text style={{ fontSize: typeScale.subjudul }}>Versi 1.0.0</Text>
      <Text style={{ fontSize: typeScale.isi }}>Dibuat oleh: Surya</Text>
      <Text style={{ fontSize: typeScale.keterangan, color: "#666" }}>
        Aplikasi pemantau cuaca dan navigasi lingkungan.
      </Text>
    </SafeAreaView>
  );
}