import {
  type KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../themed-text";

interface FormTextInputProps {
  keyboardType?: KeyboardTypeOptions;
  placeholderText: string;
  labelText: string;
  labelStyle: any;
  inputContainerStyle: any;
  formInputStyle: any;
  handleTextChange: (field: string, value: string) => void;
  value: string;
  placeholderTextColor: string;
  textInputField: string;
  onShowPassword?: () => void;
  passwordVisible?: boolean;
  passwordWrapperStyle?: any;
  handleOnBlur?: (textInputField: string) => void;
}

const FormTextInput = ({
  keyboardType,
  placeholderText,
  labelText,
  labelStyle,
  inputContainerStyle,
  formInputStyle,
  handleTextChange,
  value,
  placeholderTextColor,
  textInputField,
  onShowPassword,
  passwordVisible,
  passwordWrapperStyle,
  handleOnBlur,
}: FormTextInputProps) => {
  return (
    <View style={inputContainerStyle}>
      <ThemedText style={labelStyle}>{labelText}</ThemedText>
      <View style={passwordWrapperStyle}>
        <TextInput
          placeholder={placeholderText}
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          keyboardType={keyboardType}
          style={formInputStyle}
          value={value}
          placeholderTextColor={placeholderTextColor}
          onChangeText={(value) => handleTextChange(textInputField, value)}
          onBlur={() => handleOnBlur && handleOnBlur(textInputField)}
        />

        {textInputField === "password" && (
          <TouchableOpacity onPress={onShowPassword}>
            <Text style={styles.eyeIcon}>{passwordVisible ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormTextInput;

const styles = StyleSheet.create({
  eyeIcon: {
    fontSize: 18,
  },
});
