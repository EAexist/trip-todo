import {AccomodationItemSnapshotIn} from '@/models/AccomodationItem'
import {ChecklistItemSnapshotIn} from '@/models/ChecklistItem'
import {ChecklistStoreSnapshot, Preset} from '@/models/ChecklistStore'

/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
// export interface EpisodeItem {
//   title: string
//   pubDate: string
//   link: string
//   guid: string
//   author: string
//   thumbnail: string
//   description: string
//   content: string
//   enclosure: {
//     link: string
//     type: string
//     length: number
//     duration: number
//     rating: {scheme: string; value: string}
//   }
//   categories: string[]
// }

// export interface ApiFeedResponse {
//   status: string
//   feed: {
//     url: string
//     title: string
//     link: string
//     author: string
//     description: string
//     image: string
//   }
//   items: EpisodeItem[]
// }

export interface ApiChecklistResponse
  extends Omit<ChecklistStoreSnapshot, 'id'> {
  id: number
  status: string
}

export interface ApiCreateChecklistResponse
  extends Omit<ChecklistStoreSnapshot, 'id'> {
  id: number
  status: string
}

export interface ApiChecklistItemResponse
  extends Omit<ChecklistItemSnapshotIn, 'id'> {
  id: number
  status: string
}
// export interface ApiChecklistItemListResponse
//   extends Omit<ChecklistItemSnapshotIn, 'id'> {
//   id: number
//   status: string
// }

export interface _ApiCreateChecklistResponse
  extends Omit<
    ChecklistStoreSnapshot,
    | 'startDateISOString'
    | 'endDateISOString'
    | 'checklistItems'
    | 'checklistItemMap'
    // | 'presetMap'
  > {
  startDate: string
  endDate: string
  checklistItems: ChecklistItemSnapshotIn[]
  // preset: Map<string, ChecklistItemSnapshotIn>
  status: string
}

export interface ApiPresetResponse {
  preset: Preset[]
  status: string
}

export interface ApiAccomodationResponse {
  //  Omit<ChecklistStoreSnapshot, 'startDate' | 'endDate'> {
  status: string
  items: (Omit<
    AccomodationItemSnapshotIn,
    | 'checkinDateISOString'
    | 'checkoutDateISOString'
    | 'checkinStartTimeISOString'
    | 'checkinEndTimeISOString'
    | 'checkoutTimeISOString'
  > & {
    checkinDate: string
    checkoutDate: string
    checkinStartTime: string
    checkinEndTime: string
    checkoutTime: string
  })[]
  // startDate: string
  // endDate: string
}
/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
