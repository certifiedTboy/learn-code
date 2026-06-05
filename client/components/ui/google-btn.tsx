import Icon from "@/components/ui/Icon";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const GoogleBtn = ({
  isLoading,
  styles,
  iconColor,
  buttonTextStyle,
  buttonText,
  onPress,
}: {
  isLoading: boolean;
  buttonText: string;
  styles: any;
  iconColor: string;
  buttonTextStyle: any;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles} onPress={onPress}>
      <Icon name={"logo-google"} size={24} color={iconColor} />

      <Text style={buttonTextStyle}>{buttonText}</Text>
      {isLoading && <ActivityIndicator size="small" color="#fff" />}
    </TouchableOpacity>
  );
};

export default GoogleBtn;
