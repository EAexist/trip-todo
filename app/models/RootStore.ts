import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {AuthenticationStoreModel} from './AuthenticationStore'
import {ChecklistStoreModel} from './ChecklistStore'
import {AccomodationStoreModel} from './AccomodationStore'

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model('RootStore').props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  checklistStore: types.optional(ChecklistStoreModel, {}),
  accomodationStore: types.optional(AccomodationStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
