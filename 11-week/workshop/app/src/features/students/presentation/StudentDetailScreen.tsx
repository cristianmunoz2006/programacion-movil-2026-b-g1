import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { theme } from "../../../core/theme/theme";
import { RootStackParamList } from "../../../core/navigation/types";
import { strings } from "./strings";

type Props = NativeStackScreenProps<RootStackParamList, "StudentDetail">;

export function StudentDetailScreen({ route }: Props) {
  const { student } = route.params;

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.name}>
        {student.name}
      </Text>
      <Text style={styles.label}>{strings.modal.documentLabel}</Text>
      <Text style={styles.value}>{student.documentNumber}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.space.lg, backgroundColor: theme.color.background },
  name: { ...theme.text.title, color: theme.color.text, marginBottom: theme.space.lg },
  label: { ...theme.text.caption, color: theme.color.textMuted, marginBottom: theme.space.xs },
  value: { ...theme.text.body, color: theme.color.text },
});