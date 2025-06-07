import {Screen} from '@/components'
import {ReorderChecklistItem} from '@/components/ChecklistItem'
import ContentTitle from '@/components/Layout/Content'
import {useStores} from '@/models'
import {ChecklistItem} from '@/models/ChecklistItem'
import {useNavigate} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {useCallback, useEffect} from 'react'
import Animated, {useAnimatedRef} from 'react-native-reanimated'
import type {
  SortableGridDragEndParams,
  SortableGridRenderItem,
} from 'react-native-sortables'
import Sortable from 'react-native-sortables'
import CheckListEditScreenBase from './ChecklistEditScreenBase'
import {DefaultSectionT, SectionListRenderItem} from 'react-native'
import {observer} from 'mobx-react-lite'

export const ReorderChecklist = observer(({category}: {category: string}) => {
  const scrollableRef = useAnimatedRef<Animated.ScrollView>()

  const {checklistStore} = useStores()

  const renderItem = useCallback<SortableGridRenderItem<ChecklistItem>>(
    ({item}) =>
      // <Sortable.Handle mode={item.isCompleted ? 'draggable' : 'draggable'}>
      item.isCompleted ? <></> : <ReorderChecklistItem item={item} />,
    // </Sortable.Handle>
    [],
  )

  const handleDragEnd = useCallback<
    (props: SortableGridDragEndParams<any>) => void
  >(
    ({indexToKey}) => {
      'worklet'
      checklistStore.reorder(category, indexToKey)
      // Your code here
    },
    [checklistStore, category],
  )

  return (
    <Animated.ScrollView ref={scrollableRef}>
      <Sortable.Grid
        columns={1}
        data={checklistStore.checklistItems.get(category) as ChecklistItem[]}
        renderItem={renderItem}
        scrollableRef={scrollableRef} // required for auto scroll
        overDrag="none"
        dragActivationDelay={100}
        onDragEnd={handleDragEnd}
        // autoScrollActivationOffset={75}
        // autoScrollSpeed={1}
        // autoScrollEnabled={true}
        // customHandle
      />
    </Animated.ScrollView>
  )
})

interface ChecklistReorderScreenProps {}

export const ChecklistReorderScreen = observer(
  (props: ChecklistReorderScreenProps) => {
    const {checklistStore} = useStores()
    const {navigateWithChecklist} = useNavigate()

    // Handler for the "완료" (Complete) button
    const handleToDeleteScreenPress = useCallback(() => {
      navigateWithChecklist('ChecklistDelete')
    }, [navigateWithChecklist])

    useEffect(() => {
      console.log(checklistStore.sections)
    }, [checklistStore])
    useHeader({
      rightActionTitle: '삭제',
      onRightPress: handleToDeleteScreenPress,
    })

    const renderItem: SectionListRenderItem<string> = ({item: category}) => (
      <ReorderChecklist category={category} />
    )

    return (
      <CheckListEditScreenBase
        title={'목록 순서 바꾸기'}
        instruction={'할 일이나 카테고리를 드래그해서 옮겨보세요'}
        renderItem={renderItem}
        sections={checklistStore.nonEmptysections}
      />
    )
  },
)
