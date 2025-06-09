import {Avatar} from '@/components/Avatar'
import * as Fab from '@/components/Fab'
import * as Input from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {Destination} from '@/models/Destination'
import {useNavigate} from '@/navigators'
import {getFlagEmoji, regionNames} from '@/utils/getFlagEmji'
import {Trans, useLingui} from '@lingui/react/macro'
import {ListItem} from '@rneui/themed'
import {FC, ReactNode, useCallback, useEffect} from 'react'
import {FlatList, ListRenderItem, TouchableOpacity, View} from 'react-native'

export interface DestinationListItemBaseProps {
  item: Destination
  rightContent?: ReactNode
  onPress?: () => void
}

export const DestinationListItemBase: FC<DestinationListItemBaseProps> = ({
  item,
  rightContent,
  onPress,
}) => {
  return (
    <ListItem onPress={onPress} containerStyle={{height: 60}}>
      <Avatar title={getFlagEmoji(item.nation)} size={35} />
      <ListItem.Content>
        <ListItem.Title>
          <Trans>{item.title}</Trans>
        </ListItem.Title>
        <ListItem.Subtitle>
          <Trans>{`${regionNames.of(item.nation.toUpperCase())}ㆍ${item.state}`}</Trans>
        </ListItem.Subtitle>
      </ListItem.Content>
      {rightContent}
    </ListItem>
  )
}

interface DestinationListItemProps
  extends Pick<DestinationListItemBaseProps, 'item'> {}

const DestinationListItem: FC<DestinationListItemProps> = ({item}) => {
  const handleClosePress = useCallback(() => {
    // console.log(`${item} list item pressed`)
  }, [])
  return (
    <DestinationListItemBase
      item={item}
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
    ({item}) => <DestinationListItem item={item} />,
    [],
  )

  const {navigateWithTrip} = useNavigate()

  const handleSearchPress = useCallback(() => {
    navigateWithTrip('DestinationSearch')
  }, [])
  const handleNextPress = useCallback(() => {
    // Handle next button press
    console.log('Next button pressed')
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
      <View>
        {tripStore.isDestinationSet && (
          <View>
            <ListSubheader
              title={`선택한 여행지 (${tripStore.destinations.length})`}
            />
            <FlatList
              data={tripStore.destinations}
              renderItem={renderDestinationListItem}
              keyExtractor={item => item.id}
            />
          </View>
        )}
        <TouchableOpacity onPress={handleSearchPress}>
          <Input.SearchBase placeholder={t`도시 또는 국가 검색`} />
        </TouchableOpacity>
      </View>
      <Fab.Container>
        <Fab.NextButton name="ScheduleSetting" />
      </Fab.Container>
    </Screen>
  )
}
