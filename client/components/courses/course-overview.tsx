import { ScrollView, StyleSheet, Text, View } from "react-native";

const CourseOverview = () => {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Graphic Design</Text>
        <Text style={styles.price}>72$</Text>
      </View>

      <Text style={styles.author}>By Syd Hassan</Text>

      <Text style={styles.description}>
        Lorem ipsum dolor sit amet, consectetur. Nec eget accumsan molestie, non
        integer rhoncus vitae nisi ut natoque metus sollicitud gravida.
        Consectetur aliquet sit diam.
      </Text>

      <Text style={styles.readMore}>Read More</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Stat label="60+ Lectures" />
        <Stat label="Certificate" />
        <Stat label="08+ Weeks" />
        <Stat label="30% Off" />
      </View>

      {/* Skills */}
      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.skillsRow}>
        {[
          "Adobe",
          "Adobe Photoshop",
          "Logo",
          "Designing",
          "Poster Design",
          "Figma",
        ].map((skill) => (
          <View key={skill} style={styles.skillChip}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CourseOverview;

const Stat = ({ label }: { label: string }) => (
  <View style={styles.statBox}>
    <Text style={styles.statText}>{label}</Text>
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: "center",
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
    backgroundColor: "#EAF0FF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 10,
  },
  skillText: {
    fontSize: 12,
    color: "#0A58ED",
  },
});
