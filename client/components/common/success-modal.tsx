import { Colors } from "@/constant/Colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const SuccessModal = ({
  visible,
  onClose,
  title = "Success!",
  message = "Your action was completed successfully.",
}: SuccessModalProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const strokeAnim = useRef(new Animated.Value(0)).current;

  const overlayBg = useThemeColor(
    { light: Colors.light.background, dark: "#fff" },
    "background",
  );

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      strokeAnim.setValue(0);

      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(strokeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const strokeDashoffset = strokeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: overlayBg }]}>
          <Animated.View
            style={[styles.iconWrapper, { transform: [{ scale: scaleAnim }] }]}
          >
            <Svg width={70} height={70} viewBox="0 0 70 70">
              <AnimatedPath
                d="M18 37 L30 48 L52 24"
                fill="none"
                stroke={Colors.light.generalBg}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={100}
                strokeDashoffset={strokeDashoffset}
              />
            </Svg>
          </Animated.View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.light.generalBg }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 24,
    alignItems: "center",
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
