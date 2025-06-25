import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree'
import {withSetPropAction} from './helpers/withSetPropAction'

export const CATEGORY_TO_TITLE: {[key: string]: string} = {
  reservation: '예약',
  foreign: '해외여행',
  goods: '짐',
}

// export const defaultTodo : TodoModel = {
//   id: '',
//   type: '',
//   category: '',
//   title: '',
//   iconId: '',
//   note: '',
//   completeDateISOString: null, // Ex: 2022-08-12 21:05:36
//   isFlaggedToDelete: false,
//   orderKey: -1,
//   presetId: -1,
// }

export const PresetTodoContentModel = types.model('PresetTodoContent').props({
  id: types.identifier,
  type: types.string,
  category: types.string,
  title: types.string,
  iconId: types.string,
})

export interface PresetTodoContent
  extends Instance<typeof PresetTodoContentModel> {}
export interface PresetTodoContentSnapshotOut
  extends SnapshotOut<typeof PresetTodoContentModel> {}
export interface PresetTodoContentSnapshotIn
  extends SnapshotIn<typeof PresetTodoContentModel> {}

export const LocationModel = types.model('Location').props({
  iataCode: types.string,
  name: types.string,
  title: types.string,
})

export interface Location {
  iataCode: string
  name: string
  title: string
}

export interface LocationPair {
  departure: Location
  arrival: Location
}
// export const AirhubPairModel = types.model('AirhubPair').props({
//   departure: types.maybe(AirhubModel),
//   arrival: types.maybe(AirhubModel),
// })

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
    completeDateISOString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
    isFlaggedToDelete: false,
    orderKey: types.number,
    presetId: types.maybeNull(types.number),
    departure: types.maybeNull(LocationModel),
    arrival: types.maybeNull(LocationModel),
    // isFlaggedToAdd: false,
  })
  .actions(withSetPropAction)
  .views(item => ({
    get flightTitle() {
      return item.departure
        ? `${item.departure?.title} → ${item.arrival?.title || '목적지'}`
        : ''
    },
  }))
  .actions(item => ({
    complete() {
      item.setProp('completeDateISOString', new Date().toISOString())
    },
    setIncomplete() {
      item.setProp('completeDateISOString', '')
    },
    toggleDeleteFlag() {
      item.setProp('isFlaggedToDelete', !item.isFlaggedToDelete)
    },
    setDeparture(departure: Location) {
      item.setProp('departure', departure)
      item.setProp('title', item.flightTitle)
    },
    setArrival(arrival: Location) {
      item.setProp('arrival', arrival)
      item.setProp('title', item.flightTitle)
    },
  }))
  .views(item => ({
    get categoryTitle() {
      return CATEGORY_TO_TITLE[item.category]
    },
    get isCompleted() {
      return item.completeDateISOString !== ''
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
export interface TodoSnapshotOut extends SnapshotOut<typeof TodoModel> {}
export interface TodoSnapshotIn extends SnapshotIn<typeof TodoModel> {}
