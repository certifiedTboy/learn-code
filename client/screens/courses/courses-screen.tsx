import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/Colors";
import { getAllCourse, upsertCourse } from "@/helpers/db/course-db";
import { showNotification } from "@/helpers/notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useGetAllCoursesMutation } from "@/lib/apis/course-apis";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";

const CoursesScreen = () => {
  const theme = useColorScheme();

  const [availableCourses, setAvailableCourses] = useState<any[]>([]);

  const { width, height } = useWindowDimensions();
  const CARD_WIDTH = width * 0.42;

  const navigation = useNavigation<NavigationProp<any>>();

  const [refreshing, setRefreshing] = useState(false);

  const [getAllCoursesFromDb, { data, error }] = useGetAllCoursesMutation();

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  const cardBackgroundColor = useThemeColor(
    { light: Colors.light.courseCardBg, dark: Colors.dark.courseCardBg },
    "background",
  );

  const courseTitleColor = useThemeColor(
    { light: Colors.dark.generalBg, dark: Colors.dark.white },
    "text",
  );

  const chipBackgroundColor = useThemeColor(
    { light: Colors.light.courseCardBg, dark: Colors.dark.courseCardBg },
    "background",
  );

  const chipTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const searchInputBorderColor = useThemeColor(
    { light: Colors.light.courseCardBg, dark: Colors.dark.courseCardBg },
    "background",
  );
  const inputTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const cardColor = useThemeColor(
    { light: Colors.light.courseCardBg, dark: Colors.dark.courseCardBg },
    "background",
  );

  const authorTextColor = useThemeColor(
    { light: Colors.light.authorText, dark: Colors.dark.authorText },
    "text",
  );

  useEffect(() => {
    (async () => {
      const courses = await getAllCourse();

      if (!courses || courses?.length === 0) {
        getAllCoursesFromDb(null);
      } else {
        setAvailableCourses(courses);
      }
    })();
  }, []);

  useEffect(() => {
    if (data && data?.data) {
      setAvailableCourses(data?.data);
      showNotification({
        type: "success",
        title: "Courses Updated",
        message: "Courses Updated!",
      });
      (async () => {
        for (const course of data?.data) {
          await upsertCourse(course);
        }
      })();
    }
  }, [data]);

  const RenderedCard = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("course-details", {
            id: item?._id,
            name: item?.name,
          })
        }
        style={[
          {
            borderWidth: 1,
            borderColor: cardBackgroundColor,
            shadowColor: Colors.dark.generalBg,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,

            // Android shadow
            elevation: 4,
            backgroundColor: cardBackgroundColor,
          },

          styles.card,
          { width: CARD_WIDTH, backgroundColor: cardColor },
        ]}
      >
        <Image source={{ uri: item?.image }} style={styles.cardImage} />
        <Text style={[styles.cardTitle, { color: inputTextColor }]}>
          {item?.name}
        </Text>
        <Text style={styles.rating}>★★★★★</Text>
        <Text style={[styles.author, { color: authorTextColor }]}>
          Adebisi Tosin
        </Text>
      </TouchableOpacity>
    ),
    [cardBackgroundColor],
  );

  const onRefresh = () => {
    setRefreshing(true);
    getAllCoursesFromDb(null);
    setTimeout(() => setRefreshing(false), 2000); // simulate refresh
  };

  // make the search text input functional
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = availableCourses.filter((course) =>
    course?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor, marginTop: height * 0.01 }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search */}
        <TextInput
          placeholder="Search Course Here..."
          style={[
            styles.search,
            {
              borderColor: searchInputBorderColor,
              backgroundColor,
              color: inputTextColor,
              paddingVertical: height * 0.018,
            },
          ]}
          placeholderTextColor={Colors.light.searchPlaceholder}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {/* Categories */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {[
            "Design",
            "Engineering",
            "Data",
            "Graphics",
            "Writing",
            "Cloud",
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
        </ScrollView>
        {/* Continue Learning */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: courseTitleColor }]}>
            Available Courses
          </Text>
          {/* <Text style={styles.seeAll}>See All</Text> */}
        </View>
        <View style={styles.cardRow}>
          <FlatList
            data={filteredCourses}
            horizontal
            keyExtractor={(item) => item?._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16, gap: 12 }}
            renderItem={RenderedCard}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default CoursesScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  search: {
    borderRadius: 5,
    borderWidth: 2,
    borderStyle: "solid",
    padding: 10,
    marginTop: 10,
    fontSize: 14,
  },
  chipsRow: {
    flexDirection: "row",
    marginVertical: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    marginRight: 10,
  },
  chipText: {
    fontSize: 13,
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
    color: Colors.light.dividerText,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
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
    color: Colors.light.ratingStar,
    fontSize: 12,
  },
  author: {
    fontSize: 11,
    color: Colors.dark.text,
  },
  bottomGrid: {
    marginTop: 20,
  },
  largeCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  largeImage: {
    width: "100%",
  },
  largeTitle: {
    fontSize: 16,
    fontWeight: "600",
    padding: 12,
  },
});
