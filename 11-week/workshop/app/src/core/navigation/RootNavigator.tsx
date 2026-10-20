import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../../features/auth/presentation/LoginScreen";
import { useAuth } from "../../features/auth/presentation/AuthContext";
import { StudentListScreen } from "../../features/students/presentation/StudentListScreen";
import { RootStackParamList } from "./types";
import { StudentDetailScreen } from "../../features/students/presentation/StudentDetailScreen";
import { strings } from "../../features/students/presentation/strings";
import { theme } from "../theme/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Auth is guarded centrally here, not inside individual screens — see
// docs/01-architecture/navigation.md.
export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="StudentList" component={StudentListScreen} />
            <Stack.Screen
              name="StudentDetail"
              component={StudentDetailScreen}
              options={{
                headerShown: true,
                title: strings.detailTitle,
                headerTintColor: theme.color.primary,
                headerStyle: { backgroundColor: theme.color.background },
                headerTitleStyle: { color: theme.color.text },
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
