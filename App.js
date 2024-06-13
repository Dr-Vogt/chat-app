import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Start from "./components/Start";
import Chat from "./components/Chat";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();

const App = () => {

const firebaseConfig = {
  apiKey: "AIzaSyCeDKnFk-mxx-IktqC-HiKRT8xH51e3yJw",
  authDomain: "chat-app-64555.firebaseapp.com",
  projectId: "chat-app-64555",
  storageBucket: "chat-app-64555.appspot.com",
  messagingSenderId: "598181694935",
  appId: "1:598181694935:web:a3e1365ed0d27b86aecf92",
};

const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);



  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
