import {createNativeStackNavigator} from '@react-navigation/native-stack';

const {Navigator, Screen} = createNativeStackNavigator();

import { Home } from '..//screens/Home';
import {News} from '..//screens/New';
import {Habits} from '..//screens/Habits';

export function AppRoutes(){
    return(
    <Navigator screenOptions={{ headerShown: false}}>
        <Screen 
            name='home'
            component={Home}
        />

        <Screen 
        name='new'
        component={News}
        />

        <Screen 
            name='habit'
            component={Habits}
        />


    </Navigator>
)}