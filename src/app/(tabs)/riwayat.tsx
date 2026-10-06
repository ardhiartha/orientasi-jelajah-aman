import { useState, useCallback } from "react";
import { View, Text, Button, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { KotaFavorit } from "../../types/favorit";

export default function TabRiwayat() {
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);

  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
    }, [])
  );

  // 1. Tambahkan Alert konfirmasi sebelum menghapus
  async function hapus(kota: KotaFavorit) {
    Alert.alert(
      "Konfirmasi Hapus",
      `Yakin hapus ${kota.nama}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await hapusFavorit(kota.id);
            setDaftarFavorit((prev) => prev.filter((k) => k.id !== kota.id));
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Kota Favorit</Text>

      {/* 2. Tampilkan jumlah favorit */}
      <Text style={{ color: "#666" }}>Tersimpan {daftarFavorit.length} kota</Text>

      {daftarFavorit.length === 0 && <Text>Belum ada kota favorit</Text>}
      {daftarFavorit.map((kota) => (
        <View
          key={kota.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <Text style={{ fontSize: 16 }}>{kota.nama}</Text>
          <Button title="Hapus" onPress={() => hapus(kota)} color="red" />
        </View>
      ))}
    </SafeAreaView>
  );
}