import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {AuthenticationStoreModel} from './AuthenticationStore'
import {TripStoreModel} from './TripStore'
import {AccomodationStoreModel} from './AccomodationStore'

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model('RootStore').props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  tripStore: types.optional(TripStoreModel, {}),
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
