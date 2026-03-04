import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

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
    { light: "#EAF0FF", dark: "#EAF0FF" },
    "background",
  );

  const reviewTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.light.text },
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
          <Text style={styles.name}>{item.name}</Text>

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
  return (
    <FlatList
      data={REVIEWS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ReviewCard item={item} />}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CourseReview;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: width * 0.05,
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
