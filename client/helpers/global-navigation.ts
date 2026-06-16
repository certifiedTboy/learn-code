import { NavigationContainerRef } from "@react-navigation/native";

export let navigationRef: NavigationContainerRef<any> | null = null;

export function setNavigationRef(ref: NavigationContainerRef<any> | null) {
  navigationRef = ref;
}

export function navigate(name: string, params?: object) {
  if (navigationRef && navigationRef.isReady()) {
    // cast to any to avoid problematic "never" overloads in react-navigation types
    (navigationRef as any).navigate(name, params);
  }
}
