import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { showNotification } from "@/helpers/notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import * as yup from "yup";

const UpdateProfileSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
});

const UpdateProfileScreen = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp<any>>();

  // NOTE: Replace with your actual mutation hook if you have one, e.g., useUpdateProfileMutation()
  const [isLoading, setIsLoading] = useState(false);

  const inputTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const placeHolderColor = useThemeColor(
    { light: "#555", dark: "#555" },
    "text",
  );

  const updateProfileHandler = async (
    isValid: boolean,
    values: { firstName: string; lastName: string },
  ) => {
    if (!isValid) {
      return showNotification({
        type: "error",
        title: "Invalid Input",
        message: "Please fill all required fields correctly.",
      });
    }

    setIsLoading(true);
    try {
      // TODO: Call your update profile API here
      console.log("Updating profile", values);

      // Simulating an API call
      setTimeout(() => {
        setIsLoading(false);
        showNotification({
          type: "success",
          title: "Success",
          message: "Profile updated successfully!",
        });
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }, 1000);
    } catch (error: any) {
      setIsLoading(false);
      showNotification({
        type: "error",
        title: "Error",
        message: error?.message || "Something went wrong",
      });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
        }}
        onSubmit={(values) => console.log(values)}
        validationSchema={UpdateProfileSchema}
      >
        {({ handleChange, values, errors, handleBlur, isValid }) => (
          <ThemedView
            style={[
              styles.container,
              { paddingHorizontal: width * 0.1, paddingTop: height * 0.16 },
            ]}
            darkColor={Colors.dark.background}
            lightColor={Colors.light.background}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.container}>
                <ThemedText
                  style={[
                    styles.title,
                    { fontSize: width * 0.075, lineHeight: width * 0.09 },
                  ]}
                >
                  Update Profile
                </ThemedText>
                <ThemedText
                  style={[
                    styles.subtitle,
                    { fontSize: width * 0.038, marginBottom: height * 0.05 },
                  ]}
                >
                  Edit your personal information
                </ThemedText>

                <View style={{ marginBottom: height * 0.025 }}>
                  <ThemedText
                    style={[styles.label, { fontSize: width * 0.035 }]}
                  >
                    First Name
                  </ThemedText>
                  <TextInput
                    placeholder="Enter your first name"
                    autoCapitalize="words"
                    style={[
                      styles.input,
                      {
                        color: inputTextColor,
                        paddingVertical: height * 0.018,
                      },
                    ]}
                    placeholderTextColor={placeHolderColor}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    value={values.firstName}
                  />

                  {errors?.firstName && (
                    <View style={styles.errorTextContainer}>
                      <Icon
                        name="alert-circle"
                        size={16}
                        color={Colors.light.errorText}
                      />
                      <ThemedText style={styles.errorText}>
                        {errors?.firstName}
                      </ThemedText>
                    </View>
                  )}
                </View>

                <View style={{ marginBottom: height * 0.025 }}>
                  <ThemedText
                    style={[styles.label, { fontSize: width * 0.035 }]}
                  >
                    Last Name
                  </ThemedText>
                  <TextInput
                    placeholder="Enter your last name"
                    autoCapitalize="words"
                    style={[
                      styles.input,
                      {
                        color: inputTextColor,
                        paddingVertical: height * 0.018,
                      },
                    ]}
                    placeholderTextColor={placeHolderColor}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={values.lastName}
                  />

                  {errors?.lastName && (
                    <View style={styles.errorTextContainer}>
                      <Icon
                        name="alert-circle"
                        size={16}
                        color={Colors.light.errorText}
                      />
                      <ThemedText style={styles.errorText}>
                        {errors?.lastName}
                      </ThemedText>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    {
                      paddingVertical: height * 0.02,
                      marginBottom: height * 0.04,
                    },
                  ]}
                  onPress={() => updateProfileHandler(isValid, values)}
                  disabled={isLoading}
                >
                  <Text style={styles.saveText}>SAVE CHANGES</Text>
                  {isLoading && <ActivityIndicator size="small" color="#fff" />}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </ThemedView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: "700",
    marginBottom: 5,
  },
  subtitle: {
    color: "#666",
  },
  label: {
    color: Colors.dark.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: Colors.dark.generalBg,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 3,
  },
  saveText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  errorTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  errorText: {
    color: Colors.light.errorText,
    fontSize: 12,
    fontFamily: "robotoMedium",
    marginLeft: 4,
  },
});
