import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import {
  Animated,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const CourseItem2 = ({
  title,
  children,
  isCheckedList = true,
}: {
  title: string;
  children: React.ReactNode;
  isCheckedList?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const { width } = useWindowDimensions();

  const backgroundColor = useThemeColor(
    { light: "#EAF0FF", dark: "#1E1E1E" },
    "background",
  );

  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const bodyHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], // Adjust based on content height
  });

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={[styles.accordionContainer, { backgroundColor }]}>
      <TouchableOpacity
        style={[styles.accordionHeader, { backgroundColor }]}
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.accordionTitle,
            { color: textColor, fontSize: width > 768 ? 18 : 16 },
          ]}
        >
          {title}
        </Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon name="caret-down" size={14} color={textColor} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.accordionBody, { height: bodyHeight }]}>
        <ScrollView
          style={styles.accordionContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default CourseItem2;

const styles = StyleSheet.create({
  accordionContainer: {
    // backgroundColor: "#ffffff",s
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  accordionTitle: {
    fontWeight: "600",
    // color: "#2d3436",
    flex: 1,
    marginRight: 10,
  },
  accordionIcon: {
    fontSize: 14,
    color: "#636e72",
  },
  accordionBody: {
    overflow: "hidden",
    borderTopWidth: 1,
    // borderTopColor: "#f1f2f6",
  },
  accordionContent: {
    padding: 20,
  },
  checklistContainer: {
    gap: 12,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.light.generalBg,
    borderColor: Colors.light.generalBg,
  },

  checklistText: {
    color: "#2d3436",
    flex: 1,
    lineHeight: 22,
  },
});
