// components/CourseCard.js
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const CourseCard = ({
  title,
  author,
  progress,
  image,
}: {
  title: string;
  author: string;
  progress: number;
  image: any;
}) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.card, { width: width - 32 }]}>
      <Image source={image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.author}>{author}</Text>

        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.percent}>{progress}%</Text>
        </View>
      </View>
    </View>
  );
};

export default CourseCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    alignSelf: "center",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    // Android shadow
    elevation: 4,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  author: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E6E6E6",
    borderRadius: 3,
    overflow: "hidden",
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
  },
  percent: {
    fontSize: 12,
    fontWeight: "500",
    color: "#444",
  },
});
