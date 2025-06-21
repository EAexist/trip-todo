import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {UserStoreModel} from './UserStore'
import {TripStoreModel} from './TripStore'

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model('RootStore').props({
  userStore: types.optional(UserStoreModel, {}),
  tripStore: types.optional(TripStoreModel, {}),
  //   accomodationStore: types.optional(AccomodationStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
