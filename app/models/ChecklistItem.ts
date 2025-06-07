import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree'
import {withSetPropAction} from './helpers/withSetPropAction'

export const CATEGORY_TO_TITLE: {[key: string]: string} = {
  reservation: '예약',
  foreign: '해외여행',
  goods: '짐',
}

export const defaultChecklistItem = {
  type: '',
  category: '',
  title: '',
  iconId: '',
  note: '',
  isFlaggedToDelete: false,
}
/**
 * This represents a Checklist
 */
export const ChecklistItemModel = types
  .model('ChecklistItem')
  .props({
    id: types.identifier,
    type: types.string,
    category: types.string,
    title: types.string,
    iconId: types.string,
    note: types.string,
    completeDateISOString: types.maybe(types.string), // Ex: 2022-08-12 21:05:36
    isFlaggedToDelete: false,
    // isFlaggedToAdd: false,
  })
  .actions(withSetPropAction)
  .actions(item => ({
    complete() {
      item.setProp('completeDateISOString', new Date().toISOString())
    },
    setIncomplete() {
      item.setProp('completeDateISOString', undefined)
    },
    toggleDeleteFlag() {
      item.setProp('isFlaggedToDelete', !item.isFlaggedToDelete)
    },
    // removeFavorite(ChecklistItem: ChecklistItem) {
    //   store.favorites.remove(checklistItem)
    // },
  }))
  .views(item => ({
    get categoryTitle() {
      return CATEGORY_TO_TITLE[item.category]
    },
    get isCompleted() {
      return item.completeDateISOString !== undefined
    },
    get parsedTitleAndSubtitle() {
      const defaultValue = {title: item.title?.trim(), subtitle: ''}

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return {title: titleMatches[1], subtitle: titleMatches[2]}
    },
  }))

export interface ChecklistItem extends Instance<typeof ChecklistItemModel> {}
export interface ChecklistItemSnapshotOut
  extends SnapshotOut<typeof ChecklistItemModel> {}
export interface ChecklistItemSnapshotIn
  extends SnapshotIn<typeof ChecklistItemModel> {}
