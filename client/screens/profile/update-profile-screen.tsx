import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { useUpdateUserProfileMutation } from "@/features/apis/user-apis";
import { AuthContext } from "@/features/context/auth-context";
import { UpdateProfileSchema } from "@/helpers/form-validators";
import { showNotification } from "@/helpers/notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Formik } from "formik";
import { useContext, useEffect } from "react";
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

const UpdateProfileScreen = () => {
  const { user, updateUserDataOnProfileUpdate } = useContext(AuthContext);

  const { width, height } = useWindowDimensions();

  const [updateUserProfile, { isLoading, isSuccess, data, error, isError }] =
    useUpdateUserProfileMutation();

  const inputTextColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const placeHolderColor = useThemeColor(
    { light: "#555", dark: "#555" },
    "text",
  );

  const borderColor = useThemeColor(
    { light: "#E0E0E0", dark: "#333333" },
    "background",
  );

  const updateProfileHandler = async (
    isValid: boolean,
    values: { firstName: string; lastName: string },
  ) => {
    if (!isValid) {
      return showNotification({
        type: "error",
        title: "Invalid Input",
        message: "All fields are required",
      });
    }

    updateUserProfile({ ...values });
  };

  useEffect(() => {
    if (isSuccess && data) {
      showNotification({
        type: "success",
        title: "Success",
        message: "Profile updated successfully.",
      });

      (async () => {
        await updateUserDataOnProfileUpdate({
          _id: data?.data?._id?.toString(),
          firstName: data?.data?.firstName,
          lastName: data?.data?.lastName,
          isVerified: data?.data?.isVerified,
          profilePicture: data?.data?.profilePicture,
          email: data?.data?.email,
        });
      })();
    }

    if (isError) {
      showNotification({
        type: "error",
        title: "Error",
        message: "Profile update failed.",
      });
    }
  }, [isSuccess, isError, error, data]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
      <Formik
        initialValues={{
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
        }}
        onSubmit={(values) => console.log(values)}
        validationSchema={UpdateProfileSchema}
      >
        {({ handleChange, values, errors, handleBlur, isValid }) => (
          <ThemedView
            style={[
              styles.container,
              {
                paddingHorizontal: width * 0.1,
                paddingTop: height * 0.16,
              },
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
                    {
                      fontSize: width * 0.038,
                      marginBottom:
                        user && !user?.firstName && user?.lastName
                          ? height * 0.05
                          : height * 0.1,
                    },
                  ]}
                >
                  Edit your personal information
                </ThemedText>

                {user && !user?.firstName && user?.lastName && (
                  <ThemedText
                    style={{
                      fontSize: width * 0.038,
                      marginBottom: height * 0.05,
                      color: Colors.dark.errorText,
                    }}
                  >
                    Profile update can only be done once
                  </ThemedText>
                )}

                <View style={{ marginBottom: height * 0.025 }}>
                  <ThemedText
                    style={[styles.label, { fontSize: width * 0.035 }]}
                  >
                    First Name
                  </ThemedText>
                  <TextInput
                    placeholder="Enter your first name"
                    autoCapitalize="words"
                    editable={!user?.firstName}
                    style={[
                      styles.input,
                      {
                        color: inputTextColor,
                        paddingVertical: height * 0.018,
                        borderColor,
                        opacity: user?.firstName ? 0.6 : 1,
                      },
                    ]}
                    placeholderTextColor={placeHolderColor}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    value={values?.firstName}
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
                    editable={!user?.lastName}
                    style={[
                      styles.input,
                      {
                        color: inputTextColor,
                        paddingVertical: height * 0.018,
                        borderColor,
                        opacity: user?.lastName ? 0.6 : 1,
                      },
                    ]}
                    placeholderTextColor={placeHolderColor}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={values?.lastName}
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
                      opacity:
                        isLoading ||
                        (!!user?.firstName && !!user?.lastName) ||
                        !values.firstName ||
                        !values.lastName
                          ? 0.6
                          : 1,
                    },
                  ]}
                  onPress={() => updateProfileHandler(isValid, values)}
                  disabled={
                    isLoading ||
                    (!!user?.firstName && !!user?.lastName) ||
                    !values.firstName ||
                    !values.lastName
                  }
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
    // borderColor: "#E0E0E0",
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
