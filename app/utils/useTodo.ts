import {useStores} from '@/models'
import {Todo} from '@/models/Todo'

export const useTodo = ({
  params,
}: {
  params: {todoId: string}
}) => {
  console.log(`[useTodo] ${JSON.stringify(params)}`)
  const {tripStore} = useStores()
  const {todoId} = params
  return tripStore.todoMap.get(todoId) as Todo
}
