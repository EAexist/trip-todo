import { Avatar } from '@/components/Avatar'
import * as Fab from '@/components/Fab'
import * as Input from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import { Screen } from '@/components/Screen'
import { useStores } from '@/models'
import { Destination, DestinationSnapshotIn } from '@/models/Destination'
import { useNavigate } from '@/navigators'
import { getFlagEmoji } from '@/utils/nation'
import { Trans, useLingui } from '@lingui/react/macro'
import { ListItem } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, ReactNode, useCallback } from 'react'
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native'

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
//   return String.fromCodePoint(0x1f44d)
//   return String.fromCodePoint(...codePoints) // Return white flag for invalid codes.
// }

export interface DestinationListItemBaseProps {
    item: Omit<DestinationSnapshotIn, 'id' | 'description'>
    rightContent?: ReactNode
    onPress?: () => void
}

export const DestinationListItemBase: FC<DestinationListItemBaseProps> = ({
    item,
    rightContent,
    onPress,
}) => {
    //   const [flag, setFlag] = useState<string>()
    //   useEffect(() => {
    //     console.log(getFlagEmoji(item.nation))
    //     setFlag(getFlagEmoji(item.nation))
    //   }, [getFlagEmoji, item.nation])

    return (
        <ListItem onPress={onPress} containerStyle={{ height: 60 }}>
            <Avatar iconId={getFlagEmoji(item.nation)} size={35} iconStyle={{}} />
            {/* <Avatar title={flag} size={35} /> */}
            <ListItem.Content>
                <ListItem.Title>
                    <Trans>{item.title}</Trans>
                </ListItem.Title>
                <ListItem.Subtitle>
                    {/* <Trans>{`${regionNames.of(item.nation.toUpperCase())}ㆍ${item.state}`}</Trans> */}
                    <Trans>{`${item.region}`}</Trans>
                </ListItem.Subtitle>
            </ListItem.Content>
            {rightContent}
        </ListItem>
    )
}

interface DestinationListItemProps {
    destination: Destination
}

const DestinationListItem: FC<DestinationListItemProps> = ({ destination }) => {
    const { tripStore } = useStores()
    const handleClosePress = useCallback(() => {
        tripStore.deleteDestination(destination)
    }, [])
    return (
        <DestinationListItemBase
            key={destination.id}
            item={destination}
            rightContent={
                <ListItem.Chevron
                    onPress={handleClosePress}
                    iconProps={{ name: 'close' }}
                />
            }
        />
    )
}
export const DestinationSettingScreen: FC = observer(() => {
    const { tripStore } = useStores()
    const { t } = useLingui()

    const renderDestinationListItem: ListRenderItem<Destination> = useCallback(
        ({ item }) => <DestinationListItem key={item.id} destination={item} />,
        [],
    )

    const { navigateWithTrip } = useNavigate()

    const handleSearchPress = useCallback(() => {
        navigateWithTrip('DestinationSearch')
    }, [])
    //   const handleNextPress = useCallback(async () => {
    //     tripStore.patch()
    //   }, [])

    const { titleText, subtitlteText } = tripStore.isDestinationSet
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
                <View style={{ paddingVertical: 16 }}>
                    <TouchableOpacity onPress={handleSearchPress}>
                        <Input.SearchBase placeholder={t`도시 또는 국가 검색`} />
                    </TouchableOpacity>
                </View>
            </View>
            <Fab.Container>
                <Fab.NextButton
                    title={tripStore.isDestinationSet ? '다음' : '건너뛰기'}
                    navigateProps={{
                        name: 'ScheduleSetting',
                    }}
                />
            </Fab.Container>
        </Screen>
    )
})
