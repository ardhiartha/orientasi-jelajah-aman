import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTema } from "../../contexts/TemaContext";

import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { ambilRiwayat, hapusRiwayat } from "../../services/riwayatStorage";
import { KotaFavorit } from "../../types/favorit";
import { HasilGeocoding } from "../../types/geocoding";

export default function TabRiwayat() {
  const { temaGelap } = useTema();

  const warna = {
    latar: temaGelap ? "#0F172A" : "#FFFFFF",
    teks: temaGelap ? "#F8FAFC" : "#0F172A",
    sekunder: temaGelap ? "#CBD5E1" : "#666666",
    garis: temaGelap ? "#475569" : "#CCCCCC",
    aksen: "#2563EB",
  };

  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [daftarRiwayat, setDaftarRiwayat] = useState<HasilGeocoding[]>([]);

  const muatData = useCallback(async () => {
    const [favorit, riwayat] = await Promise.all([
      ambilSemuaFavorit(),
      ambilRiwayat(),
    ]);

    setDaftarFavorit(favorit);
    setDaftarRiwayat(riwayat);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void muatData();
    }, [muatData]),
  );

  function konfirmasiHapusRiwayat(kota: HasilGeocoding) {
    Alert.alert("Hapus Riwayat", `Hapus pencarian ${kota.name} dari riwayat?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await hapusRiwayat(kota.id);
            await muatData();
          } catch (error) {
            console.error("Gagal menghapus riwayat:", error);
            Alert.alert("Gagal", "Riwayat tidak berhasil dihapus.");
          }
        },
      },
    ]);
  }

  function konfirmasiHapusFavorit(kota: KotaFavorit) {
    Alert.alert("Konfirmasi Hapus", `Yakin hapus ${kota.nama} dari favorit?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await hapusFavorit(kota.id);
            await muatData();
          } catch (error) {
            console.error("Gagal menghapus favorit:", error);
            Alert.alert("Gagal", "Kota favorit tidak berhasil dihapus.");
          }
        },
      },
    ]);
  }

  function cariLagi(kota: HasilGeocoding) {
    router.push({
      pathname: "/(tabs)",
      params: {
        riwayatNonce: String(Date.now()),
        kotaId: String(kota.id),
        kotaNama: kota.name,
        kotaLat: String(kota.latitude),
        kotaLon: String(kota.longitude),
        kotaNegara: kota.country,
      },
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.latar }}>
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: warna.teks,
          }}
        >
          Riwayat Pencarian
        </Text>

        <Text style={{ color: warna.sekunder }}>
          {daftarRiwayat.length}/10 pencarian tersimpan
        </Text>

        {daftarRiwayat.length === 0 && (
          <Text style={{ color: warna.teks }}>
            Belum ada riwayat pencarian.
          </Text>
        )}

        {daftarRiwayat.map((kota) => (
          <View
            key={kota.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: warna.garis,
            }}
          >
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 4 }}
              onPress={() => cariLagi(kota)}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: warna.teks,
                }}
              >
                {kota.name}
              </Text>

              <Text style={{ fontSize: 12, color: warna.sekunder }}>
                {kota.admin1 ? `${kota.admin1}, ${kota.country}` : kota.country}
              </Text>

              <Text style={{ fontSize: 12, color: warna.aksen }}>
                Ketuk untuk cari lagi
              </Text>
            </TouchableOpacity>

            <Button
              title="Hapus"
              color="#DC2626"
              onPress={() => konfirmasiHapusRiwayat(kota)}
            />
          </View>
        ))}

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: warna.garis,
            marginTop: 12,
            paddingTop: 16,
            gap: 12,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: warna.teks,
            }}
          >
            Kota Favorit
          </Text>

          <Text style={{ color: warna.sekunder }}>
            Tersimpan {daftarFavorit.length} kota
          </Text>

          {daftarFavorit.length === 0 && (
            <Text style={{ color: warna.teks }}>Belum ada kota favorit.</Text>
          )}

          {daftarFavorit.map((kota) => (
            <View
              key={kota.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: warna.garis,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  flex: 1,
                  color: warna.teks,
                }}
              >
                {kota.nama}
              </Text>

              <Button
                title="Hapus"
                color="#DC2626"
                onPress={() => konfirmasiHapusFavorit(kota)}
              />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
