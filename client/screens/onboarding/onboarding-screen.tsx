import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/Colors";
import {
  createCourseTable,
  createRegisteredCourseTable,
} from "@/helpers/db/course-db";
import { createUserProfileTable } from "@/helpers/db/user-db";
import { useScheduleNotification } from "@/hooks/use-schedule-notification";
import OnboardingSwiper from "@/screens/onboarding/onboarding-swiper";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const slides = [
  {
    id: "1",
    title: "Welcome to Learn Code,\nwhere learning meets innovation!",
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

  const { width, height } = useWindowDimensions();

  const { getDeviceNotificationStatus } = useScheduleNotification();

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
      (async () => {
        await createUserProfileTable();
        await createCourseTable();
        await createRegisteredCourseTable();
        await getDeviceNotificationStatus();
      })();
    }, []),
  );

  return (
    <ThemedView
      style={[styles.container, { paddingHorizontal: width * 0.06 }]}
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

        <View style={[styles.dotsContainer, { marginVertical: height * 0.04 }]}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { marginBottom: height * 0.04, paddingVertical: height * 0.02 },
          ]}
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
          style={[styles.skipBtn, { marginBottom: height * 0.05 }]}
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
  },

  skipBtn: {
    alignSelf: "center",
  },
  skipText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "600",
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.card,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: Colors.light.generalBg,
    width: 10,
    height: 10,
  },

  button: {
    backgroundColor: Colors.light.generalBg,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
