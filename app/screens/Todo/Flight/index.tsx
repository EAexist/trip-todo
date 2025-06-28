import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {useStores} from '@/models'
import {Location, LocationPair, Todo} from '@/models/Todo'
import {AppStackScreenProps, goBack, useNavigate} from '@/navigators'
import {useTodo} from '@/utils/useTodo'
import {withTodo} from '@/utils/withTodo'
import {useLingui} from '@lingui/react/macro'
import {Chip} from '@rneui/themed'
import {FC, ReactNode, use, useCallback, useEffect, useState} from 'react'
import {FlatList, ListRenderItem, View} from 'react-native'
import {AirportAutocomplete} from './AirportAutocomplete'
import {ListItemBase} from '@/components/ListItem'
import {ListItemChevron} from '@rneui/base/dist/ListItem/ListItem.Chevron'
import {useFocusEffect} from '@react-navigation/native'
import {getSnapshot} from 'mobx-state-tree'
import {Observer} from 'mobx-react-lite'
/* @TODO Import of getFlagEmoji fires
 * ERROR  TypeError: Cannot read property 'prototype' of undefined, js engine: hermes [Component Stack]
 * ERROR  Warning: TypeError: Cannot read property 'getFlagEmoji' of undefined
 */
// const getFlagEmoji = (countryCode: string) => {
//   if (!/^[A-Za-z]{2}$/.test(countryCode)) {
//     return '🏳️' // Return white flag for invalid codes.
//   }
//   const codePoints = countryCode
//     .toUpperCase()
//     .split('')
//     .map(char => 127397 + char.charCodeAt(0))
//   return '🏳️' // Return white flag for invalid codes.
//   return '🏳️' // Return white flag for invalid codes.
// }

const DepartureAirportSettingScreen = withTodo<'DepartureAirportSetting'>(
  ({todo}) => {
    const {
      tripStore: {patchTodo},
    } = useStores()
    const {navigateWithTrip} = useNavigate()
    const recommendationData: LocationPair[] = [
      {
        departure: {
          name: '인천국제공항',
          title: '인천',
          nation: 'kr',
          iataCode: 'ICN',
        },
        arrival: {
          name: '도쿠시마공항',
          title: '도쿠시마',
          nation: 'jp',
          iataCode: 'TKS',
        },
      },
    ]
    const handlePressRecommendationChip = useCallback(
      (locationPair: LocationPair) => {
        todo.setDeparture(locationPair.departure)
        todo.setArrival(locationPair.arrival)
        patchTodo(todo).then(() => {
          navigateWithTrip('RoundTripSetting', {todoId: todo.id})
        })
      },
      [],
    )
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
        navigateWithTrip('ArrivalAirportSetting', {todoId: todo.id})
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
      <Screen>
        <ContentTitle title={'출발지를 선택해주세요'} />
        <AirportAutocomplete
          recommendationContent={recommendationContent}
          handlePressSearchResult={handlePressSearchResult}
        />
        <Fab.Container>
          <Fab.NextButton
            title={'공항 결정은 나중에 할래요'}
            color={'secondary'}
            navigateProps={{
              name: 'TodolistSetting',
              params: {todoId: todo.id, isAirportSet: true},
            }}
            promiseBeforeNavigate={async () => {
              patchTodo(todo)
            }}
          />
        </Fab.Container>
      </Screen>
    )
  },
)

const ArrivalAirportSettingScreen = withTodo<'ArrivalAirportSetting'>(
  ({todo}) => {
    const {navigateWithTrip} = useNavigate()
    useEffect(() => {
      console.log('[ArrivalAirportSettingScreenBase] Hello')
    }, [])
    const handlePressSearchResult = useCallback((location: Location) => {
      todo.setArrival(location)
      navigateWithTrip('RoundTripSetting', {
        todoId: todo.id,
        isAirportSet: true,
      })
    }, [])

    return (
      <Screen>
        <ContentTitle
          title={'도착지를 선택해주세요'}
          subtitle={`출발: ${todo.departure?.title}${todo.departure?.iataCode ? `(${todo.departure?.iataCode})` : ''}`}
        />
        <AirportAutocomplete
          handlePressSearchResult={handlePressSearchResult}
        />
      </Screen>
    )
  },
)

