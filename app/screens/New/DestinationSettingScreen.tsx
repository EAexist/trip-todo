import {Avatar, AvatarProps} from '@/components/Avatar'
import * as Fab from '@/components/Fab'
import * as Input from '@/components/Input'
import ContentTitle, {Title} from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {Destination, DestinationSnapshotIn} from '@/models/Destination'
import {useNavigate} from '@/navigators'
import {Trans, useLingui} from '@lingui/react/macro'
import {ListItemProps} from '@rneui/base'
import {Text} from '@rneui/themed'
import {ListItem} from '@rneui/themed'
import {FC, ReactNode, useCallback, useEffect, useState} from 'react'
import {FlatList, ListRenderItem, TouchableOpacity, View} from 'react-native'

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

export interface DestinationListItemBaseProps {
  item: Omit<DestinationSnapshotIn, 'id'>
  rightContent?: ReactNode
  onPress?: () => void
}

export const DestinationListItemBase: FC<DestinationListItemBaseProps> = ({
  item,
  rightContent,
  onPress,
}) => {
  const [flag, setFlag] = useState<string>()
  useEffect(() => {
    setFlag(getFlagEmoji(item.nation))
  }, [getFlagEmoji])

  return (
    <ListItem onPress={onPress} containerStyle={{height: 60}}>
      {/* <Avatar title={getFlagEmoji(item.nation)} size={35} /> */}
      <Avatar title={flag} size={35} />
      <ListItem.Content>
        <ListItem.Title>
          <Trans>{item.title}</Trans>
        </ListItem.Title>
        <ListItem.Subtitle>
          {/* <Trans>{`${regionNames.of(item.nation.toUpperCase())}ㆍ${item.state}`}</Trans> */}
          <Trans>{`${item.state}${item.nation}`}</Trans>
        </ListItem.Subtitle>
      </ListItem.Content>
      {rightContent}
    </ListItem>
  )
}

interface DestinationListItemProps {
  destination: Destination
}

const DestinationListItem: FC<DestinationListItemProps> = ({destination}) => {
  const {tripStore} = useStores()
  const handleClosePress = useCallback(() => {
    tripStore.deleteDestination(destination)
  }, [])
  return (
    <DestinationListItemBase
      item={destination}
      rightContent={
        <ListItem.Chevron
          onPress={handleClosePress}
          iconProps={{name: 'close'}}
        />
      }
    />
  )
}
export const DestinationSettingScreen: FC = () => {
  const {tripStore} = useStores()
  const {t} = useLingui()

  const renderDestinationListItem: ListRenderItem<Destination> = useCallback(
    ({item}) => <DestinationListItem destination={item} />,
    [],
  )

  const {navigateWithTrip} = useNavigate()

  const handleSearchPress = useCallback(() => {
    navigateWithTrip('DestinationSearch')
  }, [])
  const handleNextPress = useCallback(async () => {
    tripStore.patch()
  }, [])

  const {titleText, subtitlteText} = tripStore.isDestinationSet
    ? {
        titleText: `다른 도시도 방문할 예정인가요?`,
        subtitlteText: `여행 중 방문할 도시를 모두 추가해주세요.`,
      }
    : {
        titleText: `어디로 떠나시나요?`,
        subtitlteText: `여행 중 방문할 도시를 모두 추가해주세요.`,
      }

  return (
    <Screen>
      <ContentTitle title={titleText} subtitle={subtitlteText} />
      <Text style={{fontFamily: 'roboto'}}>여행 중 방문할 도시</Text>
      <Text style={{fontFamily: 'Pretendard', fontWeight: 900}}>
        여행 중 방문할 도시
      </Text>
      <Text style={{fontFamily: 'Pretendard', fontWeight: 700}}>
        여행 중 방문할 도시
      </Text>
      <Text style={{fontFamily: 'Pretendard', fontWeight: 600}}>
        여행 중 방문할 도시
      </Text>
      <Text style={{fontFamily: 'Pretendard', fontWeight: 500}}>
        여행 중 방문할 도시
      </Text>
      <View>
        {tripStore.isDestinationSet && (
          <View>
            <ListSubheader
              title={`선택한 여행지 (${tripStore.destination.length})`}
            />
            <FlatList
              data={tripStore.destination}
              renderItem={renderDestinationListItem}
              keyExtractor={item => item.id}
            />
          </View>
        )}
        {/* <DestinationListItem
          destination={{
            nation: 'jp',
            title: '도쿠시마',
            state: '시코쿠',
          }}
        /> */}
        <TouchableOpacity onPress={handleSearchPress}>
          <Input.SearchBase placeholder={t`도시 또는 국가 검색`} />
        </TouchableOpacity>
      </View>
      <Fab.Container>
        <Fab.NextButton
          navigateProps={{
            name: 'ScheduleSetting',
          }}
          promiseBeforeNavigate={handleNextPress}
        />
      </Fab.Container>
    </Screen>
  )
}
