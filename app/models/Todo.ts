import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import { withSetPropAction } from './helpers/withSetPropAction'

export const CATEGORY_TO_TITLE: { [key: string]: string } = {
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

export interface Location {
    name: string
    title: string
    nation: string
    region?: string
    iataCode?: string
}

export interface LocationPair {
    departure: Location
    arrival: Location
}

export const LocationModel = types.model('Location').props({
    name: types.string,
    title: types.string,
    nation: types.string,
    region: types.maybe(types.string),
    iataCode: types.maybe(types.string),
})

export const AirportModel = types.model('Airport').props({
    airportName: types.string,
    cityName: types.string,
    ISONationCode2Digit: types.string,
    iataCode: types.string,
})

export interface Airport {
    airportName: string
    cityName: string
    ISONationCode2Digit: string
    iataCode: string
}

export interface Flight {
    departure: Airport
    arrival: Airport
}

export const FlightModel = types
    .model('Flight')
    .props({
        departure: AirportModel,
        arrival: AirportModel,
    })

export const IconModel = types
    .model('Icon')
    .props({
        name: types.string,
        type: types.string,
    })

export interface Icon extends SnapshotOut<typeof IconModel> { }

export const PresetTodoContentModel = types.model('PresetTodoContent').props({
    id: types.identifier,
    type: types.string,
    category: types.string,
    title: types.string,
    icon: IconModel,
})

export interface PresetTodoContent
    extends Instance<typeof PresetTodoContentModel> { }
export interface PresetTodoContentSnapshotOut
    extends SnapshotOut<typeof PresetTodoContentModel> { }
export interface PresetTodoContentSnapshotIn
    extends SnapshotIn<typeof PresetTodoContentModel> { }

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
        // iconId: types.maybe(types.string),
        icon: IconModel,
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
        get flightTitleWithCode() {
            return item.departure
                ? `${item.departure?.title}${item.departure?.iataCode ? ` (${item.departure?.iataCode})` : ''} → ${item.arrival?.title || '목적지'}${item.arrival?.iataCode ? ` (${item.arrival?.iataCode})` : ''}`
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
            //   item.setProp('title', item.flightTitle)
        },
        setArrival(arrival: Location) {
            item.setProp('arrival', arrival)
            //   item.setProp('title', item.flightTitle)
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
            const defaultValue = { title: item.title?.trim(), subtitle: '' }

            if (!defaultValue.title) return defaultValue

            const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

            if (!titleMatches || titleMatches.length !== 3) return defaultValue

            return { title: titleMatches[1], subtitle: titleMatches[2] }
        },
    }))

export interface Todo extends Instance<typeof TodoModel> { }
export interface TodoSnapshotOut extends SnapshotOut<typeof TodoModel> { }
export interface TodoSnapshotIn extends SnapshotIn<typeof TodoModel> { }
