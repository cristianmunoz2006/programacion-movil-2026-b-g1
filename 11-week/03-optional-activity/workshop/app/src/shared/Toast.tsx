import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../core/theme/theme";

type Props = {
  message: string | null;
  onHide: () => void;
  duration?: number;
};

// Mensaje corto de confirmación: aparece abajo y se oculta solo.
export function Toast({ message, onHide, duration = 3000 }: Props) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onHide, duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!message) return null;

  return (
    <View style={styles.toast} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: theme.space.md,
    right: theme.space.md,
    bottom: theme.space.lg,
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.success,
  },
  text: { ...theme.text.body, color: theme.color.onSuccess, textAlign: "center" },
});
