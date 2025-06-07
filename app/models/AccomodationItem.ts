import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree'
import {withSetPropAction} from './helpers/withSetPropAction'
import {getNightsParsed} from '@/utils/date'

/**
 * This represents a Accomodation
 */
export const AccomodationItemModel = types
  .model('AccomodationItem')
  .props({
    id: types.identifier,
    title: '',
    roomTitle: '',
    numberofClient: 1,
    clientName: '',
    checkinDateISOString: '',
    checkoutDateISOString: '',
    checkinStartTimeISOString: '',
    checkinEndTimeISOString: '',
    checkoutTimeISOString: '',
    // checkoutEndTime: types.maybe(types.Date),
    links: types.array(
      types.model({
        provider: '',
        url: '',
      }),
    ),
    note: '',
    type: '',
    region: '',
    isFlaggedToDelete: false,
    isFlaggedToAdd: false,
  })
  .actions(withSetPropAction)
  .actions(item => ({
    toggleDeleteFlag() {
      item.setProp('isFlaggedToDelete', !item.isFlaggedToDelete)
    },
    toggleAddFlag() {
      item.setProp('isFlaggedToAdd', !item.isFlaggedToAdd)
    },
    // removeFavorite(AccomodationItem: AccomodationItem) {
    //   store.favorites.remove(accomodationItem)
    // },
  }))
  .views(item => ({
    get checkinDate() {
      return new Date(item.checkinDateISOString)
    },
    get checkoutDate() {
      return new Date(item.checkoutDateISOString)
    },
    get checkinStartTime() {
      return new Date(item.checkinStartTimeISOString)
    },
    get checkinEndTime() {
      return new Date(item.checkinEndTimeISOString)
    },
    get checkoutTime() {
      return new Date(item.checkoutTimeISOString)
    },
    get detailTextList() {
      return {
        roomTitle: item.roomTitle,
        numberOfClient: item.numberofClient,
        clientName: item.clientName,
        checkinDate: this.checkinDate?.toLocaleDateString(),
        checkoutDate: this.checkoutDate?.toLocaleDateString(),
        checkinTimeString: `${this.checkinStartTime?.getTime()}~${this.checkinEndTime?.getTime()}`,
        checkoutTimeString: this.checkoutTime?.getTime(),
      }
    },
    get checkinDateParsed() {
      return formatter.format(this.checkinDate)
      //  ?.toLocaleDateString()
    },
    get checkoutDateParsed() {
      return formatter.format(this.checkoutDate)
      // return this.checkoutDate?.toLocaleDateString()
    },
    get checkinTimeParsed() {
      return `${timeFormatter.format(this.checkinStartTime)}~${timeFormatter.format(this.checkinEndTime)}`
    },
    get checkoutTimeParsed() {
      return timeFormatter.format(this.checkoutTime)
    },
    get nightsParsed() {
      return getNightsParsed(this.checkinDate, this.checkoutDate)
    },
  }))

const formatter = new Intl.DateTimeFormat('kr', {
  month: 'long',
  day: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('kr', {
  timeStyle: 'short',
  // hour: '2-digit',
  // minute: '2-digit',
})
export type AccomodationInfoProvider = string

export interface AccomodationItem
  extends Instance<typeof AccomodationItemModel> {}
export interface AccomodationItemSnapshotOut
  extends SnapshotOut<typeof AccomodationItemModel> {}
export interface AccomodationItemSnapshotIn
  extends SnapshotIn<typeof AccomodationItemModel> {}
