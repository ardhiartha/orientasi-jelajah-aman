import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTema } from "../../contexts/TemaContext";

import AtribusiCuaca from "../../components/AtribusiCuaca";
import SearchBox from "../../components/SearchBox";
import StatusData from "../../components/StatusData";
import WeatherCard from "../../components/WeatherCard";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { useDebounce } from "../../hooks/use-debounce";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
  hapusCacheKota,
} from "../../services/cacheRepository";
import {
  ambilCuacaOfflineFirst,
  BATAS_CACHE_MS,
} from "../../services/cuacaRepository";
import { cariKota } from "../../services/geocodingService";
import {
  ambilKoordinatSaatIni,
  mintaIzinLokasi,
} from "../../services/locationService";
import { tambahRiwayat } from "../../services/riwayatStorage";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { HasilCuacaOffline, RingkasanKotaTersimpan } from "../../types/cache";
import { HasilGeocoding } from "../../types/geocoding";

export default function HalamanUtama() {
  const { temaGelap } = useTema();

  const warna = {
    latar: temaGelap ? "#0F172A" : "#FFFFFF",
    teks: temaGelap ? "#F8FAFC" : "#0F172A",
    sekunder: temaGelap ? "#CBD5E1" : "#666666",
    kartu: temaGelap ? "#1E293B" : "#F1F5F9",
  };
  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>(
    [],
  );
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);

  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0);
  const params = useLocalSearchParams<{
    riwayatNonce?: string;
    kotaId?: string;
    kotaNama?: string;
    kotaLat?: string;
    kotaLon?: string;
    kotaNegara?: string;
  }>();

  async function konfirmasiHapusCache(kunci: string, nama: string) {
    const hapus = async () => {
      try {
        await hapusCacheKota(kunci);
        await muatKotaTersimpan();
      } catch (error) {
        console.error("Gagal menghapus cache kota:", error);
        Alert.alert("Gagal", "Cache kota tidak berhasil dihapus.");
      }
    };

    if (Platform.OS === "web") {
      if (confirm(`Hapus cache cuaca untuk ${nama}?`)) {
        await hapus();
      }
      return;
    }

    Alert.alert(
      "Hapus Cache",
      `Hapus cache cuaca untuk ${nama}? Riwayat pencarian dan favorit tidak ikut terhapus.`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            void hapus();
          },
        },
      ],
    );
  }

  async function muatKotaTersimpan() {
    setKotaTersimpan(await daftarKotaTersimpan());
  }

  // Hapus cache yang berumur lebih dari 7 hari saat aplikasi dibuka.
  useEffect(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, []);

  // Pencarian kota memerlukan koneksi internet.
  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasilPencarian([]);
      return;
    }

    cariKota(teksTertunda)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda]);
  useEffect(() => {
    if (
      !params.riwayatNonce ||
      !params.kotaId ||
      !params.kotaNama ||
      !params.kotaLat ||
      !params.kotaLon
    ) {
      return;
    }

    const id = Number(params.kotaId);
    const latitude = Number(params.kotaLat);
    const longitude = Number(params.kotaLon);

    if (
      !Number.isFinite(id) ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    pilihKota({
      id,
      name: params.kotaNama,
      latitude,
      longitude,
      country: params.kotaNegara ?? "",
    });
  }, [
    params.riwayatNonce,
    params.kotaId,
    params.kotaNama,
    params.kotaLat,
    params.kotaLon,
    params.kotaNegara,
  ]);

  async function pilihKota(kota: HasilGeocoding, paksaPerbarui = false) {
    setKotaTerpilih(kota);
    const idSaatIni = ++requestIdRef.current;

    setSedangMemuat(true);
    setPesanError(null);

    try {
      const data = await ambilCuacaOfflineFirst(
        {
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
        },
        { paksaPerbarui },
      );

      if (idSaatIni !== requestIdRef.current) return;

      setHasil(data);

      if (kota.id !== -1) {
        try {
          await tambahRiwayat(kota);
        } catch (error) {
          console.error("Gagal menyimpan riwayat pencarian:", error);
        }
      }

      muatKotaTersimpan();
    } catch {
      if (idSaatIni !== requestIdRef.current) return;

      setHasil(null);
      setPesanError(
        "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi.",
      );
    } finally {
      if (idSaatIni === requestIdRef.current) {
        setSedangMemuat(false);
      }
    }
  }

  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();

    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas.",
      );
      return;
    }

    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.",
      );
      return;
    }

    setPesanLokasi(null);

    const koordinat = await ambilKoordinatSaatIni();

    pilihKota({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.latar }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBox onCari={setTeksCari} />

        <Button
          title="Gunakan Lokasi Saat Ini"
          onPress={gunakanLokasiSaatIni}
        />

        {pesanLokasi && (
          <Text accessibilityLabel={pesanLokasi}>{pesanLokasi}</Text>
        )}

        {hasilPencarian.map((kota) => (
          <TouchableOpacity key={kota.id} onPress={() => pilihKota(kota)}>
            <Text style={{ color: warna.teks }}>{kota.name}</Text>
          </TouchableOpacity>
        ))}

        {kotaTersimpan.length > 0 && (
          <View style={{ gap: 6 }}>
            <Text style={{ fontWeight: "bold", color: warna.teks }}>
              Tersimpan di perangkat (bisa dibuka offline)
            </Text>

            {kotaTersimpan.map((k) => (
              <View
                key={k.kunci}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  paddingVertical: 6,
                }}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    pilihKota({
                      id: k.id,
                      name: k.nama,
                      latitude: k.latitude,
                      longitude: k.longitude,
                      country: "",
                    })
                  }
                >
                  <Text style={{ fontSize: 16, color: warna.teks }}>
                    {k.nama}
                  </Text>
                  <Text style={{ fontSize: 12, color: warna.sekunder }}>
                    Ketuk untuk memuat cuaca
                  </Text>
                </TouchableOpacity>

                <Button
                  title="Hapus Cache"
                  color="red"
                  onPress={() => konfirmasiHapusCache(k.kunci, k.nama)}
                />
              </View>
            ))}
          </View>
        )}

        {sedangMemuat && <ActivityIndicator />}

        {pesanError && (
          <View>
            <Text accessibilityLabel={pesanError}>{pesanError}</Text>
            <Button
              title="Coba Lagi"
              onPress={() => kotaTerpilih && pilihKota(kotaTerpilih, true)}
            />
          </View>
        )}

        {hasil && kotaTerpilih && !sedangMemuat && (
          <>
            <StatusData
              sumber={hasil.sumber}
              disimpanPada={hasil.disimpanPada}
            />

            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(hasil.kualitasUdara.indeksAQI)}
            />

            <Text style={{ fontSize: 12, color: warna.sekunder }}>
              Kondisi: {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)}
              {" • "}Angin {hasil.cuaca.saatIni.kecepatanAngin} km/j
            </Text>

            <Button
              title="Perbarui Sekarang"
              onPress={() => pilihKota(kotaTerpilih, true)}
            />

            <Button
              title="Tambahkan ke Favorit"
              onPress={() =>
                router.push({
                  pathname: "/tambah-favorit",
                  params: {
                    id: String(kotaTerpilih.id),
                    nama: kotaTerpilih.name,
                    lat: String(kotaTerpilih.latitude),
                    lon: String(kotaTerpilih.longitude),
                  },
                })
              }
            />
          </>
        )}

        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}
