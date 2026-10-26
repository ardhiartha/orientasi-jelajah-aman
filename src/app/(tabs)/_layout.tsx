import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTema } from "../../contexts/TemaContext";

export default function TabLayout() {
  const { temaGelap } = useTema();

  const warna = {
    latar: temaGelap ? "#0F172A" : "#FFFFFF",
    teks: temaGelap ? "#F8FAFC" : "#0F172A",
    aktif: "#2563EB",
    nonaktif: temaGelap ? "#94A3B8" : "#94A3B8",
    garis: temaGelap ? "#334155" : "#E2E8F0",
  };
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: warna.latar,
        },
        headerTintColor: warna.teks,
        headerShadowVisible: false,
        headerTitleStyle: {
          color: warna.teks,
        },
        tabBarActiveTintColor: warna.aktif,
        tabBarInactiveTintColor: warna.nonaktif,
        tabBarStyle: {
          backgroundColor: warna.latar,
          borderTopColor: warna.garis,
          paddingTop: 6,
          paddingBottom: 5,
          height: 62,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarLabel: "Beranda",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Riwayat",
          tabBarLabel: "Riwayat",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="pengaturan"
        options={{
          title: "Pengaturan",
          tabBarLabel: "Pengaturan",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="tentang"
        options={{
          title: "Tentang",
          tabBarLabel: "Tentang",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
