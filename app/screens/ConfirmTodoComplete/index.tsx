export {ConfirmFlightScreen as Flight} from './ConfirmFlightScreen'
export {ConfirmPassportScreen as Passport} from './ConfirmPassportScreen'

// import * as Fab from '@/components/Fab'
// import ContentTitle, {ContentTitleProps} from '@/components/Layout/Content'
// import {Screen} from '@/components/Screen'
// import {TransText} from '@/components/TransText'
// import {useStores} from '@/models'
// import { Todo } from '@/models/Todo'
// import {AppStackScreenProps} from '@/navigators'
// import {useTodo} from '@/utils/useTodo'
// import {observer} from 'mobx-react-lite'
// import {FC, useCallback} from 'react'

// interface ConfirmPassportScreenProps
//   extends AppStackScreenProps<'ConfirmPassport'> {}

// interface ConfirmReservationTodoScreenBaseProps extends AppStackScreenProps<'ConfirmReservationTodo'>, ContentTitleProps { todo: Todo }

// const ConfirmReservationTodoScreenBase: FC<ConfirmReservationTodoScreenBaseProps> = ({
//   title,
//   subtitle,
//   todo
// }) => {

//   const promiseBeforeNavigate = useCallback(async () => {
//     todo?.complete()
//   }, [todo])

//   return (
//     <Screen>
//       <ContentTitle title={title} subtitle={subtitle} />

//       <Fab.Container>
//         <Fab.GoBackButton
//           title={'확인했어요'}
//           promiseBeforeNavigate={promiseBeforeNavigate}
//         />
//         <Fab.GoBackButton color={'secondary'} title={'재발급하고 올게요'} />
//       </Fab.Container>
//     </Screen>
//   )
// }

// export const ConfirmPassportScreen: FC<ConfirmPassportScreenProps> = observer(
//   ({route}) => {
//     const {tripStore} = useStores()

//     const todo = useTodo(route)
//     const promiseBeforeNavigate = useCallback(async () => {
//       todo?.complete()
//     }, [todo])

//     const instruction =
//       '만료일이 해당 날짜 이전이라면\n여권을 재발급 받아야 해요.'

//     return (
//       <Screen>
//         <ContentTitle
//           title={
//             <>
//               <TransText h2>여권 만료일이</TransText>
//               <TransText h2 primary>
//                 {tripStore.passportExpiryRequiredAfterThisDate}
//               </TransText>
//               <TransText h2>이후인지 확인해주세요.</TransText>
//             </>
//           }
//           subtitle={instruction}
//         />

//         <Fab.Container>
//           <Fab.GoBackButton
//             title={'확인했어요'}
//             promiseBeforeNavigate={promiseBeforeNavigate}
//           />
//           <Fab.GoBackButton color={'secondary'} title={'재발급하고 올게요'} />
//         </Fab.Container>
//       </Screen>
//     )
//   },
// )

// export const ConfirmFlightScreen: FC<AppStackScreenProps<'ConfirmFlight'>> = ({
//   route,
// }) => {
//   const todo = useTodo(route)
//   const handleUploadPress = useCallback(() => {
//     // Handle next button press
//     console.log('Next button pressed')
//   }, [])

//   const handleSkipUploadAndConfirmPress = useCallback(() => {
//     todo?.complete()
//     goBack()
//   }, [todo])

//   const instruction =
//     '탑승권 발급과 좌석 선택을 미리 할 수 있도록 사전 체크인 알림을 보내드릴게요.'

//   return (
//     <Screen>
//       <ContentTitle
//         title={
//           <TransText h2>
//             {`${todo?.flightTitle} 항공권 `}
//             <TransText h2 primary>
//               예약 내역 화면을 캡쳐
//             </TransText>
//             {'해서 올려주세요.'}
//           </TransText>
//         }
//         subtitle={instruction}
//       />
//       <Fab.Container>
//         <Fab.Button onPress={handleUploadPress} title={'화면 캡쳐 올리기'} />
//         <Fab.Button
//           color={'secondary'}
//           onPress={handleSkipUploadAndConfirmPress}
//           title={'올리지 않고 할일 완료하기'}
//         />
//       </Fab.Container>
//     </Screen>
//   )
// }
