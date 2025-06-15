import {AddTodo, AddPresetTodo, TodoBase} from '@/components/Todo'
import * as Fab from '@/components/Fab'
import ListSubheader from '@/components/ListSubheader'
import {useStores} from '@/models'
import {Preset} from '@/models/TripStore'
import {useNavigate} from '@/navigators'
import {Observer, observer} from 'mobx-react-lite'
import {useCallback, useEffect} from 'react'
import {
  DefaultSectionT,
  SectionListRenderItem,
  TextStyle,
  View,
} from 'react-native'
import CheckListEditScreenBase, {
  CheckListEditScreenBaseProps,
} from './TodolistEditScreenBase'
import {Todo} from '@/models/Todo'
interface TodolistAddScreenBaseProps
  extends Pick<CheckListEditScreenBaseProps, 'title' | 'instruction'> {
  nextButtonProps: Fab.NextButtonBaseProps
}

export const TodolistAddScreenBase = observer(
  ({title, instruction, nextButtonProps}: TodolistAddScreenBaseProps) => {
    const {tripStore} = useStores()
    const {navigateWithTrip} = useNavigate()

    useEffect(() => {
      async function fetchPreset() {
        await tripStore.fetchPreset()
      }
      console.log('[TodolistAddScreenBase] fetchPreset()')
      fetchPreset()
    }, [])

    const handlePressAddItem = useCallback(
      async (category: string) => {
        await tripStore.createCustomTodo(category).then(todo => {
          if (todo)
            navigateWithTrip('TodoCreate', {
              todoId: todo.id,
            })
        })
      },
      [tripStore, navigateWithTrip],
    )

    const renderItem: SectionListRenderItem<
      {todo?: Todo; preset?: Preset},
      DefaultSectionT
    > = ({item: {preset, todo}}) => (
      <Observer
        render={() =>
          preset ? (
            <AddPresetTodo preset={preset} />
          ) : (
            <AddTodo item={todo as Todo} />
          )
        }
      />
    )

    const renderSectionHeader = useCallback(
      ({section: {category, title}}: {section: DefaultSectionT}) => (
        <View>
          <ListSubheader lg title={title} />
          <TodoBase
            avatarProps={{icon: {name: 'plus'}}}
            title={
              category === 'reservation' ? '할 일 추가하기' : '직접 추가하기'
            }
            subtitle={
              category === 'reservation' ? '항공권 · 기차표 · 입장권' : ''
            }
            onPress={() => handlePressAddItem(category)}
            titleStyle={$titleStyleHighlighted}
          />
        </View>
      ),
      [handlePressAddItem],
    )

    const keyExtractor = useCallback(
      (item: any) =>
        item.todo ? `todo-${item.todo.id}` : `preset-${item.preset.item.id}`,
      [],
    )

    const handleNextPress = useCallback(async () => {
      await tripStore.addFlaggedPreset()
    }, [tripStore])

    return (
      <CheckListEditScreenBase
        title={title}
        instruction={instruction}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        sections={tripStore.todolistWithPreset}
        keyExtractor={keyExtractor}>
        <Fab.Container>
          <Fab.NextButton
            handlePressbeforeNavigate={handleNextPress}
            {...nextButtonProps}
          />
        </Fab.Container>
      </CheckListEditScreenBase>
    )
  },
)
const $titleStyleHighlighted: TextStyle = {
  fontWeight: 700,
}
