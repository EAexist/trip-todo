import {api} from '@/services/api'
import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {AccomodationItemModel} from './AccomodationItem'
import {withSetPropAction} from './helpers/withSetPropAction'
import {TripStoreModel} from './TripStore'

export const ReservationModel = types.model('Reservation').props({
  id: types.identifier,
  dateTimeISOString: types.string,
  type: types.string,
  title: types.string,
  link: types.maybeNull(types.string),
  imagePath: types.maybeNull(types.string),
  accomodation: types.maybeNull(AccomodationItemModel),
})
export interface Reservation extends Instance<typeof ReservationModel> {}
export interface ReservationSnapshot
  extends SnapshotOut<typeof ReservationModel> {}
export const ReservationStoreModel = types
  .model('ReservationStore')
  .props({
    // id: types.string,
    tripStore: types.maybe(types.reference(TripStoreModel)),
    reservations: types.array(ReservationModel),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    /**
     * Fetch a trip with given id.
     */
    async fetch() {
      if (store.tripStore) {
        const response = await api.getReservation(store.tripStore.id)
        if (response.kind === 'ok') {
          const data = response.data
          store.setProp('reservations', data.reservations)
        } else {
          console.error(
            `Error fetching Reservation: ${JSON.stringify(response)}`,
          )
        }
      }
    },
    addReservation(reservation: ReservationSnapshot) {
      store.reservations.push(reservation)
    },
    // syncOrderInCategory(category: string) {
    //   store.todolist.get(category)?.sort((a, b) => a.orderKey - b.orderKey)
    // },
  }))
  .actions(store => ({
    async addFlightTicket(imagePath: string) {
      console.log('[addFlightTicket]')
      if (!!store.tripStore) {
        const file = new File([], '')
        console.log('[addFlightTicket] Calling api')
        api.addFlightTicket(store.tripStore.id, file).then(response => {
          if (response.kind == 'ok') {
            store.reservations.push(response.data)
          }
        })
      }
    },
  }))
//   .actions(store => ())
export interface ReservationStore
  extends Instance<typeof ReservationStoreModel> {}
export interface ReservationStoreSnapshot
  extends SnapshotOut<typeof ReservationStoreModel> {}
