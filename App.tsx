import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

import { GlobalCallHandler } from './src/components/call/GlobalCallHandler';

export default function App() {
    return (
        <SafeAreaProvider>
            <AppNavigator />
            <GlobalCallHandler />
            <StatusBar style="auto" />
        </SafeAreaProvider>
    );
}
