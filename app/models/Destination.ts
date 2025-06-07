import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree'
import {withSetPropAction} from './helpers/withSetPropAction'

/**
 * This represents a Checklist
 */

export const DestinationModel = types
  .model('Destination')
  .props({
    id: types.identifier,
    nation: '',
    title: '',
    state: '',
    isFlaggedToDelete: false,
    isFlaggedToAdd: false,
  })
  .actions(withSetPropAction)
  .actions(item => ({
    setIncomplete() {
      item.setProp('isFlaggedToAdd', undefined)
    },
    toggleDeleteFlag() {
      item.setProp('isFlaggedToDelete', !item.isFlaggedToDelete)
    },
    toggleAddFlag() {
      item.setProp('isFlaggedToAdd', !item.isFlaggedToAdd)
    },
    // removeFavorite(Destination: Destination) {
    //   store.favorites.remove(checklistItem)
    // },
  }))
  .views(item => ({
    get parsedTitleAndSubtitle() {
      const defaultValue = {title: item.title?.trim(), subtitle: ''}

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return {title: titleMatches[1], subtitle: titleMatches[2]}
    },
  }))

export interface Destination extends Instance<typeof DestinationModel> {}
export interface DestinationSnapshotOut
  extends SnapshotOut<typeof DestinationModel> {}
export interface DestinationSnapshotIn
  extends SnapshotIn<typeof DestinationModel> {}
