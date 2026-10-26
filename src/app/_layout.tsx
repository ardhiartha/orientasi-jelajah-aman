import { Stack } from "expo-router";
import { useTema, TemaProvider } from "../contexts/TemaContext";

function LayoutNavigasi() {
  const { temaGelap } = useTema();

  const warna = {
    latar: temaGelap ? "#0F172A" : "#FFFFFF",
    teks: temaGelap ? "#F8FAFC" : "#0F172A",
    garis: temaGelap ? "#334155" : "#E2E8F0",
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: warna.latar,
        },
        headerTintColor: warna.teks,
        headerTitleStyle: {
          color: warna.teks,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: warna.latar,
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="detail/[kota]"
        options={{ title: "Detail Cuaca" }}
      />

      <Stack.Screen
        name="tambah-favorit"
        options={{
          presentation: "modal",
          title: "Tambah Favorit",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <TemaProvider>
      <LayoutNavigasi />
    </TemaProvider>
  );
}