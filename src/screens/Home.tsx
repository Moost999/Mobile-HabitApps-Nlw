import { View, Text, ScrollView, Alert } from "react-native"
import { useState, useCallback } from "react"
import {api} from '../lib/axios'
import {generateRangeDatesFromYearStart} from '../utils/generate-range-between-dates'
import { Loading } from "../components/Loading"
import { Header } from "../components/Header"
import { HabitDay, DAY_SIZE } from "../components/HabitsDay"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import dayjs from "dayjs"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearStart = generateRangeDatesFromYearStart()
const minimumSummaryDatesSizes = 18 * 5;
const amountOFDaysToFIll = minimumSummaryDatesSizes - datesFromYearStart.length;

type SummaryProps = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>

export function Home(){
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<SummaryProps | null>(null);
    const {navigate} = useNavigation();

   async function fetchData() {
    try{
        setLoading(true);
        const response = await api.get('/summary');
        setSummary(response.data);
        
    } catch(error){
        Alert.alert('Ops', 'Não foi possivel carregador o sumario de habitos')
        console.log(error);
    } finally {
        setLoading(false);
    }
   }

   useFocusEffect(useCallback(() => {
        fetchData();
   }, []));

   if(loading){
    return(
        <Loading/>
    );
   }

    return(
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />

                <View className="flex-row mt-6 mb-2">
                    {
                        weekDays.map((weekDay, i) => (
                            <Text key={`${weekDay} - ${i}`}
                                className="text-zinc-400 text-xl font-bold text-center mx-1" 
                                style={{width:DAY_SIZE}}

                            >
                                {weekDay}
                            </Text>
                        ))
                    }
                </View>

                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 100}}
                    >
                  {
                  summary &&      
                    <View className="flex-row flex-wrap">
                    {
                        datesFromYearStart.map(date => {
                            const dayWithHabits = summary.find(day => {
                                return dayjs(date).isSame(day.date, 'day')
                            })
                            return(
                            <HabitDay
                                    date={date}
                                    amountOfHabits={dayWithHabits?.amount}
                                    amountCompleted={dayWithHabits?.completed}
                                    onPress={() => navigate('habit', {date: date.toISOString() })}
                                    key={date.toISOString()}
                            />
                             )
                        })
                        }

                        {
                                amountOFDaysToFIll > 0 && Array.from({length:amountOFDaysToFIll}).map((_, i) => (
                                    <View 
                                        key={i}
                                        className="bg-zinc-900 rounded-lg border-2 m-2 border-zinc-800 opacity-40"
                                        style={{ width: DAY_SIZE, height: DAY_SIZE}}
                                    />
                                ))
                             }


                             </View>
                             }
                        </ScrollView>
                        </View>
    )
}