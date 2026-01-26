import { ScrollView, StyleSheet, Text, View } from "react-native";

const CourseLessons = () => {
  return (
    <ScrollView contentContainerStyle={styles.accordion}>
      <View style={styles.accordionActive}>
        <Text style={styles.accordionTitle}>
          Chapter 1 : What is Graphics Designing?
        </Text>
        <View style={styles.lessonItem}>
          <Text style={styles.playIcon}>▶</Text>
          <Text style={styles.lessonText}>
            Lorem ipsum dolor sit amet consectetur.
          </Text>
        </View>
        <View style={styles.lessonItem}>
          <Text style={styles.docIcon}>📄</Text>
          <Text style={styles.lessonText}>
            Lorem ipsum dolor sit amet consectetur.
          </Text>
        </View>
        <View style={styles.lessonItem}>
          <Text style={styles.playIcon}>▶</Text>
          <Text style={styles.lessonText}>
            Lorem ipsum dolor sit amet consectetur.
          </Text>
        </View>
        <View style={styles.lessonItem}>
          <Text style={styles.playIcon}>▶</Text>
          <Text style={styles.lessonText}>
            Lorem ipsum dolor sit amet consectetur.
          </Text>
        </View>
      </View>

      {[
        "Chapter 2 : What is Logo Designing?",
        "Chapter 3 : What is Poster Designing?",
        "Chapter 4 : What is Picture Editing?",
      ].map((item) => (
        <View key={item} style={styles.accordionItem}>
          <Text style={styles.accordionTitle}>{item}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default CourseLessons;

const styles = StyleSheet.create({
  /* Accordion */
  accordion: {
    marginTop: 12,
    flexGrow: 1,
  },

  accordionActive: {
    // backgroundColor: "#F1F4FF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },

  accordionItem: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  accordionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 10,
  },

  playIcon: {
    fontSize: 14,
    color: "#0A58ED",
    marginRight: 10,
  },

  docIcon: {
    fontSize: 14,
    marginRight: 10,
  },

  lessonText: {
    fontSize: 13,
    color: "#444",
    flex: 1,
  },

  footer: {
    padding: 16,
    backgroundColor: "#fff",
  },
});
