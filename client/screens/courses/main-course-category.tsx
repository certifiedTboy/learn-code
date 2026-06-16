import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

const MainCourseCategory = () => {
  const chipBackgroundColor = useThemeColor(
    { light: Colors.light.courseCardBg, dark: Colors.dark.courseCardBg },
    "background",
  );

  const chipTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsRow}
    >
      {["Design", "Engineering", "Data", "Graphics", "Writing", "Cloud"].map(
        (item) => (
          <TouchableOpacity
            key={item}
            style={[styles.chip, { backgroundColor: chipBackgroundColor }]}
          >
            <Text style={[styles.chipText, { color: chipTextColor }]}>
              {item}
            </Text>
          </TouchableOpacity>
        ),
      )}
    </ScrollView>
  );
};

export default MainCourseCategory;

const styles = StyleSheet.create({
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
});
