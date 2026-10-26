import { View, Text, Button, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { tambahFavorit } from "../services/favoritStorage";
import { useTema } from "../contexts/TemaContext";

export default function ModalTambahFavorit() {
  const { id, nama, lat, lon } = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();

  const { temaGelap } = useTema();

  const warna = {
    latar: temaGelap ? "#0F172A" : "#FFFFFF",
    teks: temaGelap ? "#F8FAFC" : "#0F172A",
  };

  async function simpan() {
    try {
      await tambahFavorit({
        id: Number(id),
        nama: nama ?? "",
        latitude: Number(lat),
        longitude: Number(lon),
      });

      router.back();
    } catch (error) {
      console.error("Gagal menyimpan favorit:", error);
      Alert.alert("Gagal", "Kota favorit tidak berhasil disimpan.");
    }
  }

  return (
    <View
      style={{
        padding: 16,
        gap: 16,
        flex: 1,
        justifyContent: "center",
        backgroundColor: warna.latar,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          color: warna.teks,
        }}
      >
        Tambahkan{" "}
        <Text style={{ fontWeight: "bold", color: warna.teks }}>
          {nama}
        </Text>{" "}
        ke daftar favorit?
      </Text>

      <Button title="Simpan" onPress={simpan} />
    </View>
  );
}