import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/Colors";
import { useGetAllCoursesMutation } from "@/features/apis/course-apis";
import { getAllCourse, upsertCourse } from "@/helpers/db/course-db";
import { showNotification } from "@/helpers/notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import MainCourseCard from "./main-course-card";
import MainCourseCategory from "./main-course-category";
import SearchCourseInput from "./search-course-input";

const CoursesScreen = () => {
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { height } = useWindowDimensions();

  const [refreshing, setRefreshing] = useState(false);

  const [getAllCoursesFromDb, { data, error }] = useGetAllCoursesMutation();

  const filteredCourses = availableCourses.filter((course) =>
    course?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

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

  const onRefresh = () => {
    setRefreshing(true);
    getAllCoursesFromDb(null);
    setTimeout(() => setRefreshing(false), 2000); // simulate refresh
  };

  const RenderedCard = useCallback(
    ({ item }: { item: any }) => (
      <MainCourseCard
        id={item?._id}
        name={item?.name}
        author="By Emmanuel Tosin"
        image={item?.image}
      />
    ),
    [cardBackgroundColor],
  );

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
        <SearchCourseInput
          searchQuery={searchQuery}
          handleSearch={handleSearch}
        />
        {/* Categories */}

        <MainCourseCategory />
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
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
