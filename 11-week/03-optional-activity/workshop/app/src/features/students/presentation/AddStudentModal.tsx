import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "../../../shared/Button";
import { TextField } from "../../../shared/TextField";
import { theme } from "../../../core/theme/theme";
import { useStudentForm } from "./useStudentForm";
import { validateDocumentNumber, validateName } from "./validateStudent";
import { strings } from "./strings";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
};

// "Add student" modal — see docs/01-architecture/screens/student-list.md.
export function AddStudentModal({ visible, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [documentTouched, setDocumentTouched] = useState(false);

  const { state, submit, reset } = useStudentForm(() => {
    onCreated();
    handleClose();
  });

  function handleClose() {
    setName("");
    setDocumentNumber("");
    setNameTouched(false);
    setDocumentTouched(false);
    reset();
    onClose();
  }

  // Si ya hay algo escrito, cancelar pide confirmación porque se pierde lo digitado.
  function handleCancel() {
    if (name.trim() === "" && documentNumber.trim() === "") {
      handleClose();
      return;
    }
    Alert.alert(strings.modal.discardTitle, strings.modal.discardMessage, [
      { text: strings.modal.keepEditing, style: "cancel" },
      { text: strings.modal.discard, style: "destructive", onPress: handleClose },
    ]);
  }

  // Al volver a escribir se quita el error que dejó el servidor.
  function clearServerError() {
    if (state.status === "error") reset();
  }

  const nameError = validateName(name);
  const documentError = validateDocumentNumber(documentNumber);
  const isSubmitting = state.status === "submitting";
  const canSave = !nameError && !documentError && !isSubmitting;
  const duplicateError =
    state.status === "error" && state.errorField === "documentNumber" ? state.errorMessage : undefined;
  const showGenericError = state.status === "error" && !state.errorField;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <TextField
            label={strings.modal.nameLabel}
            value={name}
            onChangeText={(value) => {
              setName(value);
              clearServerError();
            }}
            onBlur={() => setNameTouched(true)}
            error={nameTouched ? nameError : undefined}
            autoCapitalize="words"
            editable={!isSubmitting}
          />
          <TextField
            label={strings.modal.documentLabel}
            value={documentNumber}
            onChangeText={(value) => {
              setDocumentNumber(value);
              clearServerError();
            }}
            onBlur={() => setDocumentTouched(true)}
            error={(documentTouched ? documentError : undefined) ?? duplicateError}
            keyboardType="numeric"
            editable={!isSubmitting}
          />

          {showGenericError && (
            <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
              {state.errorMessage}
            </Text>
          )}

          <Button
            label={strings.modal.saveButton}
            onPress={() => submit(name.trim(), documentNumber.trim())}
            disabled={!canSave}
            loading={isSubmitting}
          />
          <Button
            label={strings.modal.cancelButton}
            onPress={handleCancel}
            variant="text"
            disabled={isSubmitting}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: theme.color.surface,
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
    padding: theme.space.lg,
    gap: theme.space.sm,
  },
  error: { color: theme.color.error, ...theme.text.caption, marginBottom: theme.space.sm },
});
