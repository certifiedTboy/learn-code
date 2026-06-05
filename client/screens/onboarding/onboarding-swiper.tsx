import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

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

  const { width, height } = useWindowDimensions();

  return (
    <View>
      <View style={[styles.imageContainer, { marginTop: height * 0.05 }]}>
        <Image
          style={{ width: width * 0.85, height: height * 0.35 }}
          resizeMode="contain"
          source={image}
        />
      </View>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {
              color: textColor,
              fontSize: width * 0.055,
              lineHeight: width * 0.07,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.subtitle,
            { lineHeight: width * 0.055, fontSize: width * 0.038 },
          ]}
        >
          {subtitle}
        </Text>
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
  },

  textContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
  },
});
