import Icon from "@/components/ui/Icon";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

interface SubmitButtonType {
  buttonText: string;
  buttonStyles: any;
  buttonTextStyles: any;
  onButtonPress: () => void;
  buttonIcon?: {
    name: any;
    size: number;
    color: string;
    position: "left" | "right";
  };
  buttonDisabled?: boolean;
  isLoading?: boolean;
}

const SubmitButton = ({
  buttonText,
  buttonStyles,
  buttonTextStyles,
  onButtonPress,
  buttonDisabled,
  isLoading,
  buttonIcon,
}: SubmitButtonType) => {
  return (
    <TouchableOpacity
      style={[
        buttonStyles,
        styles.button,
        { opacity: buttonDisabled ? 0.4 : 0.6 },
      ]}
      disabled={buttonDisabled}
      onPress={onButtonPress}
    >
      {buttonIcon && buttonIcon?.position === "left" && (
        <Icon
          name={buttonIcon.name || "alarm"}
          color={buttonIcon.color}
          size={buttonIcon.size}
        />
      )}
      <Text style={[buttonTextStyles]}>{buttonText}</Text>
      {buttonIcon && buttonIcon?.position === "right" && (
        <Icon
          name={buttonIcon.name || "alarm"}
          color={buttonIcon.color}
          size={buttonIcon.size}
        />
      )}
      {isLoading && <ActivityIndicator size="small" color="#fff" />}
    </TouchableOpacity>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 3,
  },
});
