import * as Fab from '@/components/Fab'
import * as Input from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import {ListItemBase} from '@/components/ListItem'
import ListSubheader from '@/components/ListSubheader'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {useStores} from '@/models'
import {Location, LocationPair, Todo} from '@/models/Todo'
import {AppStackScreenProps, goBack} from '@/navigators'
import {useTodo} from '@/utils/useTodo'
import {useLingui} from '@lingui/react/macro'
import {Chip} from '@rneui/themed'
import {FC, ReactNode, useCallback, useEffect} from 'react'
import {FlatList, ListRenderItem, View} from 'react-native'

/* @TODO Import of getFlagEmoji fires
 * ERROR  TypeError: Cannot read property 'prototype' of undefined, js engine: hermes [Component Stack]
 * ERROR  Warning: TypeError: Cannot read property 'getFlagEmoji' of undefined
 */
const getFlagEmoji = (countryCode: string) => {
  if (!/^[A-Za-z]{2}$/.test(countryCode)) {
    return '🏳️' // Return white flag for invalid codes.
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return '🏳️' // Return white flag for invalid codes.
}

const FlightSettingScreenBase: FC<{
  title: string
  subtitle?: string
  recommendationContent?: ReactNode
  handlePressSearchResult: (location: Location) => Promise<void>
}> = ({title, subtitle, recommendationContent, handlePressSearchResult}) => {
  const {tripStore} = useStores()
  const {t} = useLingui()

  const locationSearchResult = [
    {iataCode: 'ICN', title: '인천', name: '인천국제공항'},
  ]

  const renderLocationListItem: ListRenderItem<Location> = useCallback(
    ({item}) => (
      <ListItemBase
        title={item.name}
        subtitle={item.iataCode}
        avatarProps={{}}
        onPress={() => {
          //   handlePressSearchResult(item)
          handlePressSearchResult(item).then(() => goBack())
        }}
      />
    ),
    [],
  )

  return (
    <Screen>
      <ContentTitle title={title} subtitle={subtitle} />
      <Input.SearchBase placeholder={t`출발 공항 또는 도시 검색`} />
      {recommendationContent}
      <View style={{paddingVertical: 8}}>
        <ListSubheader title={'검색 결과'} />
        <FlatList
          data={locationSearchResult}
          renderItem={renderLocationListItem}
          keyExtractor={item => item.iataCode}
        />
      </View>
      <Fab.Container>
        <Fab.GoBackButton
          title={'공항 결정은 나중에 할래요'}
          color={'secondary'}
        />
      </Fab.Container>
    </Screen>
  )
}

const FlightDepartureSettingScreenBase: FC<{todo: Todo}> = ({todo}) => {
  const {tripStore} = useStores()
  const handlePressRecommendationChip = useCallback(
    (locationPair: LocationPair) => {
      todo.setDeparture(locationPair.departure)
      todo.setArrival(locationPair.arrival)
      tripStore.patchTodo(todo).then(() => {
        goBack()
      })
    },
    [],
  )

  const recommendationData: LocationPair[] = [
    {
      departure: {iataCode: 'ICN', title: '인천', name: '인천국제공항'},
      arrival: {iataCode: 'TKS', title: '도쿠시마', name: '도쿠시마공항'},
    },
  ]

  const renderRecommendationChip: ListRenderItem<LocationPair> = useCallback(
    ({item}) => (
      <Chip
        title={`${item.departure?.title} → ${item.arrival?.title}`}
        onPress={() => handlePressRecommendationChip(item)}
      />
    ),
    [],
  )
  const handlePressSearchResult = useCallback(
    async (location: Location) => {
      todo.setDeparture(location)
    },
    [todo],
  )

  const recommendationContent = (
    <View style={{paddingVertical: 8}}>
      <ListSubheader title={'추천 항공편'} />
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        horizontal={true}
        data={recommendationData}
        renderItem={renderRecommendationChip}
        keyExtractor={item => `${item.departure}-${item.arrival}`}
      />
    </View>
  )

  return (
    <FlightSettingScreenBase
      title={'출발지를 선택해주세요'}
      recommendationContent={recommendationContent}
      handlePressSearchResult={handlePressSearchResult}
    />
  )
}
const FlightArrivalSettingScreenBase: FC<{todo: Todo}> = ({todo}) => {
  const handlePressSearchResult = useCallback(async (location: Location) => {
    todo.setArrival(location)
  }, [])

  useEffect(() => {
    console.log('[FlightArrivalSettingScreenBase] Hello')
  }, [])

  return (
    // <>FlightSettingScreenBase</>
    <FlightSettingScreenBase
      title={'도착지를 선택해주세요'}
      subtitle={`출발: ${todo.departure?.title}${todo.departure?.iataCode ? ` (${todo.departure?.iataCode})` : ''}`}
      handlePressSearchResult={handlePressSearchResult}
    />
  )
}

export const DepartureSetting: FC<
  AppStackScreenProps<'FlightDepartureSetting'>
> = props => {
  const todo = useTodo(props.route)
  return !!todo ? <FlightDepartureSettingScreenBase todo={todo} /> : <></>
}

export const ArrivalSetting: FC<
  AppStackScreenProps<'FlightArrivalSetting'>
> = props => {
  const todo = useTodo(props.route)
  return !!todo ? <FlightArrivalSettingScreenBase todo={todo} /> : <></>
}

const RoundTripSettingScreenBase: FC<{todo: Todo}> = ({todo}) => {
  const {tripStore} = useStores()
  const {t} = useLingui()

  const locationSearchResult = [
    {iataCode: 'ICN', title: '인천', name: '인천국제공항'},
  ]
  return (
    <Screen>
      <ContentTitle title={'돌아오는 항공권 예매도\n할일에 추가할까요?'} />
      <View style={{paddingVertical: 8}}>
        <ListSubheader title={'예매할 항공권'} />
        <TransText>{todo.flightTitle}</TransText>
      </View>
      <View style={{paddingVertical: 8}}>
        <ListSubheader title={'돌아오는 항공권'} />
        <TransText>{todo.flightTitle}</TransText>
      </View>
      <Fab.Container>
        <Fab.GoBackButton title={'추가하기'} />
        <Fab.GoBackButton title={'건너뛰기'} color={'secondary'} />
      </Fab.Container>
    </Screen>
  )
}

export const RoundTripSetting: FC<
  AppStackScreenProps<'RoundTripSetting'>
> = props => {
  const todo = useTodo(props.route)
  return !!todo ? <RoundTripSettingScreenBase todo={todo} /> : <></>
}

// export {FlightArrivalSettingScreen as ArrivalSetting}
// export {FlightDepartureSettingScreen as DepartureSetting}
