import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import useGoogleAuth from "@/hooks/use-google-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { AuthContext } from "@/lib/context/auth-context";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const MENU_ITEMS = [
  {
    id: "1",
    label: "Edit Profile",
    icon: "person-outline",
    path: "profile-update",
  },
  {
    id: "2",
    label: "Payment Options",
    icon: "card-outline",
    path: "available-payment-options",
  },
  // {
  //   id: "3",
  //   label: "Terms & Conditions",
  //   icon: "document-text-outline",
  //   path: "terms-conditions",
  // },
  {
    id: "4",
    label: "Help Center",
    icon: "headset-outline",
    path: "help-center",
  },
  {
    id: "5",
    label: "Invite Friends",
    icon: "share-social-outline",
    path: "invite-friends",
  },
  { id: "6", label: "Logout", icon: "log-out-outline" },
];

const ProfileScreen = () => {
  const { logout, user } = useContext(AuthContext);

  const { revokeAccess } = useGoogleAuth();

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  const cardColor = useThemeColor(
    { light: "#F8F9FA", dark: "#1E1E1E" },
    "background",
  );

  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const borderColor = useThemeColor(
    { light: "#E0E0E0", dark: "#333333" },
    "background",
  );

  const { width, height } = useWindowDimensions();

  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <ThemedView
      style={[styles.container, { backgroundColor, marginTop: height * 0.01 }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ width: "100%" }}
      >
        {/* Avatar */}
        <View
          style={[
            styles.avatarWrapper,
            { marginTop: width * 0.08, marginBottom: width * 0.06 },
          ]}
        >
          <Image
            source={{
              uri: user?.profilePicture || "https://i.pravatar.cc/300",
            }}
            style={[
              styles.avatar,
              {
                width: width * 0.28,
                height: width * 0.28,
                borderRadius: (width * 0.28) / 2,
                borderColor: Colors.light.generalBg,
              },
            ]}
          />
        </View>

        {/* Menu Items */}
        <View
          style={[styles.methodsContainer, { paddingHorizontal: width * 0.06 }]}
        >
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.optionCard,
                {
                  backgroundColor: cardColor,
                  borderColor: borderColor,
                  paddingVertical: height * 0.025,
                  paddingHorizontal: width * 0.05,
                  marginBottom: height * 0.02,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => {
                if (item.label === "Logout") {
                  logout();
                  revokeAccess();
                } else {
                  navigation.navigate(item.path!);
                }
              }}
            >
              <View style={styles.rowLeft}>
                <Icon
                  // @ts-ignore
                  name={item.icon}
                  size={width * 0.07}
                  color={Colors.light.generalBg}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color: textColor,
                      fontSize: width * 0.045,
                      marginLeft: width * 0.04,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </View>

              <Icon
                name="chevron-forward"
                size={width * 0.06}
                color={borderColor}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 40,
  },

  avatarWrapper: {
    zIndex: 10,
  },

  avatar: {
    borderWidth: 4,
  },

  methodsContainer: {
    width: "100%",
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    borderWidth: 1,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    fontWeight: "500",
  },
});
