import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {UserStoreModel} from './UserStore'
import {TripStoreModel, TripStoreSnapshot} from './TripStore'
import {TodoModel} from './Todo'
import {ReservationStoreModel} from './ReservationStore'
import {withSetPropAction} from './helpers/withSetPropAction'
import {api} from '@/services/api'

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model('RootStore')
  .props({
    userStore: types.optional(UserStoreModel, {}),
    tripStore: types.optional(TripStoreModel, {id: ''}),
    reservationStore: types.optional(ReservationStoreModel, {}),
    //   reservationStore: types.maybe(ReservationStoreModel),
    roundTripStore: types.optional(TodoModel, {
      id: '',
      type: 'flight',
      category: 'reservation',
      title: '',
      iconId: '✈️',
      note: '',
      isFlaggedToDelete: false,
      orderKey: -1,
      completeDateISOString: null,
      presetId: null,
      departure: null,
      arrival: null,
    }),
    //   accomodationStore: types.optional(AccomodationStoreModel, {}),
  })
  .actions(withSetPropAction)
  .actions(rootStore => ({
    fetchTrip: async (tripid: string) => {
      const response = await api.getTrip(tripid)
      if (response.kind === 'ok') {
        rootStore.setProp('tripStore', response.data as TripStoreSnapshot)
      } else {
        console.error(`Error fetching Trip: ${JSON.stringify(response)}`)
      }
    },
    async createTrip() {
      await api.createTrip().then(response => {
        if (response.kind === 'ok') {
          console.log('changed')
          rootStore.setProp('tripStore', response.data as TripStoreSnapshot)
        }
      })
    },
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
