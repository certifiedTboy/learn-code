import CourseDetailsTab from "@/components/courses/course-details-tab";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = width * 0.5;

const CourseDetailsScreen = () => {
  return (
    <ThemedView darkColor="#000" lightColor="#fff" style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: "https://via.placeholder.com/600x400" }}
            style={styles.hero}
          />
          <View style={styles.playButton}>
            <Text style={styles.playText}>▶</Text>
          </View>
        </View>
        <CourseDetailsTab />

        {/* Enroll Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.enrollBtn}>
            <Text style={styles.enrollText}>GET ENROLL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default CourseDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  heroWrapper: {
    position: "relative",
  },
  hero: {
    width: "100%",
    height: HERO_HEIGHT,
  },
  playButton: {
    position: "absolute",
    top: "45%",
    left: "45%",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 40,
    padding: 18,
  },
  playText: {
    color: "#fff",
    fontSize: 22,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  tab: {
    fontSize: 14,
    color: "#888",
  },
  activeTab: {
    color: "#0A58ED",
    fontWeight: "600",
  },

  footer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  enrollBtn: {
    backgroundColor: "#0A58ED",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  enrollText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
