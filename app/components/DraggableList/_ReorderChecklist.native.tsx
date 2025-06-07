import DraggableFlatList, {
  DraggableFlatListProps,
} from 'react-native-draggable-flatlist'

export default function ReorderChecklist<T>(props: DraggableFlatListProps<T>) {
  const [listData, setListData] = useState(
    checklistStore.sectionedNonEmptyChecklistforDraggableFlatList,
  )

  const renderItem = useCallback(
    ({item, drag, isActive}: RenderItemParams<ChecklistItem> & {}) => {
      return (
        // <ScaleDecorator>
        <ReorderChecklistItem
          onLongPress={drag}
          disabled={isActive}
          {...item}
        />
        // </ScaleDecorator>
      )
    },
    [],
  )

  const renderDraggableFlatList: SectionListRenderItem<
    ChecklistItem[],
    DefaultSectionT
  > = useCallback(
    ({item, section}) => (
      <DraggableList
        data={item}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onDragEnd={({data}) => {
          const newSections = listData.map(s =>
            s.title === section.title ? {...s, data: [data]} : s,
          )
          setListData(newSections)
        }}
      />
    ),
    [],
  )
  return <DraggableFlatList {...props} />
}
