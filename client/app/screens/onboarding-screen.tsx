import OnboardingSwiper from "@/components/onboarding/onboarding-swiper";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constant/Colors";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";

import { createUserProfileTable } from "@/helpers/db";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Welcome to Cybex IT Group\nwhere learning meets innovation!",
    subtitle:
      "Empowering your journey through\ncutting-edge IT education and expertise",
    image: require("@/assets/images/Isolation_Mode.png"),
  },
  {
    id: "2",
    title: "Learn Industry-Ready Skills",
    subtitle:
      "Hands-on training designed to prepare\nyou for real-world tech jobs",
    image: require("@/assets/images/Layer_1.png"),
  },
  {
    id: "3",
    title: "Build, Grow & Succeed",
    subtitle: "Join a community that supports\nyour career growth",
    image: require("@/assets/images/Isolation_Mode_1.png"),
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const navigation = useNavigation<NavigationProp<any>>();

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  /**
   * useFocusEffect hook to create the contact and chat tables
   * when the HomeScreen is focused.
   */
  useFocusEffect(
    useCallback(() => {
      // Create the contact table if it doesn't exist
      const onCreateContactTable = async () => {
        await createUserProfileTable();
      };

      onCreateContactTable();
    }, []),
  );

  return (
    <ThemedView
      style={styles.container}
      darkColor={Colors.dark.background}
      lightColor={Colors.light.background}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          renderItem={({ item }) => (
            <OnboardingSwiper
              image={item.image}
              title={item.title}
              subtitle={item.subtitle}
              currentIndex={currentIndex}
            />
          )}
        />

        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (currentIndex === slides.length - 1) {
              navigation.navigate("SignInScreen");
            } else {
              flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
              });
            }
          }}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "GET STARTED" : "CONTINUE"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate("SignInScreen")}
        >
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.06,
  },

  skipBtn: {
    alignSelf: "center",
    marginBottom: height * 0.05,
  },
  skipText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "600",
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: height * 0.04,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D5DD",
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: "#0A3D91",
    width: 10,
    height: 10,
  },

  button: {
    backgroundColor: "#0A3D91",
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
