import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../../shared/Button";
import { TextField } from "../../../shared/TextField";
import { theme } from "../../../core/theme/theme";
import { useConnectivity } from "../../../core/network/useConnectivity";
import { useAuth } from "./AuthContext";
import { strings } from "./strings";

// See docs/01-architecture/screens/login.md for the full spec this implements.
export function LoginScreen() {
  const { state, login } = useAuth();
  const isConnected = useConnectivity();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = state.status === "loading";
  const canSubmit = username.trim().length > 0 && password.trim().length > 0 && !isLoading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.title}</Text>

      <View style={styles.form}>
        <TextField
          label={strings.usernameLabel}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoComplete="username"
          editable={!isLoading}
        />
        <TextField
          label={strings.passwordLabel}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          returnKeyType="done"
          onSubmitEditing={() => {
            if (canSubmit && isConnected) login(username.trim(), password);
          }}
          editable={!isLoading}
        />

        {!isConnected && <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">{strings.errors.offline}</Text>}
        {isConnected && state.status === "error" && (
          <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">{state.errorMessage}</Text>
        )}

        <Button
          label={strings.loginButton}
          onPress={() => login(username.trim(), password)}
          disabled={!canSubmit || !isConnected}
          loading={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: theme.space.lg,
    backgroundColor: theme.color.background,
  },
  title: { ...theme.text.title, color: theme.color.text, textAlign: "center", marginBottom: theme.space.xl },
  form: { gap: theme.space.sm, width: "100%", maxWidth: 480, alignSelf: "center" },
  error: { color: theme.color.error, ...theme.text.caption, marginBottom: theme.space.sm },
});
