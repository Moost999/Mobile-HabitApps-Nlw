import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
export function HabitEmpty(){
    const {navigate} =   useNavigation()

    return(
        <Text
        className="text-zinc-400 text-base">
            Você nao está monitarando nenhum habito {  }

            <Text
            className="text-violet-400 text-base underline active:text-violet-500"
            onPress={() => navigate('new')}
            >
                Cadastre uma nova meta p viver ex : dar carinho num pet, sorrir etc..
            </Text>
        </Text>
    )
} 
