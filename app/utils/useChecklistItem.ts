import {useStores} from '@/models'
import {ChecklistItem} from '@/models/ChecklistItem'

export const useChecklistItem = ({
  params,
}: {
  params: {checklistItemId: string}
}) => {
  console.log(`[useChecklistItem] ${JSON.stringify(params)}`)
  const {checklistStore} = useStores()
  const {checklistItemId} = params
  return checklistStore.checklistItemMap.get(checklistItemId) as ChecklistItem
}
