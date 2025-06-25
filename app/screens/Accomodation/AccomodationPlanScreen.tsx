import {Avatar} from '@/components/Avatar'
import * as Fab from '@/components/Fab'
import {ListItemBase} from '@/components/ListItem'
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {AccomodationItem} from '@/models/AccomodationItem'
import {useNavigate} from '@/navigators'
import {toCalendarString} from '@/utils/date'
import {Trans} from '@lingui/react/macro'
import {ListItem, useTheme} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {FC, useCallback, useEffect} from 'react'
import {
  FlatList,
  ListRenderItem,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import {CalendarProvider, ExpandableCalendar} from 'react-native-calendars'
import {Positions} from 'react-native-calendars/src/expandableCalendar'

const AccomodationPlanCalendar: FC = () => {
  const {tripStore} = useStores()

  const markedDates = Object.fromEntries(
    tripStore.calendarMarkedDateEntries.map(([k, {colorIndex, ...v}]) => [
      k,
      {color: $palette[colorIndex], ...v},
    ]),
  )
  useEffect(() => {
    console.log(markedDates)
  }, [markedDates])

  return (
    <CalendarProvider
      date={toCalendarString(
        tripStore.startDate ? tripStore.startDate : new Date(),
      )}>
      <ExpandableCalendar
        // markedDates={markedDates}
        initialPosition={Positions.CLOSED}
        horizontal={false}
        // ref={calendarRef}
        // onCalendarToggled={onCalendarToggled}
        // initialDate={toCalendarString(tripStore.startDate)}
        // minDate={toCalendarString(tripStore.startDate)}
        // maxDate={toCalendarString(tripStore.endDate)}
      />
    </CalendarProvider>
  )
}

const AccomodationListItem: FC<{
  item: AccomodationItem
}> = ({item}) => {
  const {tripStore} = useStores()
  const {navigateWithTrip} = useNavigate()
  const handlePress = useCallback(() => {
    navigateWithTrip('Accomodation', {accomodationId: item.id})
  }, [])
  useEffect(() => {
    console.log(item)
  }, [])
  const {
    theme: {colors},
  } = useTheme()
  return (
    <ListItemBase
      title={item.title}
      subtitle={item.nightsParsed}
      avatarProps={{
        icon: {
          color: colors.white,
          ...(item.type === 'hotel'
            ? {type: 'font-awesome-5', name: 'hotel'}
            : item.type === 'airbnb'
              ? {type: 'font-awesome-5', name: 'airbnb'}
              : item.type === 'dorm'
                ? {type: 'material-community', name: 'bunk-bed-outline'}
                : {type: 'material-community', name: 'bunk-bed-outline'}),
        },
        containerStyle: {
          backgroundColor:
            $palette[tripStore.indexedUniqueTitles.indexOf(item.title)],
        },
      }}
      onPress={handlePress}
      containerStyle={{height: 64}}
    />
  )
}
export const AccomodationPlanScreen: FC = observer(({}) => {
  const {tripStore} = useStores()

  const renderListItem: ListRenderItem<{
    item: AccomodationItem
    index: number
  }> = ({item}) => {
    return <AccomodationListItem item={item.item} />
  }

  const {navigateWithTrip} = useNavigate()
  const handleAddItemPress = useCallback(() => {
    navigateWithTrip('CreateAccomodation')
  }, [])

  return (
    <Screen>
      <View>
        <AccomodationPlanCalendar />
      </View>
      <FlatList
        data={tripStore.orderedItems.map((item, index) => ({
          index,
          item,
        }))}
        renderItem={renderListItem}
        keyExtractor={item => item.item.id}
        style={{flexGrow: 0}}
        // contentContainerStyle={{ paddingHorizontal: 20 }}
      />

      <Fab.Container>
        <Fab.Button
          // color={'secondary'}
          title={'숙소 추가하기'}
          onPress={handleAddItemPress}
        />
      </Fab.Container>
    </Screen>
  )
})

const $palette = [
  // '#9BF6FF',
  '#A0C4FF',
  '#BDB2FF',
  '#FFC6FF',
  '#FFADAD',
  '#FFD6A5',
  '#FDFFB6',
  '#CAFFBF',
]

const $titleContainerstyle: ViewStyle = {
  // flexShrink: 0,
  // flexGrow: 0,
  // flexBasis: 'auto',
}
const $contentTextStyle: TextStyle = {
  textAlign: 'right',
}
