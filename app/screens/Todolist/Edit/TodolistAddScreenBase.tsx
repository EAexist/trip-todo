import {Avatar, AvatarProps} from '@/components/Avatar'
import BottomSheetModal, {
  GestureHandlerRootViewWrapper,
  useNavigationBottomSheet,
} from '@/components/BottomSheetModal'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import {AddPresetTodo, AddTodo, TodoBase} from '@/components/Todo'
import {useStores} from '@/models'
import {Todo, TodoSnapshotIn} from '@/models/Todo'
import {Preset} from '@/models/TripStore'
import {useNavigate} from '@/navigators'
import BottomSheet from '@gorhom/bottom-sheet'
import {ListItem} from '@rneui/themed'
import {Observer, observer} from 'mobx-react-lite'
import {ReactNode, RefObject, useCallback, useEffect, useRef} from 'react'
import {
  DefaultSectionT,
  FlatList,
  ListRenderItem,
  SectionListRenderItem,
  TextStyle,
  View,
} from 'react-native'
import CheckListEditScreenBase, {
  CheckListEditScreenBaseProps,
} from './TodolistEditScreenBase'

interface TodolistAddScreenBaseProps
  extends Pick<CheckListEditScreenBaseProps, 'title' | 'instruction'> {
  fab: ReactNode
  tripId: string
}

export const useAddFlaggedPreset = () => {
  const {tripStore} = useStores()
  const addFlaggedPreset = useCallback(async () => {
    await tripStore.addFlaggedPreset()
  }, [tripStore])
  return addFlaggedPreset
}

export const useHandleAddTodo = () => {
  const {tripStore} = useStores()
  const {navigateWithTrip} = useNavigate()
  const handleAddTodo = useCallback(
    async (todo: Partial<TodoSnapshotIn>) => {
      await tripStore.createCustomTodo(todo).then(todo => {
        if (todo)
          navigateWithTrip('TodoCreate', {
            todoId: todo?.id,
          })
      })
    },
    [tripStore.createCustomTodo],
  )
  return {
    handleAddTodo,
  }
}

export const TodolistAddScreenBase = observer(
  ({title, instruction, fab, tripId}: TodolistAddScreenBaseProps) => {
    const rootStore = useStores()
    const {tripStore} = rootStore

    useEffect(() => {
      async function fetchPreset() {
        if (tripStore.id === '') {
          await rootStore.fetchTrip(tripId)
        }
        await tripStore.fetchPreset()
      }
      fetchPreset().then(() => {
        console.log('[TodolistAddScreenBase] fetchPreset()')
      })
    }, [])

    const {handleAddTodo} = useHandleAddTodo()

    const renderItem: SectionListRenderItem<
      {todo?: Todo; preset?: Preset},
      DefaultSectionT
    > = ({item: {preset, todo}}) => (
      <Observer
        render={() =>
          preset ? (
            <AddPresetTodo preset={preset} key={preset?.item.id} />
          ) : (
            <AddTodo todo={todo as Todo} key={todo?.id} />
          )
        }
      />
    )

    /* BottomSheet */
    const bottomSheetRef = useRef<BottomSheetModal>(null)

    const renderSectionHeader = useCallback(
      ({section: {category, title}}: {section: DefaultSectionT}) => (
        <View>
          <ListSubheader lg title={title} />
          <TodoBase
            avatarProps={{icon: {name: 'plus'}}}
            titleStyle={$titleStyleHighlighted}
            {...(category === 'reservation'
              ? {
                  title: '예약 할 일 추가하기',
                  subtitle: '항공권 · 기차표 · 입장권',
                  onPress: () => {
                    bottomSheetRef.current?.present()
                  },
                }
              : {
                  title:
                    category === 'foreign'
                      ? '해외여행 할 일 추가하기'
                      : '짐 추가하기',
                  subtitle: '',
                  onPress: () => handleAddTodo({category, type: 'custom'}),
                })}
          />
        </View>
      ),
      [handleAddTodo, bottomSheetRef.current],
    )

    const keyExtractor = useCallback(
      (item: any) =>
        item.todo ? `todo-${item.todo.id}` : `preset-${item.preset.item.id}`,
      [],
    )

    return (
      <GestureHandlerRootViewWrapper>
        <CheckListEditScreenBase
          title={title}
          instruction={instruction}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          sections={tripStore.todolistWithPreset}
          keyExtractor={keyExtractor}>
          {fab}
          <ReservationTypeDropDownBottomSheet ref={bottomSheetRef} />
        </CheckListEditScreenBase>
      </GestureHandlerRootViewWrapper>
    )
  },
)

const ReservationTypeDropDownBottomSheet = ({
  ref,
}: {
  ref: RefObject<BottomSheetModal | null>
}) => {
  const {handleAddTodo} = useHandleAddTodo()

  const {useActiveKey, handleBottomSheetModalChange, activate} =
    useNavigationBottomSheet(ref)

  useActiveKey(activeKey =>
    handleAddTodo({category: 'reservation', type: activeKey}),
  )

  interface ReservationTypeOptionData extends Pick<TodoSnapshotIn, 'type'> {
    title: string
    avatarProps: AvatarProps
    isManaged?: boolean
  }

  const options: ReservationTypeOptionData[] = [
    {
      type: 'flight',
      title: '항공권',
      avatarProps: {iconId: '✈️', containerStyle: {backgroundColor: 'bisque'}},
    },
    // {
    //   type: 'train',
    //   title: '열차',
    //   avatarProps: {iconId: '🚅', containerStyle: {backgroundColor: 'bisque'}},
    // },
    {
      type: 'custom',
      title: '직접 입력',
      avatarProps: {iconId: '✏️', containerStyle: {backgroundColor: 'bisque'}},
    },
    {
      type: 'accomodation',
      title: '숙소 예약',
      avatarProps: {iconId: '🛌', containerStyle: {backgroundColor: 'bisque'}},
      isManaged: true,
    },
  ]

  const renderReservationTypeListItem: ListRenderItem<ReservationTypeOptionData> =
    useCallback(
      ({item}) => {
        const handlePress = () => activate(item.type)

        return (
          <ListItem
            onPress={handlePress}
            disabled={item.isManaged}
            useDisabledStyle={item.isManaged}>
            <Avatar
              //   size="medium"
              {...item.avatarProps}
            />
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron
              iconProps={item.isManaged ? {name: 'check'} : undefined}
            />
          </ListItem>
        )
      },
      [activate],
    )

  return (
    <BottomSheetModal ref={ref} onChange={handleBottomSheetModalChange}>
      <ContentTitle title={'무엇을 예약해야하나요?'} />
      <FlatList
        data={options}
        renderItem={renderReservationTypeListItem}
        keyExtractor={item => item.title}
      />
    </BottomSheetModal>
  )
}

const $titleStyleHighlighted: TextStyle = {
  fontWeight: 700,
}
