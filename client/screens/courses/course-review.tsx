import { useThemeColor } from "@/hooks/use-theme-color";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const REVIEWS = [
  {
    id: "1",
    name: "Muhammad Arsalan",
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Euismod turpis sollicitudin id. Quam tempor facilisis at morbi feugiat semper tristique ut.",
  },
  {
    id: "2",
    name: "Usman Diljan",
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Euismod turpis sollicitudin id. Quam tempor facilisis at morbi feugiat semper tristique ut.",
  },
  {
    id: "3",
    name: "Rashid Ansari",
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Euismod turpis sollicitudin id. Quam tempor facilisis at morbi feugiat semper tristique ut.",
  },
];

const ReviewCard = ({ item }: any) => {
  const backgroundColor = useThemeColor(
    { light: "#EAF0FF", dark: "#1E1E1E" },
    "background",
  );

  const reviewTextColor = useThemeColor(
    { light: "#6B7280", dark: "#9CA3AF" },
    "text",
  );

  const nameTextColor = useThemeColor(
    { light: "#111827", dark: "#F9FAFB" },
    "text",
  );

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />

        <View style={styles.headerText}>
          <Text style={[styles.name, { color: nameTextColor }]}>
            {item.name}
          </Text>

          <View style={styles.stars}>
            {Array.from({ length: item.rating }).map((_, index) => (
              <AntDesign key={index} name="star" size={14} color="#FFC107" />
            ))}
          </View>
        </View>
      </View>

      <Text
        style={[styles.reviewText, { color: reviewTextColor }]}
        numberOfLines={2}
      >
        {item.review}
      </Text>
    </View>
  );
};

const CourseReview = () => {
  const { width } = useWindowDimensions();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingHorizontal: width * 0.05 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {REVIEWS.map((item) => (
        <ReviewCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};

export default CourseReview;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    // Android shadow
    elevation: 4,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
  },

  headerText: {
    marginLeft: 12,
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  stars: {
    flexDirection: "row",
    marginTop: 4,
  },

  reviewText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6B7280",
  },
});
