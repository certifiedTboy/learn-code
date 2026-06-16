import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, TextInput, useWindowDimensions } from "react-native";

const SearchCourseInput = ({
  searchQuery,
  handleSearch,
}: {
  searchQuery: string;
  handleSearch: (text: string) => void;
}) => {
  const { height } = useWindowDimensions();

  const searchInputBorderColor = useThemeColor(
    { light: Colors.light.courseCardBg, dark: Colors.dark.courseCardBg },
    "background",
  );
  const inputTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  return (
    <TextInput
      placeholder="Search Course Here..."
      style={[
        styles.search,
        {
          borderColor: searchInputBorderColor,
          backgroundColor,
          color: inputTextColor,
          paddingVertical: height * 0.018,
        },
      ]}
      placeholderTextColor={Colors.light.searchPlaceholder}
      value={searchQuery}
      onChangeText={handleSearch}
    />
  );
};

export default SearchCourseInput;

const styles = StyleSheet.create({
  search: {
    borderRadius: 5,
    borderWidth: 2,
    borderStyle: "solid",
    padding: 10,
    marginTop: 10,
    fontSize: 14,
  },
});
