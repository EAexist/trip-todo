import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {UserStoreModel, UserStoreSnapshot} from './UserStore'
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
    userStore: types.optional(UserStoreModel, {id: null}),
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
  })
  .actions(withSetPropAction)
  //   .actions(rootStore => ({
  //     fetchUserAccount: async () => {
  //       console.log('[RootStore] fetchUser()')
  //       if (rootStore.userStore.id) {
  //         const response = await api.getUserAccount(rootStore.userStore.id)
  //         if (response.kind === 'ok') {
  //           rootStore.setProp('userStore', response.data as UserStoreSnapshot)
  //         } else {
  //           console.error(`Error fetching User: ${JSON.stringify(response)}`)
  //         }
  //       }
  //     },
  //   }))
  .actions(rootStore => ({
    fetchTrip: async (tripId: string) => {
      console.log(`[RootStore.fetchTrip] tripId=${tripId}`)
      const response = await api.getTrip(tripId)
      if (response.kind === 'ok') {
        rootStore.setProp('tripStore', response.data as TripStoreSnapshot)
      } else {
        console.error(`Error fetching Trip: ${JSON.stringify(response)}`)
      }
    },
    async createTrip() {
      console.log('[RootStore] createTrip()')
      api.createTrip().then(async response => {
        console.log(
          `[RootStore] createTrip() response=${JSON.stringify(response)}`,
        )
        if (response.kind === 'ok') {
          console.log('changed')
          rootStore.setProp('tripStore', response.data as TripStoreSnapshot)
          await rootStore.userStore.fetchUserAccount()
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
