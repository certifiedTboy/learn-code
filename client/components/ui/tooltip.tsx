import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Tooltip = ({
  setShowTooltip,
}: {
  setShowTooltip: (value: boolean) => void;
}) => {
  return (
    <View style={styles.tooltipContainer}>
      <View style={styles.tooltipBox}>
        <Text style={styles.tooltipTitle}>Data Sync Actions</Text>
        <Text style={styles.tooltipText}>
          Use the top button to restore your backup from the cloud.
        </Text>
        <Text style={styles.tooltipText}>
          Use the bottom button to backup your registered courses to the cloud.
        </Text>
        <TouchableOpacity
          style={styles.tooltipCloseBtn}
          onPress={() => setShowTooltip(false)}
        >
          <Text style={styles.tooltipCloseText}>Got it</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tooltipArrow} />
    </View>
  );
};

export default Tooltip;

const styles = StyleSheet.create({
  tooltipContainer: {
    position: "absolute",
    right: 80,
    bottom: 110,
    zIndex: 101,
    alignItems: "flex-end",
  },
  tooltipBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  tooltipTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  tooltipText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    lineHeight: 20,
  },
  tooltipCloseBtn: {
    marginTop: 10,
    backgroundColor: "#0A58ED",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  tooltipCloseText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 15,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#fff",
    position: "absolute",
    right: -15,
    top: "50%",
    marginTop: -10,
  },
});
