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
import {AccomodationTodo, CompleteTodo} from '@/components/Todo'
import {TodoBottomSheet} from '@/components/Todo/TodoModal'
import ListSubheader from '@/components/ListSubheader'
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {Todo} from '@/models/Todo'
import {AppStackScreenProps, useNavigate} from '@/navigators'
// import BottomSheet from '@gorhom/bottom-sheet'
import {useHeader} from '@/utils/useHeader'
import BottomSheet from '@gorhom/bottom-sheet'
import {Observer, observer} from 'mobx-react-lite'

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

export const TodolistScreen: FC<AppStackScreenProps<'Todolist'>> = observer(
  ({route}) => {
    const {tripStore} = useStores()
    const {tripId} = route.params
    const bottomSheetModalRef = useRef<BottomSheet>(null)
    const [pathToOpen, setPathToOpen] = useState<string | undefined>(undefined)
    const {navigateWithTrip} = useNavigate()

    useEffect(() => {
      tripStore.fetch(tripId).then(() => {
        console.log(tripStore)
      })
    }, [])

    const renderItem: SectionListRenderItem<Todo, DefaultSectionT> =
      useCallback(
        ({item}) => (
          <Observer
            render={() =>
              item.type === 'accomodation' ? (
                <AccomodationTodo item={item} />
              ) : item.type === 'passport' ? (
                <CompleteTodo item={item} />
              ) : (
                <CompleteTodo
                  item={item}
                  // onPress={() => handleTodoPress(item)}
                />
              )
            }
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
      {title: '할 일 추가', path: 'TodolistAdd', primary: true},
      {title: '목록 순서 변경', path: 'TodolistReorder'},
      {title: '목록에서 할 일 삭제', path: 'TodolistDelete'},
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
            navigateWithTrip(item.path)
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

    const handleBottomSheetModalChange = useCallback(
      (index: number) => {
        console.log(`[onChange] ${index} ${pathToOpen}`)
        if (pathToOpen && index < 0) {
          navigateWithTrip(pathToOpen, {tripId})
        } else {
          setPathToOpen(undefined)
        }
      },
      [tripId, pathToOpen, setPathToOpen],
    )

    useHeader({
      backButtonShown: false,
      leftComponent: (
        <TouchableOpacity style={{flexDirection: 'row'}}>
          <Text ellipsizeMode="tail" numberOfLines={1} h2>
            {tripStore.title}
          </Text>
          <TouchableOpacity
            onPress={handleSettingsButtonPress}
            style={styles.headerRightButton}>
            <Icon name="arrow-drop-down" color="#333d4b" size={24} />
          </TouchableOpacity>
        </TouchableOpacity>
      ),
      rightComponent: (
        <TouchableOpacity
          onPress={handleSettingsButtonPress}
          style={styles.headerRightButton}>
          <Icon name="settings" color="#333d4b" size={24} />
        </TouchableOpacity>
      ),
      leftContainerStyle: styles.headerLeftContainer,
      rightContainerStyle: styles.headerRightContainer,
    })
    return (
      <GestureHandlerRootViewWrapper>
        {/* <BottomSheetModalProvider> */}
        <Screen>
          <ScrollView>
            <SectionList
              sections={tripStore.incompleteTrip}
              keyExtractor={item => item.id}
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
              sections={tripStore.completedTrip}
              keyExtractor={item => item.title}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
            />
          </ScrollView>
          <FlatList
            data={settingsMenu}
            renderItem={renderSettingsListItem}
            keyExtractor={item => item.title}
          />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleBottomSheetModalChange}>
            <FlatList
              data={settingsMenu}
              renderItem={renderSettingsListItem}
              keyExtractor={item => item.title}
            />
          </BottomSheetModal>
          <TodoBottomSheet />
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
