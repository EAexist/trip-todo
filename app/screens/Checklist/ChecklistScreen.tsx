import {Trans} from '@lingui/react/macro'
import {Divider, Header, Icon, ListItem, Text} from '@rneui/themed'
import {FC, useCallback, useEffect, useRef, useState} from 'react'
import {
  DefaultSectionT,
  FlatList,
  ListRenderItem,
  ScrollView,
  SectionList,
  SectionListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
//
import {
  BottomSheetModal,
  GestureHandlerRootViewWrapper,
} from '@/components/BottomSheetModal'
import {
  AccomodationChecklistItem,
  CompleteChecklistItem,
} from '@/components/ChecklistItem'
import {ChecklistItemBottomSheet} from '@/components/ChecklistItem/ChecklistItemModal'
import ListSubheader from '@/components/ListSubheader'
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {ChecklistItem} from '@/models/ChecklistItem'
import {AppStackScreenProps, useNavigate} from '@/navigators'
// import BottomSheet from '@gorhom/bottom-sheet'
import {useHeader} from '@/utils/useHeader'
import BottomSheet from '@gorhom/bottom-sheet'
import {observer} from 'mobx-react-lite'

// const SettingsDialog: FC = ({ visible6: boolean }) => {
//   return (
//     <Dialog isVisible={visible6}>
//       <Dialog.Title title="Choose Account" />
//       {userlist.map((l, i) => (
//         <ListItem
//           key={i}
//           containerStyle={{
//             marginHorizontal: -10,
//             borderRadius: 8,
//           }}
//           onPress={toggleDialog6}
//         >
//           <Avatar rounded source={{ uri: l.avatar_url }} />
//           <ListItem.Content>
//             <ListItem.Title style={{ fontWeight: '700' }}>
//               {l.name}
//             </ListItem.Title>
//             <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
//           </ListItem.Content>
//         </ListItem>
//       ))}
//     </Dialog>
//   )
// }

export const ChecklistScreen: FC<AppStackScreenProps<'Checklist'>> = observer(
  ({route}) => {
    const {checklistStore} = useStores()
    const {checklistId} = route.params
    const bottomSheetModalRef = useRef<BottomSheet>(null)
    const [pathToOpen, setPathToOpen] = useState<string | undefined>(undefined)
    const {navigateWithChecklist} = useNavigate()

    useEffect(() => {
      checklistStore.fetch(checklistId).then(() => {
        console.log(checklistStore)
      })
    }, [])

    const renderItem: SectionListRenderItem<ChecklistItem, DefaultSectionT> =
      useCallback(
        ({item}) =>
          item.type === 'accomodation' ? (
            <AccomodationChecklistItem item={item} />
          ) : item.type === 'passport' ? (
            <CompleteChecklistItem item={item} />
          ) : (
            <CompleteChecklistItem
              item={item}
              // onPress={() => handleChecklistItemPress(item)}
            />
          ),
        [],
      )

    const renderSectionHeader = useCallback(
      ({section: {title}}: {section: DefaultSectionT}) => (
        <ListSubheader title={title} />
      ),
      [],
    )

    /* SettingList */
    type SettingsListItemData = {title: string; path: string; primary?: boolean}

    const settingsMenu: SettingsListItemData[] = [
      {title: '할 일 추가', path: 'ChecklistAdd', primary: true},
      {title: '목록 순서 변경', path: 'ChecklistReorder'},
      {title: '목록에서 할 일 삭제', path: 'ChecklistDelete'},
    ]

    const renderSettingsListItem: ListRenderItem<SettingsListItemData> =
      useCallback(
        ({item}) => {
          const handlePress = () => {
            console.log(
              `[bottomSheetModalRef.current] ${bottomSheetModalRef.current}`,
            )
            bottomSheetModalRef.current?.forceClose()
            setPathToOpen(item.path)
          }

          return (
            <ListItem onPress={handlePress}>
              <ListItem.Content>
                <ListItem.Title primary={item.primary}>
                  {item.title}
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron onPress={handlePress} />
            </ListItem>
          )
        },
        [bottomSheetModalRef],
      )

    const handleSettingsButtonPress = useCallback(() => {
      bottomSheetModalRef.current?.expand()
    }, [bottomSheetModalRef])

    useHeader({headerShown: false})

    const handleBottomSheetModalChange = useCallback(
      (index: number) => {
        console.log(`[onChange] ${index} ${pathToOpen}`)
        if (pathToOpen && index < 0) {
          navigateWithChecklist(pathToOpen, {checklistId})
        } else {
          setPathToOpen(undefined)
        }
      },
      [checklistId, pathToOpen, setPathToOpen],
    )

    // useHeader({rightActionTitle: '완료', onRightPress: handleCompletePress})
    return (
      <GestureHandlerRootViewWrapper>
        {/* <BottomSheetModalProvider> */}
        <Screen>
          <Header
            leftComponent={
              <Text ellipsizeMode="tail" numberOfLines={1} h2>
                {checklistStore.title}
              </Text>
            }
            // centerComponent={<Text h2>{checklistStore.title}</Text>}
            rightComponent={
              <TouchableOpacity
                onPress={handleSettingsButtonPress}
                style={styles.headerRightButton}>
                <Icon name="settings" color="#333d4b" size={24} />
              </TouchableOpacity>
            }
            leftContainerStyle={styles.headerLeftContainer}
            rightContainerStyle={styles.headerRightContainer}
          />
          <ScrollView>
            <SectionList
              sections={checklistStore.incompleteChecklist}
              keyExtractor={item => item.title}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
            />
            <Divider />
            <View style={styles.sectionHeaderContainer}>
              <Text h3 style={styles.sectionHeaderText}>
                <Trans id="completedTasksTitle">완료했어요</Trans>
              </Text>
            </View>
            <SectionList
              sections={checklistStore.completedChecklist}
              keyExtractor={item => item.title}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
            />
          </ScrollView>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleBottomSheetModalChange}>
            <FlatList
              data={settingsMenu}
              renderItem={renderSettingsListItem}
              keyExtractor={item => item.title}
            />
          </BottomSheetModal>
          <ChecklistItemBottomSheet />
        </Screen>
        {/* </BottomSheetModalProvider> */}
      </GestureHandlerRootViewWrapper>
    )
  },
)

const styles = StyleSheet.create({
  headerLeftContainer: {
    flexGrow: 1,
    paddingLeft: 16,
    paddingRight: 24,
  },
  headerRightButton: {
    alignItems: 'center',
    borderRadius: 100, // 6.25rem converted to 100 for full circle
    justifyContent: 'center',
    padding: 8, // 0.5rem converted to px,
  },
  headerRightContainer: {
    flexBasis: 'auto',
    flexGrow: 0,
    paddingRight: 8,
  },
  sectionHeaderContainer: {
    paddingTop: 20,
  },
  sectionHeaderText: {
    paddingHorizontal: 20, // 1.25rem converted to px
    paddingVertical: 6, // 0.375rem converted to px
  },
})
