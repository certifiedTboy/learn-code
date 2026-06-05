import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { CourseDetailsContext } from "@/lib/context/course-details-context";
import { useContext } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const CourseOverview = () => {
  const { course } = useContext(CourseDetailsContext);

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const skillTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const subtitleColor = useThemeColor(
    { light: "#666666", dark: "#AAAAAA" },
    "text",
  );

  const statBoxColor = useThemeColor(
    { light: "#EAF0FF", dark: "#1E1E1E" },
    "background",
  );

  const chipColor = useThemeColor(
    { light: "#EAF0FF", dark: "#1E1E1E" },
    "background",
  );

  return (
    <ScrollView contentContainerStyle={[styles.content, { backgroundColor }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: textColor }]}>{course?.name}</Text>
        <Text style={styles.price}>{course?.price}</Text>
      </View>

      <Text style={[styles.author, { color: subtitleColor }]}>
        By {course?.instructor || "Adebisi Tosin"}
      </Text>

      <Text style={[styles.description, { color: textColor }]}>
        {course?.description}
      </Text>

      <Text style={styles.readMore}>Read More</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Stat
          label={`${course?.totalTopics}+ Topics`}
          bgColor={statBoxColor}
          textColor={skillTextColor}
        />
        <Stat
          label={`${course?.subscribers} Subscribers`}
          bgColor={statBoxColor}
          textColor={skillTextColor}
        />
        <Stat
          label={`${course?.requiredDuration}+ Weeks`}
          bgColor={statBoxColor}
          textColor={skillTextColor}
        />
        <Stat
          label={`Complete by ${course?.completed}`}
          bgColor={statBoxColor}
          textColor={skillTextColor}
        />
        <Stat
          label={`${course?.rating} Rating`}
          bgColor={statBoxColor}
          textColor={skillTextColor}
        />
        {course?.discount && (
          <Stat
            label={`${course?.discount}% Off`}
            bgColor={statBoxColor}
            textColor={skillTextColor}
          />
        )}
      </View>

      {/* Skills */}
      <Text style={[styles.sectionTitle, { color: subtitleColor }]}>
        Skills
      </Text>
      <View style={styles.skillsRow}>
        {course?.skills?.map((skill: string | null) => (
          <View
            key={skill}
            style={[styles.skillChip, { backgroundColor: chipColor }]}
          >
            <Text style={[styles.skillText, { color: skillTextColor }]}>
              {skill}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CourseOverview;

const Stat = ({
  label,
  bgColor,
  textColor,
}: {
  label: string;
  bgColor: string;
  textColor: string;
}) => (
  <View style={[styles.statBox, bgColor && { backgroundColor: bgColor }]}>
    <Text style={[styles.statText, { color: textColor }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  content: {
    padding: 16,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A58ED",
  },
  author: {
    fontSize: 13,
    color: "#666",
    marginVertical: 4,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginTop: 10,
    lineHeight: 22,
  },
  readMore: {
    fontSize: 13,
    color: "#0A58ED",
    marginTop: 6,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  statBox: {
    width: "48%",
    backgroundColor: Colors.light.generalBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  statText: {
    fontSize: 13,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 10,
  },
  skillText: {
    fontSize: 12,
  },
});
