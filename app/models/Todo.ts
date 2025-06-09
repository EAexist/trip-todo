import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree'
import {withSetPropAction} from './helpers/withSetPropAction'

export const CATEGORY_TO_TITLE: {[key: string]: string} = {
  reservation: '예약',
  foreign: '해외여행',
  goods: '짐',
}

export const defaultTodo = {
  type: '',
  category: '',
  title: '',
  iconId: '',
  note: '',
  isFlaggedToDelete: false,
}
/**
 * This represents a Trip
 */
export const TodoModel = types
  .model('Todo')
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
    // removeFavorite(Todo: Todo) {
    //   store.favorites.remove(todo)
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

export interface Todo extends Instance<typeof TodoModel> {}
export interface TodoSnapshotOut
  extends SnapshotOut<typeof TodoModel> {}
export interface TodoSnapshotIn
  extends SnapshotIn<typeof TodoModel> {}