const RoundTripSettingScreen = withTodo<'RoundTripSetting'>(({todo}) => {
  const {
    tripStore: {patchTodo, createCustomTodo},
    roundTripStore,
  } = useStores()

  useFocusEffect(
    useCallback(() => {
      if (todo.departure && todo.arrival) {
        roundTripStore?.setDeparture({...todo.arrival})
        roundTripStore?.setArrival({...todo.departure})
      }
    }, []),
  )

  return (
    <Screen>
      <ContentTitle title={'돌아오는 항공권 예매도\n할일에 추가할까요?'} />
      <View style={{paddingVertical: 8}}>
        <ListSubheader title={'내 할 일'} />
        <ListItemBase
          useDisabledStyle
          avatarProps={{iconId: '✈️'}}
          title={todo.flightTitleWithCode}
          rightContent={<ListItemChevron name="check" color={'priamry'} />}
        />
      </View>
      {roundTripStore && (
        <View style={{paddingVertical: 8}}>
          <ListSubheader title={'새 할 일 (돌아오는 항공권 예매)'} />
          <Observer
            render={() => (
              <ListItemBase
                avatarProps={{iconId: '✈️'}}
                title={roundTripStore.flightTitleWithCode}
              />
            )}
          />
        </View>
      )}
      <Fab.Container>
        <Fab.NextButton
          title={'추가하기'}
          navigateProps={{
            name: 'TodolistSetting',
            params: {todoId: todo.id, isAirportSet: true},
          }}
          promiseBeforeNavigate={async () => {
            createCustomTodo({...roundTripStore}).then(() => patchTodo(todo))
          }}
        />
        <Fab.NextButton
          title={'건너뛰기'}
          color={'secondary'}
          navigateProps={{
            name: 'TodolistSetting',
            params: {todoId: todo.id, isAirportSet: true},
          }}
          promiseBeforeNavigate={async () => {
            patchTodo(todo)
          }}
        />
      </Fab.Container>
    </Screen>
  )
})

const DepartureAirportEditScreen = withTodo(({todo}: {todo: Todo}) => {
  const handlePressSearchResult = useCallback(
    async (location: Location) => {
      todo.setDeparture(location)
      goBack()
    },
    [todo],
  )
  return (
    <Screen>
      <ContentTitle title={'출발지를 선택해주세요'} />
      <AirportAutocomplete handlePressSearchResult={handlePressSearchResult} />
    </Screen>
  )
})

const ArrivalAirportEditScreen = withTodo(({todo}: {todo: Todo}) => {
  const handlePressSearchResult = useCallback(
    async (location: Location) => {
      todo.setArrival(location)
      goBack()
    },
    [todo],
  )
  return (
    <Screen>
      <ContentTitle
        title={'도착지를 선택해주세요'}
        subtitle={`출발: ${todo.departure?.title}${todo.departure?.iataCode ? `(${todo.departure?.iataCode})` : ''}`}
      />
      <AirportAutocomplete handlePressSearchResult={handlePressSearchResult} />
    </Screen>
  )
})
// export const RoundTripSetting: FC<
//   AppStackScreenProps<'RoundTripSetting'>
// > = props => {
//   const todo = useTodo(props.route)
//   return !!todo ? <RoundTripSettingScreenBase todo={todo} /> : <></>
// }

export {RoundTripSettingScreen as RoundTripSetting}
export {DepartureAirportSettingScreen as DepartureAirportSetting}
export {DepartureAirportEditScreen as DepartureAirportEdit}
export {ArrivalAirportSettingScreen as ArrivalAirportSetting}
export {ArrivalAirportEditScreen as ArrivalAirportEdit}
