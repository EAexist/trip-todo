import {useTheme} from '@rneui/themed'
import {FC, useEffect} from 'react'
import {ViewStyle} from 'react-native'
import {
  CalendarProps,
  LocaleConfig,
  Calendar as RNECalendar,
} from 'react-native-calendars'

export const Calendar: FC<CalendarProps> = ({markedDates, ...props}) => {
  const {
    theme: {colors},
  } = useTheme()

  useEffect(() => {
    console.log(markedDates)
  }, [markedDates])
  const themedMarkedDates = markedDates
    ? Object.fromEntries(
        Object.entries(markedDates).map(([k, v]) => [
          k,
          {
            ...v,
            color: v.color || colors.light1,
            textColor: colors.text.primary,
            customTextStyle: {fontWeight: 600},
            ...((v.startingDay || v.endingDay) && {
              customTextStyle: {
                fontWeight: 600,
                color: colors.contrastText.primary,
              },
              customContainerStyle: {
                backgroundColor: colors.primary,
              },
            }),
          },
        ]),
      )
    : {}

  return (
    <RNECalendar
      theme={{...theme, dayTextColor: colors.text.secondary}}
      style={$calendarstyle}
      markedDates={themedMarkedDates}
      {...props}
    />
  )
}

const $calendarstyle: ViewStyle = {
  padding: 0,
}

const theme = {
  // backgroundColor: '#ffffff',
  // calendarBackground: '#ffffff',
  // textSectionTitleColor: '#b6c1cd',
  // textSectionTitleDisabledColor: '#d9e1e8',
  // selectedDayBackgroundColor: '#00adf5',
  // selectedDayTextColor: 'black',
  // todayTextColor: '#00adf5',
  // dayTextColor: '#2d4150',
  // textDisabledColor: '#d9e1e8',
  // dotColor: '#00adf5',
  // selectedDotColor: '#ffffff',
  // arrowColor: 'orange',
  // disabledArrowColor: '#d9e1e8',
  // monthTextColor: 'blue',
  // indicatorColor: 'blue',
  textDayFontFamily: 'Pretendard',
  textMonthFontFamily: 'Pretendard',
  textDayHeaderFontFamily: 'Pretendard',
  // textDayFontWeight: '300',
  // textMonthFontWeight: 'bold',
  // textDayHeaderFontWeight: '300',
  // textDayFontSize: 16,
  // textMonthFontSize: 16,
  // textDayHeaderFontSize: 16,
}

LocaleConfig.locales['kr'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
    '일요일',
  ],
  dayNamesShort: ['월', '화', '수', '목', '금', '토', '일'],
  today: '오늘',
}
LocaleConfig.defaultLocale = 'kr'
