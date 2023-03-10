import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from 'dayjs'
import clsx from "clsx";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { useState, useEffect} from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from '../utils/generate-progress-percentage'
import { HabitEmpty } from "../components/HabitEmpty";

interface Params{
    date: string;
}

interface DayInfoProps{
    completedHabits: string[];
    possibleHabits: {
    id: string;
    tittle: string;
    }[]
}


export function Habits(){
     const [loading, setLoading] = useState(true);
     const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
     const [completedHabits, setCompletedHabits] = useState<string[]>([]);


    const route = useRoute();
    const {date} = route.params as Params;

    const parsedDate = dayjs(date);
    const dayOfWeek = parsedDate.format('dddd');
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
    const dayAndMonth = parsedDate.format('DD/MM')

    const habitsProgress = dayInfo?.possibleHabits.length ?  generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) : 0;

    async function fetchHabits() {
        try {
            setLoading(true);

            const response = await api.get('/day', {params: {date}});
            setDayInfo(response.data);
            setCompletedHabits(response.data.completedHabits);

        } catch (error) {
            console.log(error);
            Alert.alert('Ops','Nao foi possivel carregar as informações dos habitos')
        }
        finally{
            setLoading(false);
        }
    }

    async function handleToggleHabit(habitId: string) {
        try{
            await api.patch(`/habits/${habitId}/toggle`)
        if(completedHabits.includes(habitId)){
            setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId));
        } else{
            setCompletedHabits(prevState => [...prevState, habitId]);
        }
    } catch(error){
        console.log(error)
        Alert.alert('ops', 'não foi possivel atualizar o status do habito')
    }
    }

    useEffect(() =>{
        fetchHabits()
    }, [])


    if(loading){
        return(
            <Loading />
        );
    }

    return(
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 100}}
                    >
                    
                    <BackButton/>
                    <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                        {dayOfWeek}
                    </Text>

                    <Text className="text-white font-extrabold text-3xl">
                        {dayAndMonth}
                    </Text>
                    
                        <ProgressBar progress={habitsProgress}/>

                        <View className={ clsx("mt-6", {
                            ["opacity-50"] : isDateInPast
                        })}>
                            {
                                dayInfo?.possibleHabits ?
                                 dayInfo.possibleHabits.map(habit => (
                                    <CheckBox 
                                        key={habit.id}
                                        title={habit.tittle} 
                                        checked={completedHabits.includes(habit.id)}
                                        disabled={isDateInPast}
                                        onPress={() => handleToggleHabit(habit.id)}
                                    />
                                 )) : <HabitEmpty />
                            }
                        </View>

                        {
                            isDateInPast && (
                                <Text className="text-white mt-10 text-center">
                                    Você não pode editar um habito de uma data passada
                                </Text>
                            )
                                
                        }
                    </ScrollView>
                    </View>
    );
}