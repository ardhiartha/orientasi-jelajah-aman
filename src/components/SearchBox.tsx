import { useState } from "react";
import { View, TextInput } from "react-native";
import { useTema } from "../contexts/TemaContext";

interface SearchBoxProps {
  onCari: (teks: string) => void;
}

export default function SearchBox({ onCari }: SearchBoxProps) {
  const [teks, setTeks] = useState("");
  const { temaGelap } = useTema();

  const warna = {
    latar: temaGelap ? "#1E293B" : "#FFFFFF",
    teks: temaGelap ? "#F8FAFC" : "#0F172A",
    placeholder: temaGelap ? "#CBD5E1" : "#64748B",
    garis: temaGelap ? "#64748B" : "#CBD5E1",
  };

  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru);
  }

  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={warna.placeholder}
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{
          borderWidth: 1,
          borderColor: warna.garis,
          backgroundColor: warna.latar,
          color: warna.teks,
          padding: 12,
          borderRadius: 8,
        }}
      />
    </View>
  );
}