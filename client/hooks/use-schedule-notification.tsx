import { AuthContext } from "@/features/context/auth-context";
import { navigate } from "@/helpers/global-navigation";
import * as Notifications from "expo-notifications";
import { useContext, useEffect, useRef } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const useScheduleNotification = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const authRef = useRef(isAuthenticated);

  useEffect(() => {
    authRef.current = isAuthenticated;
  }, [isAuthenticated]);

  /**
   * handle notification events
   */
  useEffect(() => {
    Notifications.setNotificationCategoryAsync("actionable", [
      {
        identifier: "snooze",
        buttonTitle: "Snooze",
        options: {
          isDestructive: true,
          opensAppToForeground: false,
        },
      },
      {
        identifier: "continue",
        buttonTitle: "Continue",
        options: {
          opensAppToForeground: true,
        },
      },
    ]);

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const actionIdentifier = response.actionIdentifier;
        const data = response.notification.request.content.data;
        const notificationId = response.notification.request.identifier;

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

        if (actionIdentifier === "snooze" || actionIdentifier === "close") {
          console.log("User cancelled notification");
          // You can update local state, call API, remove reminder, etc.

          Notifications.dismissNotificationAsync(notificationId);
        }

        if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
          // navigate("Notifications");
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  /**
   * request permission for in app notifications
   */
  const getDeviceNotificationStatus = async () => {
    const existingPermission = await Notifications.getPermissionsAsync();

    let finalStatus = existingPermission.status;

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

  /**
   * schedule device daily notitication
   */
  const scheduleDailyNotification = (
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
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: data?.hour,
        minute: data?.minute,
        channelId: "new_emails",
      },
    });
  };

  /**
   * schedule device notitication
   */
  const scheduleMonthlyNotification = (
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
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day: data?.day,
        hour: data?.hour,
        minute: data?.minute,
        channelId: "new_emails",
      },
    });
  };

  /**
   * Trigget device notification immediately
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
      trigger: null,
    });
  };

  return {
    scheduleDailyNotification,
    triggerImmediateNotification,
    scheduleMonthlyNotification,
    getDeviceNotificationStatus,
  };
};
