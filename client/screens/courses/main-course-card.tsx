import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

const MainCourseCard = ({
  id,
  name,
  author,
  progress,
  image,
  isExpired,
}: {
  id: string;
  name: string;
  author: string;
  progress?: number;
  image: string;
  isExpired?: boolean;
}) => {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width * 0.42;

  const navigation = useNavigation<NavigationProp<any>>();

  const cardBackgroundColor = useThemeColor(
    { light: Colors.light.courseCardBg, dark: Colors.dark.courseCardBg },
    "background",
  );

  const inputTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const cardColor = useThemeColor(
    { light: Colors.light.courseCardBg, dark: Colors.dark.courseCardBg },
    "background",
  );

  const authorTextColor = useThemeColor(
    { light: Colors.light.authorText, dark: Colors.dark.authorText },
    "text",
  );

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("course-details", {
          id,
          name,
        })
      }
      style={[
        {
          borderWidth: 1,
          borderColor: cardBackgroundColor,
          shadowColor: Colors.dark.generalBg,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,

          // Android shadow
          elevation: 4,
          backgroundColor: cardBackgroundColor,
        },

        styles.card,
        { width: CARD_WIDTH, backgroundColor: cardColor },
      ]}
    >
      <Image source={{ uri: image }} style={styles.cardImage} />
      <Text style={[styles.cardTitle, { color: inputTextColor }]}>{name}</Text>
      <Text style={styles.rating}>★★★★★</Text>
      <Text style={[styles.author, { color: authorTextColor }]}>{author}</Text>
    </TouchableOpacity>
  );
};

export default MainCourseCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 10,
  },
  cardImage: {
    width: "100%",
    height: 110,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  rating: {
    color: Colors.light.ratingStar,
    fontSize: 12,
  },
  author: {
    fontSize: 11,
    color: Colors.dark.text,
  },
});
