import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';

const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#F8F8E1',
    },
};

export default function App() {
    return (
        <NavigationContainer theme={AppTheme}>
            <AppNavigator />
        </NavigationContainer>
    );
}
