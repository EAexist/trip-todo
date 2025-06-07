import {Avatar} from '@/components/Avatar'
import BottomSheetModal, {
  GestureHandlerRootViewWrapper,
} from '@/components/BottomSheetModal'
import * as Fab from '@/components/Fab'
import {Input} from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {CATEGORY_TO_TITLE, ChecklistItem} from '@/models/ChecklistItem'
import {AppStackScreenProps, goBack, useNavigate} from '@/navigators'
import BottomSheet from '@gorhom/bottom-sheet'
import {ListItem} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {FC, useCallback, useRef, useState} from 'react'
import {
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

export const ChecklistItemCreateScreen: FC<
  AppStackScreenProps<'ChecklistItemCreate'>
> = observer(({route}) => {
  const {checklistStore} = useStores()
  const {checklistItemId} = route.params
  const item = checklistStore.checklistItemMap.get(
    checklistItemId,
  ) as ChecklistItem
  const [note, setNote] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const categoryBottomSheetModalRef = useRef<BottomSheet>(null)
  const iconBottomSheetModalRef = useRef<BottomSheet>(null)
  const {navigate} = useNavigate()

  const handleCompletePress = useCallback(() => {
    item.setProp('title', title)
    item.setProp('note', note)
    item.setProp('category', category)
    goBack()
  }, [item, title, note, category])

  const handleIconPress = useCallback(() => {
    goBack()
  }, [])

  const handleNotePress = useCallback(() => {
    console.log(`handleInputPress navigate to [ChecklistItemNote]`)
    navigate('ChecklistItemNote', {
      checklistItemId: item.id,
    })
  }, [navigate, item.id])

  const handleCategoryPress = useCallback(() => {
    categoryBottomSheetModalRef.current?.expand()
  }, [categoryBottomSheetModalRef])

  /* categoryMenu */
  type CategoryListItemData = {title: string; id: string}
  const categoryMenu: CategoryListItemData[] = [
    {title: '예약', id: 'reservation'},
    {title: '해외여행', id: 'foreign'},
    {title: '짐', id: 'goods'},
  ]

  const renderCategoryListItem: ListRenderItem<CategoryListItemData> =
    useCallback(
      ({item}) => {
        const handlePress = () => {
          console.log(
            `[bottomSheetModalRef.current] ${categoryBottomSheetModalRef.current}`,
          )
          setCategory(item.id)
          categoryBottomSheetModalRef.current?.close()
        }

        return (
          <ListItem onPress={handlePress}>
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron onPress={handlePress} />
          </ListItem>
        )
      },
      [categoryBottomSheetModalRef],
    )

  return (
    <GestureHandlerRootViewWrapper>
      <Screen>
        {/* <ListItem containerStyle={$listItemContainerStyle}>
        <Avatar iconId={item.iconId} size="xlarge" />
        <ListItem.Content>
          {true && (
            <ListItem.Subtitle>
              <Trans>{item.category}</Trans>
            </ListItem.Subtitle>
          )}
          <ListItem.Title>
            <TransText h2>{item.title}</TransText>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem> */}
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={handleIconPress}>
            <Avatar size={'xlarge'} iconId={'🧐'} />
          </TouchableOpacity>
        </View>
        <Input
          setValue={setTitle}
          value={title}
          label={'이름'}
          placeholder={'할 일 이름 입력'}
        />
        <TouchableOpacity onPress={handleCategoryPress}>
          <Input
            setValue={() => {}}
            value={CATEGORY_TO_TITLE[category]}
            placeholder={'카테고리 선택'}
            focusable={false}
            autoFocus={false}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNotePress}>
          <Input
            setValue={setNote}
            value={note}
            label={'메모'}
            placeholder={'메모 입력'}
            focusable={false}
            autoFocus={false}
          />
        </TouchableOpacity>
        <Fab.Container>
          <Fab.Button onPress={handleCompletePress} title={'확인'} />
        </Fab.Container>
        <BottomSheetModal
          ref={iconBottomSheetModalRef}
          // onChange={handleBottomSheetModalChange}
        >
          <ContentTitle title={'아이콘 선택'} />
          ICONS
          {/* <FlatList
            data={settingsMenu}
            renderItem={renderSettingsListItem}
            keyExtractor={item => item.title}
          /> */}
        </BottomSheetModal>
        <BottomSheetModal
          ref={categoryBottomSheetModalRef}
          // onChange={handleBottomSheetModalChange}
        >
          <ContentTitle title={'카테고리 선택'} />
          <FlatList
            data={categoryMenu}
            renderItem={renderCategoryListItem}
            keyExtractor={item => item.title}
          />
        </BottomSheetModal>
      </Screen>
    </GestureHandlerRootViewWrapper>
  )
})

const $listItemContainerStyle: ViewStyle = {
  height: 60,
}
