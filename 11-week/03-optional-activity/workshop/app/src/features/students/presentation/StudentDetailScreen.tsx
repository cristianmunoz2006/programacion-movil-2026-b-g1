import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "../../../shared/Button";
import { theme } from "../../../core/theme/theme";
import { RootStackParamList } from "../../../core/navigation/types";
import { useStudentDetail } from "./useStudentDetail";
import { strings } from "./strings";

type Props = NativeStackScreenProps<RootStackParamList, "StudentDetail">;

export function StudentDetailScreen({ route, navigation }: Props) {
  const { state, reload } = useStudentDetail(route.params.studentId);

  return (
    <View style={styles.container}>
      {state.status === "loading" && (
        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={strings.detailLoading}
          style={styles.skeleton}
        />
      )}

      {state.status === "error" && (
        <View style={styles.centered}>
          <Text style={styles.message}>{strings.detailError}</Text>
          <Button label={strings.retryButton} onPress={reload} />
        </View>
      )}

      {state.status === "notFound" && (
        <View style={styles.centered}>
          <Text style={styles.message}>{strings.detailNotFound}</Text>
          <Button label={strings.backToList} onPress={() => navigation.goBack()} />
        </View>
      )}

      {state.status === "loaded" && (
        <>
          {state.isOffline && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>{strings.offlineBanner}</Text>
            </View>
          )}
          <View style={styles.card}>
            <Text accessibilityRole="header" style={styles.name}>
              {state.student.name}
            </Text>
            <Text style={styles.label}>{strings.modal.documentLabel}</Text>
            <Text style={styles.value}>{state.student.documentNumber}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.space.md, backgroundColor: theme.color.background },
  skeleton: { height: 96, borderRadius: theme.radius.md, backgroundColor: theme.color.border },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: theme.space.md },
  message: { ...theme.text.body, color: theme.color.textMuted, textAlign: "center" },
  banner: {
    backgroundColor: theme.color.border,
    padding: theme.space.sm,
    borderRadius: theme.radius.md,
    marginBottom: theme.space.md,
  },
  bannerText: { ...theme.text.caption, color: theme.color.text, textAlign: "center" },
  card: {
    padding: theme.space.lg,
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  name: { ...theme.text.title, color: theme.color.text, marginBottom: theme.space.lg },
  label: { ...theme.text.caption, color: theme.color.textMuted, marginBottom: theme.space.xs },
  value: { ...theme.text.body, color: theme.color.text },
});
