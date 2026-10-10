import { useEffect } from "react";

const AppRedirect = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryString = params.toString();

    // TODO: Replace with your actual app custom scheme and store URLs
    const appScheme = `learncode://payment-success?${queryString}`;
    const playStoreUrl =
      "https://play.google.com/store/apps/details?id=com.yourcompany.learncode";
    const appStoreUrl = "https://apps.apple.com/app/id123456789";

    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    let storeUrl = "";

    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      storeUrl = appStoreUrl; // iOS
    } else if (/android/i.test(userAgent)) {
      storeUrl = playStoreUrl; // Android
    }

    // Attempt to open the app using the custom scheme
    window.location.replace(appScheme);

    // If the app doesn't open within a set time, redirect to the store (or dashboard if on desktop)
    const timeoutId = setTimeout(() => {
      if (storeUrl) {
        window.location.replace(storeUrl);
      } else {
        window.location.replace("/dashboard");
      }
    }, 2500);

    // If the page goes hidden (meaning the app successfully opened), cancel the timeout
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(timeoutId);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="glass-panel p-8 rounded-2xl flex flex-col items-center max-w-md text-center space-y-4">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Redirecting...
        </h1>
        <p className="text-muted-foreground">
          We are taking you back to the Learn Code app.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          If nothing happens, you will be redirected to the app store.
        </p>
      </div>
    </div>
  );
};

export default AppRedirect;
