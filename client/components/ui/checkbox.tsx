import { Colors } from "@/constants/Colors";
import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "./Icon";

const CheckBox = ({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: () => void;
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.row} onPress={setChecked}>
        <View style={[styles.checkbox, checked && styles.checked]}>
          {checked && <Icon name="checkmark" size={10} color="#fff" />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          Linking.openURL(
            "https://f18btrht-5173.uks1.devtunnels.ms/terms-and-conditions",
          )
        }
      >
        <Text style={styles.label}>I agree to the terms and conditions</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 0.7,
    borderColor: Colors.light.generalBg,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: Colors.light.generalBg,
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});
