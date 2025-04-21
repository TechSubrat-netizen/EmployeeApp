import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from './Dashboard';
import Page1 from './ChildComponent/Page1';
import Page2 from './ChildComponent/Page2';
import SeeDetails from './SeeDetails';
const Stack = createNativeStackNavigator();
function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Page1" component={Page1} />
        <Stack.Screen name="Page2" component={Page2} />
        <Stack.Screen name="SeeDetails" component={SeeDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
