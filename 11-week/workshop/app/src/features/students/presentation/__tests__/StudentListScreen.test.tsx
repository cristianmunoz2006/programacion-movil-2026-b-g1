import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { container } from "../../../../core/di/container";
import { StudentListScreen } from "../StudentListScreen";
import { strings } from "../strings";

jest.mock("../../../../core/di/container", () => ({
  container: {
    students: {
      getStudents: { execute: jest.fn() },
      createStudent: { execute: jest.fn() },
    },
  },
}));
jest.mock("../../../auth/presentation/AuthContext", () => ({
  useAuth: () => ({ logout: jest.fn() }),
}));
jest.mock("../../../../core/network/useConnectivity", () => ({
  useConnectivity: () => true,
}));
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

const getStudents = container.students.getStudents.execute as jest.Mock<() => Promise<unknown>>;

describe("StudentListScreen", () => {
  beforeEach(() => {
    getStudents.mockReset();
  });

  it("muestra el mensaje de error y Reintentar vuelve a pedir los estudiantes", async () => {
    getStudents.mockRejectedValueOnce(new Error("sin red"));
    getStudents.mockResolvedValueOnce({
      students: [{ id: "1", name: "Laura De la Espriella", documentNumber: "929393329" }],
      fromCache: false,
    });

    await render(<StudentListScreen />);

    expect(await screen.findByText(strings.errorMessage)).toBeTruthy();
    expect(getStudents).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByText(strings.retryButton));

    await waitFor(() => expect(getStudents).toHaveBeenCalledTimes(2));
    expect(await screen.findByText("Laura De la Espriella")).toBeTruthy();
    expect(screen.queryByText(strings.errorMessage)).toBeNull();
  });
});