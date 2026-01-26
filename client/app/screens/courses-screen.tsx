import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constant/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.42;

const courses = [
  {
    id: "1",
    title: "Graphics Design",
    rating: "★★★★★",
    author: "By Emmanuel",
    image: require("@/assets/images/Isolation_Mode.png"),
  },
  {
    id: "2",
    title: "Wireframing",
    rating: "★★★★★",
    author: "By Tosin",
    image: require("@/assets/images/Layer_1.png"),
  },
  {
    id: "3",
    title: "Wireframing",
    rating: "★★★★★",
    author: "By Tosin",
    image: require("@/assets/images/Isolation_Mode_1.png"),
  },

  {
    id: "4",
    title: "Wireframing",
    rating: "★★★★★",
    author: "By Tosin",
    image: require("@/assets/images/Isolation_Mode.png"),
  },

  {
    id: "5",
    title: "Wireframing",
    rating: "★★★★★",
    author: "By Tosin",
    image: require("@/assets/images/Isolation_Mode.png"),
  },
];

const bottomCourses = [
  {
    id: "3",
    title: "Website Design",
    image: require("@/assets/images/Isolation_Mode.png"),
  },
  {
    id: "4",
    title: "Video Editing",
    image: require("@/assets/images/Isolation_Mode.png"),
  },
];

const CoursesScreen = () => {
  const theme = useColorScheme();

  const navigation = useNavigation<NavigationProp<any>>();

  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background",
  );

  const courseTitleColor = useThemeColor(
    { light: Colors.dark.generalBg, dark: "#fff" },
    "text",
  );

  const chipBackgroundColor = useThemeColor(
    { light: Colors.light.generalBg, dark: "#fff" },
    "background",
  );

  const chipTextColor = useThemeColor(
    { light: Colors.dark.text, dark: Colors.light.text },
    "text",
  );

  const RenderedCard = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        onPress={() => navigation.navigate("course-details")}
        style={[
          theme === "light" && {
            borderWidth: 1,
            borderColor: Colors.dark.generalBg,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,

            // Android shadow
            elevation: 4,
          },
          styles.card,
        ]}
      >
        <Image source={item.image} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.rating}>{item.rating}</Text>
        <Text style={styles.author}>{item.author}</Text>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <ThemedView
      darkColor="#000"
      lightColor="#fff"
      style={[styles.container, { backgroundColor }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Search */}
        <TextInput
          placeholder="Search Here"
          style={styles.search}
          placeholderTextColor="#999"
        />

        {/* Categories */}
        <View style={styles.chipsRow}>
          {[
            "UI/UX",
            "Graphics Design",
            "Figma",
            "Web Design",
            "Software Development",
            "Cloud",
            "Mobile Development",
          ].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, { backgroundColor: chipBackgroundColor }]}
            >
              <Text style={[styles.chipText, { color: chipTextColor }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Watching */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: courseTitleColor }]}>
            Continue Watching
          </Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <View style={styles.cardRow}>
          <FlatList
            data={courses}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16, gap: 12 }}
            renderItem={RenderedCard}
          />
        </View>

        {/* Bottom Courses */}
        <View style={styles.bottomGrid}>
          {bottomCourses.map((item) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("course-details")}
              key={item.id}
              style={[
                theme === "light" && {
                  borderWidth: 1,
                  borderColor: Colors.dark.generalBg,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,

                  // Android shadow
                  elevation: 4,
                },
                styles.largeCard,
              ]}
            >
              <Image source={item.image} style={styles.largeImage} />
              <Text style={styles.largeTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default CoursesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    fontSize: 14,
  },
  chipsRow: {
    flexDirection: "row",
    marginVertical: 16,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  chipText: {
    fontSize: 13,
    color: "#333",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAll: {
    fontSize: 13,
    color: "#777",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
  },
  cardImage: {
    width: "100%",
    height: 110,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  rating: {
    color: "#F5A623",
    fontSize: 12,
  },
  author: {
    fontSize: 11,
    color: "#666",
  },
  bottomGrid: {
    marginTop: 20,
  },
  largeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  largeImage: {
    width: "100%",
    height: width * 0.45,
  },
  largeTitle: {
    fontSize: 16,
    fontWeight: "600",
    padding: 12,
  },
});
