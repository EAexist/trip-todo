import {
  AddChecklistItem,
  AddPresetChecklistItem,
  ChecklistItemBase,
} from '@/components/ChecklistItem'
import * as Fab from '@/components/Fab'
import ListSubheader from '@/components/ListSubheader'
import {useStores} from '@/models'
import {Preset} from '@/models/ChecklistStore'
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
} from './ChecklistEditScreenBase'
interface ChecklistAddScreenBaseProps
  extends Pick<CheckListEditScreenBaseProps, 'title' | 'instruction'> {
  nextButtonProps: Fab.NextButtonBaseProps
}

export const ChecklistAddScreenBase = observer(
  ({title, instruction, nextButtonProps}: ChecklistAddScreenBaseProps) => {
    const {checklistStore} = useStores()
    const {navigateWithChecklist} = useNavigate()

    const handlePressAddItem = useCallback(
      (category: string) => {
        checklistStore.createChecklistItem({category}).then(id => {
          navigateWithChecklist('ChecklistItemCreate', {
            checklistItemId: id,
          })
        })
      },
      [checklistStore, navigateWithChecklist],
    )

    const renderItem: SectionListRenderItem<
      {isPreset: boolean; preset: Preset},
      DefaultSectionT
    > = ({item}) =>
      item.isPreset ? (
        <AddPresetChecklistItem preset={item.preset} />
      ) : (
        <AddChecklistItem item={item.preset.item} />
      )

    const renderSectionHeader = useCallback(
      ({section: {category, title}}: {section: DefaultSectionT}) => (
        <View>
          <ListSubheader lg title={title} />
          <ChecklistItemBase
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
      checklistStore.addFlaggedPreset()
    }, [checklistStore])

    return (
      <CheckListEditScreenBase
        title={title}
        instruction={instruction}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        sections={checklistStore.checklistWithPreset}>
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
