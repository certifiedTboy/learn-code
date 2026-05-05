import { Colors } from "@/constants/Colors";
import * as React from "react";
import { FAB } from "react-native-paper";

const FloatingBtn = ({
  onNavigate,
  iconName,
  style,
  children,
}: {
  onNavigate: () => void;
  iconName?: string;
  style?: object;
  children?: React.ReactNode;
}) =>
  children ? (
    children
  ) : (
    <FAB
      rippleColor={Colors.light.text}
      loading={false}
      icon={iconName || ""}
      style={{ ...style, backgroundColor: Colors.light.generalBg }}
      onPress={() => onNavigate()}
    />
  );

export default FloatingBtn;
