// components/CourseCard.js
import { Colors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const CourseCard = ({
  id,
  title,
  author,
  progress,
  image,
}: {
  id: string;
  title: string;
  author: string;
  progress: number;
  image: any;
}) => {
  const { width } = useWindowDimensions();

  const navigation = useNavigation<{
    navigate: (arg0: string) => void;
  }>();

  return (
    <TouchableOpacity
      style={[styles.card, { width: width - 32 }]}
      onPress={() =>
        // @ts-ignore
        navigation.navigate("main-course-screen", {
          id,
          name: title,
        })
      }
    >
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
    </TouchableOpacity>
  );
};

export default CourseCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.light.generalBg,
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
    color: Colors.light.text,
  },
  author: {
    fontSize: 13,
    color: Colors.dark.text,
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
    backgroundColor: Colors.light.background,
    borderRadius: 3,
    overflow: "hidden",
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.errorText,
  },
  percent: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.dark.text,
  },
});
