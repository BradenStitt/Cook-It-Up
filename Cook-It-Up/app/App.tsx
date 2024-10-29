import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingPage from "./index";
import RegisterPage from "./RegisterPage";
import CreateScreen from "./CreateScreen";
import PantryScreen from "./PantryScreen";

export type RootStackParamList = {
  LandingPage: undefined;
  RegisterPage: undefined;
  CreateScreen: undefined;
  PantryScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="RegisterPage" component={RegisterPage} />
        <Stack.Screen name="CreateScreen" component={CreateScreen} />
        <Stack.Screen name="PantryScreen" component={PantryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
