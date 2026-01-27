import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const MENU_ITEMS = [
  { id: "1", label: "Edit Profile", icon: "person-outline" },
  { id: "2", label: "Payment Option", icon: "card-outline" },
  { id: "3", label: "Terms & Conditions", icon: "document-text-outline" },
  { id: "4", label: "Help Center", icon: "headset-outline" },
  { id: "5", label: "Invite Friends", icon: "share-social-outline" },
  { id: "6", label: "Logout", icon: "log-out-outline" },
];

const ProfileScreen = () => {
  return (
    <ThemedView lightColor="#fff" darkColor="#000" style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: "https://i.pravatar.cc/300" }}
          style={styles.avatar}
        />
      </View>

      {/* Card */}
      <View style={styles.card}>
        <FlatList
          data={MENU_ITEMS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <Icon
                  // @ts-ignore
                  name={item.icon}
                  size={width * 0.06}
                  color="#0A3D91"
                />
                <Text style={styles.label}>{item.label}</Text>
              </View>

              <Icon
                name="chevron-forward"
                size={width * 0.06}
                color="#0A3D91"
              />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      </View>
    </ThemedView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  avatarWrapper: {
    marginTop: width * 0.08,
    zIndex: 10,
  },

  avatar: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: (width * 0.28) / 2,
    borderWidth: 3,
    borderColor: "#fff",
  },

  card: {
    width: "90%",
    backgroundColor: "#EEF2F8",
    borderRadius: 20,
    paddingTop: width * 0.14,
    paddingBottom: width * 0.04,
    marginTop: -width * 0.14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: width * 0.045,
    paddingHorizontal: width * 0.05,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    fontSize: width * 0.045,
    marginLeft: width * 0.04,
    color: "#111",
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#D6DEEB",
    marginHorizontal: width * 0.05,
  },
});
