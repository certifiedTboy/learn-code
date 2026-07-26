/**
 * Hook for managing and scheduling device notifications using Expo Notifications.
 * Handles daily and monthly schedules, immediate notifications, and user interactions
 * with notification actions (e.g., continue, make-payment, snooze, cancel).
 */

import { AuthContext } from "@/features/context/auth-context";
import { navigate } from "@/helpers/global-navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useContext, useEffect, useRef } from "react";

// Set global configuration for how notifications should be handled when the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Custom hook providing utilities to schedule, manage, and respond to local device notifications.
 */
export const useScheduleNotification = () => {
  const { isAuthenticated } = useContext(AuthContext);
  // Store the current authentication state in a ref to access it reliably within the notification listener callback
  const authRef = useRef(isAuthenticated);

  useEffect(() => {
    authRef.current = isAuthenticated;
  }, [isAuthenticated]);

  /**
   * Cancels a previously scheduled notification and removes its identifier from AsyncStorage.
   * @param scheduleIdentifier - The key used to store the notification ID in AsyncStorage.
   */
  const cancelNotification = async (scheduleIdentifier: string) => {
    const notificationId = await AsyncStorage.getItem(scheduleIdentifier);

    if (!notificationId) return;

    await Notifications.cancelScheduledNotificationAsync(notificationId);
  };

  /**
   * Schedules a daily recurring local notification.
   * Replaces any existing daily or monthly-payment notifications for the same course and schedule type.
   * @param title - The title of the notification.
   * @param body - The body text of the notification.
   * @param data - Additional payload data attached to the notification, including scheduling details like hour, minute, and route.
   */
  const scheduleDailyNotification = async (
    title: string,
    body: string,
    data?: any,
  ) => {
    // If this is a payment reminder, cancel the monthly notification
    if (data?.scheduleType === "monthly-payment") {
      await cancelNotification(`${data?.courseId}-monthly`);
    }
    // Always cancel an existing notification of the same course and schedule type
    await cancelNotification(`${data?.courseId}-${data?.scheduleType}`);

    // Schedule the new daily notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        categoryIdentifier: "sub_actionable",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: data?.hour,
        minute: data?.minute,
        channelId: "new_emails",
      },
    });

    // Save the new notification ID in local storage for later management
    await AsyncStorage.setItem(
      `${data?.courseId}-${data?.scheduleType}`,
      notificationId,
    );
  };

  /**
   * Schedules a monthly recurring local notification.
   * Specifically used for monthly subscriptions, replacing any existing monthly notifications.
   * @param title - The title of the notification.
   * @param body - The body text of the notification.
   * @param data - Additional payload data attached to the notification.
   */
  const scheduleMonthlyNotification = async (
    title: string,
    body: string,
    data?: any,
  ) => {
    // Clean up any old monthly or monthly-payment reminders for this course
    await cancelNotification(`${data?.courseId}-monthly`);
    await cancelNotification(`${data?.courseId}-monthly-payment`);

    // Schedule the new monthly notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        categoryIdentifier: "sub_actionable",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day: data?.day,
        hour: data?.hour,
        minute: data?.minute,
        channelId: "new_emails",
      },
    });

    // Save the new notification ID in local storage for later management
    await AsyncStorage.setItem(`${data?.courseId}-monthly`, notificationId);
  };

  /**
   * Triggers an immediate, one-time local notification without a schedule.
   * @param title - The title of the notification.
   * @param body - The body text of the notification.
   * @param data - Additional payload data attached to the notification.
   */
  const triggerImmediateNotification = (
    title: string,
    body: string,
    data?: any,
  ) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        categoryIdentifier: "actionable",
      },
      trigger: null, // Setting trigger to null causes the notification to fire immediately
    });
  };

  /**
   * Sets up notification categories and listeners to handle user interactions with notifications.
   * Includes registering action buttons like "Cancel", "Continue", "Snooze", and "Make Payment".
   */
  useEffect(() => {
    // Register 'actionable' category (typically used for daily reminders)
    Notifications.setNotificationCategoryAsync("actionable", [
      // {
      //   identifier: "cancel",
      //   buttonTitle: "Cancel",
      //   options: {
      //     isDestructive: true, // Will display in red on iOS
      //     opensAppToForeground: false,
      //   },
      // },
      {
        identifier: "continue",
        buttonTitle: "Continue",
        options: {
          opensAppToForeground: true, // Requires user to open the app
        },
      },
    ]);

    // Register 'sub_actionable' category (typically used for payment reminders)
    Notifications.setNotificationCategoryAsync("sub_actionable", [
      {
        identifier: "snooze",
        buttonTitle: "Snooze",
        options: {
          isDestructive: true,
          opensAppToForeground: false,
        },
      },
      {
        identifier: "make-payment",
        buttonTitle: "Make Payment",
        options: {
          opensAppToForeground: true,
        },
      },
    ]);

    // Listen for user interactions with received notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const actionIdentifier = response.actionIdentifier;
        const data = response.notification.request.content.data;
        const notificationId = response.notification.request.identifier;

        // Handle "Continue" action (e.g. from a daily learning reminder)
        if (actionIdentifier === "continue") {
          if (authRef.current) {
            navigate((data?.route as string) || "main-tabs", {
              id: data?.courseId?.toString(),
              name: data?.courseName?.toString(),
            });
          } else {
            navigate("SignInScreen");
          }

          Notifications.dismissNotificationAsync(notificationId);
        }

        // Handle "Make Payment" action (e.g. from a monthly subscription reminder)
        if (actionIdentifier === "make-payment") {
          if (authRef.current) {
            navigate((data?.route as string) || "main-tabs", {
              id: data?.courseId?.toString(),
              name: data?.courseName?.toString(),
              fromNotification: true,
            });
          } else {
            navigate("SignInScreen");
          }

          Notifications.dismissNotificationAsync(notificationId);
        }

        // Handle "Snooze" action
        if (actionIdentifier === "snooze") {
          (async () => {
            // Replace the monthly payment reminder with a daily reminder to pay
            await scheduleDailyNotification(
              "Expired Subscription",
              `Pay Your subscription for ${data?.courseName} to continue learning.`,
              {
                ...data,
                scheduleType: "monthly-payment",
                route: "course-details",
              },
            );

            // do something regarding payment reminder
            Notifications.dismissNotificationAsync(notificationId);
          })();
        }

        // Handle "Cancel" action
        if (actionIdentifier === "cancel" || actionIdentifier === "close") {
          console.log("User cancelled notification");
          // You can update local state, call API, remove reminder, etc.

          Notifications.dismissNotificationAsync(notificationId);
        }

        // Handle default tap action (opening the notification directly without pressing a specific action button)
        if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
          // navigate("Notifications");
        }
      },
    );

    // Cleanup the listener when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  /**
   * Requests and checks device permissions for sending notifications.
   * Returns true if granted, or null if denied.
   */
  const getDeviceNotificationStatus = async () => {
    const existingPermission = await Notifications.getPermissionsAsync();

    let finalStatus = existingPermission.status;

    // If permission hasn't been granted yet, ask the user for permission
    if (existingPermission.status !== "granted") {
      const settings = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      finalStatus = settings.status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permission not granted");
      return null;
    }

    console.log("Notification permission granted");
    return true;
  };

  return {
    scheduleDailyNotification,
    triggerImmediateNotification,
    scheduleMonthlyNotification,
    getDeviceNotificationStatus,
    cancelNotification,
  };
};
