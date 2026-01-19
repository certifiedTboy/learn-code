import { Colors } from "@/constant/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

const OnboardingSwiper = ({
  image,
  title,
  subtitle,
  currentIndex,
}: {
  image: any;
  title: string;
  subtitle: string;
  currentIndex: number;
}) => {
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );
  return (
    <View>
      <View style={styles.imageContainer}>
        <Image style={styles.image} resizeMode="contain" source={image} />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>

        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

export default OnboardingSwiper;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 0.45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.05,
  },
  image: {
    width: width * 0.85,
    height: height * 0.35,
  },

  textContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: width * 0.07,
  },
  subtitle: {
    fontSize: width * 0.038,
    textAlign: "center",
    color: "#666",
    lineHeight: width * 0.055,
  },
});
