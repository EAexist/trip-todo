// import React, {ReactElement, useState} from 'react'
// import {DraggableFlatListProps} from 'react-native-draggable-flatlist'
// import DragList from 'react-native-draglist'

// const SOUND_OF_SILENCE = ['hello', 'darkness', 'my', 'old', 'friend']

// export default function DraggableList<T>({
//   ...props
// }: DraggableFlatListProps<T>) {
//   const [data, setData] = useState(SOUND_OF_SILENCE)

//   function keyExtractor(str: string, _index: number) {
//     return str
//   }

//   // function renderItemInner(info: DragListRenderItemInfo<string>) {
//   //   const { item, onDragStart, onDragEnd, isActive } = info

//   //   return renderItem({
//   //     ...info,
//   //     getIndex: () => {
//   //       return 0
//   //     },
//   //     drag: () => {},
//   //   })
//   // }

//   async function onReordered(fromIndex: number, toIndex: number) {
//     const copy = [...data] // Don't modify react data in-place
//     const removed = copy.splice(fromIndex, 1)

//     copy.splice(toIndex, 0, removed[0]) // Now insert at the new pos
//     setData(copy)
//   }

//   return (
//     <DragList
//       renderItem={props =>
//         renderItem({
//           drag: props.onDragStart,
//           getIndex: () => undefined,
//           ...props,
//         }) as ReactElement
//       }
//       {...props}
//     />
//   )
// }
