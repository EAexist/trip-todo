import {useStores} from '@/models'
import {Todo} from '@/models/Todo'
import {
  AppStackParamList,
  AppStackScreenProps,
  TodoAppStackParamList,
} from '@/navigators'
import {FC} from 'react'

export const withTodo = <T extends keyof TodoAppStackParamList>(
  WrappedComponent: FC<{todo: Todo; params?: Readonly<AppStackParamList[T]>}>,
) => {
  const Component: FC<AppStackScreenProps<T>> = ({route: {params}}) => {
    const {tripStore} = useStores()
    const todo = params?.todoId
      ? tripStore.todoMap.get(params?.todoId)
      : undefined
    return !!todo ? <WrappedComponent todo={todo} params={params} /> : <></>
  }
  return Component
}
