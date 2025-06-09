import {
  AddTodo,
  AddPresetTodo,
  TodoBase,
} from '@/components/Todo'
import * as Fab from '@/components/Fab'
import ListSubheader from '@/components/ListSubheader'
import {useStores} from '@/models'
import {Preset} from '@/models/TripStore'
import {useNavigate} from '@/navigators'
import {observer} from 'mobx-react-lite'
import {useCallback} from 'react'
import {
  DefaultSectionT,
  SectionListRenderItem,
  TextStyle,
  View,
} from 'react-native'
import CheckListEditScreenBase, {
  CheckListEditScreenBaseProps,
} from './TodolistEditScreenBase'
interface TodolistAddScreenBaseProps
  extends Pick<CheckListEditScreenBaseProps, 'title' | 'instruction'> {
  nextButtonProps: Fab.NextButtonBaseProps
}

export const TodolistAddScreenBase = observer(
  ({title, instruction, nextButtonProps}: TodolistAddScreenBaseProps) => {
    const {tripStore} = useStores()
    const {navigateWithTrip} = useNavigate()

    const handlePressAddItem = useCallback(
      (category: string) => {
        tripStore.createTodo({category}).then(id => {
          navigateWithTrip('TodoCreate', {
            todoId: id,
          })
        })
      },
      [tripStore, navigateWithTrip],
    )

    const renderItem: SectionListRenderItem<
      {isPreset: boolean; preset: Preset},
      DefaultSectionT
    > = ({item}) =>
      item.isPreset ? (
        <AddPresetTodo preset={item.preset} />
      ) : (
        <AddTodo item={item.preset.item} />
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

    const handleNextPress = useCallback(async () => {
      tripStore.addFlaggedPreset()
    }, [tripStore])

    return (
      <CheckListEditScreenBase
        title={title}
        instruction={instruction}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        sections={tripStore.tripWithPreset}>
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
