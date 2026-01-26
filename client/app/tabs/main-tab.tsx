import { Colors } from "@/constant/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SceneMap, TabView } from "react-native-tab-view";
import AIScreen from "../screens/ai-screen";
import CoursesScreen from "../screens/courses-screen";
import MyCoursesScreen from "../screens/my-courses-screen";
import ProfileScreen from "../screens/profile-screen";

const MainTabs = () => {
  const [index, setIndex] = useState(0);

  const renderScene = SceneMap({
    courses: CoursesScreen,
    ai: AIScreen,
    "my-courses": MyCoursesScreen,
    profile: ProfileScreen,
  });

  const [routes] = useState([
    { key: "courses", title: "Courses", icon: "book-open-variant-outline" },
    { key: "ai", title: "AI", icon: "brain" },
    {
      key: "my-courses",
      title: "My Courses",
      icon: "bookmark-multiple-outline",
    },
    { key: "profile", title: "Profile", icon: "account-circle-outline" },
  ]);

  const safeAreaBackground = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background",
  );

  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background",
  );

  const tintColor = useThemeColor(
    { light: Colors.light.generalBg, dark: Colors.dark.generalBg },
    "text",
  );

  const titleColor = useThemeColor(
    { light: Colors.light.generalBg, dark: Colors.dark.text },
    "text",
  );

  const iconColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");

  const shadowStyle = {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
  };

  return (
    <SafeAreaView
      style={[{ backgroundColor: safeAreaBackground }, styles.container]}
      edges={["bottom", "left", "right"]}
    >
      <View style={{ flex: 1 }}>
        {/* Optional header */}
        <View style={[styles.header, { backgroundColor, ...shadowStyle }]}>
          <Text
            style={[
              routes[index].key === "courses"
                ? styles.mainTitle
                : styles.headerTitle,

              { color: titleColor },
            ]}
          >
            {routes[index].title}
          </Text>
        </View>

        {/* Swipeable content */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get("window").width }}
          swipeEnabled
          renderTabBar={() => null} // we use a custom tab bar
        />

        {/* Custom Bottom Tab Bar */}

        <View style={[styles.tabBar, { backgroundColor }]}>
          {routes.map((route, idx) => {
            const isFocused = index === idx;
            return (
              <Pressable
                key={route.key}
                style={styles.tabItem}
                onPress={() => setIndex(idx)}
              >
                <MaterialCommunityIcons
                  // @ts-ignore
                  name={
                    isFocused ? route.icon.replace("-outline", "") : route.icon
                  }
                  size={30}
                  color={isFocused ? tintColor : iconColor}
                  onPress={() => setIndex(idx)}
                />
                <Text
                  style={{
                    color: isFocused ? tintColor : iconColor,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {route.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MainTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  mainTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
});
