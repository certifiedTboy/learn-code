import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";
import { useRegisteredCourseContext } from "@/features/context/registered-course-context";
import { showNotification } from "@/helpers/notification";
import { useScheduleNotification } from "@/hooks/use-schedule-notification";
import { useThemeColor } from "@/hooks/use-theme-color";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const ScheduleLearningScreen = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  // @ts-ignore - Assuming the context exposes registeredCourses
  const { registeredCourses } = useRegisteredCourseContext();
  const { scheduleDailyNotification } = useScheduleNotification();

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDate, setCustomDate] = useState<Date>(new Date());

  const formatAMPM = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strTime =
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      " " +
      ampm;
    return strTime;
  };

  const isCustomSelected =
    selectedTime !== null &&
    !["09:00", "14:00", "19:00"].includes(selectedTime);

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  const cardColor = useThemeColor(
    { light: Colors.light.courseCardBg, dark: Colors.dark.courseCardBg },
    "background",
  );

  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const borderColor = useThemeColor(
    { light: "#E0E0E0", dark: "#333333" },
    "background",
  );

  const timeSlots = [
    { id: "09:00", label: "Morning (09:00 AM)", icon: "sunny-outline" },
    {
      id: "14:00",
      label: "Afternoon (02:00 PM)",
      icon: "partly-sunny-outline",
    },
    { id: "19:00", label: "Evening (07:00 PM)", icon: "moon-outline" },
  ];

  const handleSchedule = async () => {
    if (!selectedCourseId || !selectedTime) {
      return showNotification({
        type: "error",
        title: "Incomplete",
        message: "Select a course and a time.",
      });
    }

    const course = registeredCourses?.find(
      (c: any) => c._id === selectedCourseId,
    );
    const [hour, minute] = selectedTime.split(":").map(Number);

    // Pass the required course metadata to the scheduled notification
    // Note: The current hook schedules for 10:00 AM daily natively,
    // but you can later modify useScheduleNotification to accept the selectedTime argument
    await scheduleDailyNotification(
      "Learning Time",
      `It's time to continue your learning on ${course?.name}!`,
      {
        courseId: selectedCourseId,
        courseName: course?.name,
        scheduleType: "daily-course-reminder",
        route: "main-course-screen",
        hour,
        minute,
      },
    );

    showNotification({
      type: "success",
      title: "Successfully Scheduled",
      message: `Reminder set for ${course?.name}.`,
    });

    navigation.goBack();
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: width * 0.06, paddingTop: height * 0.05 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText
          style={[
            styles.title,
            { fontSize: width * 0.075, marginBottom: height * 0.02 },
          ]}
        >
          Schedule Learning
        </ThemedText>
        <ThemedText
          style={[
            styles.subtitle,
            { fontSize: width * 0.04, marginBottom: height * 0.04 },
          ]}
        >
          Set daily reminders to keep up with your registered courses and build
          a consistent learning habit.
        </ThemedText>

        <ThemedText
          style={[
            styles.sectionTitle,
            { color: textColor, fontSize: width * 0.045 },
          ]}
        >
          Select Course
        </ThemedText>
        <View style={styles.methodsContainer}>
          {registeredCourses && registeredCourses.length > 0 ? (
            registeredCourses.map((course: any) => {
              const isSelected = selectedCourseId === course._id;

              return (
                <TouchableOpacity
                  key={course._id}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: cardColor,
                      borderColor: isSelected
                        ? Colors.light.generalBg
                        : borderColor,
                      borderWidth: isSelected ? 2 : 1,
                      paddingVertical: height * 0.02,
                      paddingHorizontal: width * 0.05,
                      marginBottom: height * 0.02,
                    },
                  ]}
                  onPress={() => setSelectedCourseId(course._id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionLeft}>
                    <Icon
                      // @ts-ignore
                      name="book-outline"
                      size={width * 0.06}
                      color={isSelected ? Colors.light.generalBg : textColor}
                    />
                    <ThemedText
                      style={[
                        styles.optionText,
                        { color: textColor, fontSize: width * 0.04 },
                      ]}
                      numberOfLines={1}
                    >
                      {course.name}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected
                          ? Colors.light.generalBg
                          : borderColor,
                      },
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <ThemedText style={styles.emptyText}>
              You do not have any registered courses yet.
            </ThemedText>
          )}
        </View>

        <ThemedText
          style={[
            styles.sectionTitle,
            {
              color: textColor,
              fontSize: width * 0.045,
              marginTop: height * 0.02,
            },
          ]}
        >
          Select Time Slot
        </ThemedText>
        <View style={styles.methodsContainer}>
          {timeSlots.map((slot) => {
            const isSelected = selectedTime === slot.id;
            return (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: cardColor,
                    borderColor: isSelected
                      ? Colors.light.generalBg
                      : borderColor,
                    borderWidth: isSelected ? 2 : 1,
                    paddingVertical: height * 0.02,
                    paddingHorizontal: width * 0.05,
                    marginBottom: height * 0.02,
                  },
                ]}
                onPress={() => setSelectedTime(slot.id)}
                activeOpacity={0.8}
              >
                <View style={styles.optionLeft}>
                  <Icon
                    // @ts-ignore
                    name={slot.icon}
                    size={width * 0.06}
                    color={isSelected ? Colors.light.generalBg : textColor}
                  />
                  <ThemedText
                    style={[
                      styles.optionText,
                      { color: textColor, fontSize: width * 0.04 },
                    ]}
                  >
                    {slot.label}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: isSelected
                        ? Colors.light.generalBg
                        : borderColor,
                    },
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[
              styles.optionCard,
              {
                backgroundColor: cardColor,
                borderColor: isCustomSelected
                  ? Colors.light.generalBg
                  : borderColor,
                borderWidth: isCustomSelected ? 2 : 1,
                paddingVertical: height * 0.02,
                paddingHorizontal: width * 0.05,
                marginBottom: height * 0.02,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <Icon
                // @ts-ignore
                name="time-outline"
                size={width * 0.06}
                color={isCustomSelected ? Colors.light.generalBg : textColor}
              />
              <ThemedText
                style={[
                  styles.optionText,
                  { color: textColor, fontSize: width * 0.04 },
                ]}
              >
                {isCustomSelected
                  ? `Custom Time (${formatAMPM(customDate)})`
                  : "Custom Time"}
              </ThemedText>
            </View>
            <View
              style={[
                styles.radioCircle,
                {
                  borderColor: isCustomSelected
                    ? Colors.light.generalBg
                    : borderColor,
                },
              ]}
            >
              {isCustomSelected && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              opacity: selectedCourseId && selectedTime ? 1 : 0.6,
              paddingVertical: height * 0.02,
              marginTop: height * 0.02,
              marginBottom: height * 0.05,
            },
          ]}
          disabled={!selectedCourseId || !selectedTime}
          onPress={handleSchedule}
        >
          <ThemedText
            style={[styles.actionButtonText, { fontSize: width * 0.045 }]}
          >
            Set Reminder
          </ThemedText>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={customDate}
            mode="time"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setCustomDate(selectedDate);
                const hh = selectedDate.getHours().toString().padStart(2, "0");
                const mm = selectedDate
                  .getMinutes()
                  .toString()
                  .padStart(2, "0");
                setSelectedTime(`${hh}:${mm}`);
              }
            }}
          />
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default ScheduleLearningScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#666",
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 16,
  },
  methodsContainer: {
    width: "100%",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },
  optionText: {
    fontWeight: "600",
    marginLeft: 12,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.generalBg,
  },
  actionButton: {
    backgroundColor: Colors.light.generalBg,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    marginBottom: 16,
  },
});
