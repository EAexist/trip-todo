import {toCalendarString} from '@/utils/date'
import {eachDayOfInterval} from 'date-fns'
import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {api} from '../services/api'
import {
  AccomodationItemModel,
  AccomodationItemSnapshotIn,
} from './AccomodationItem'
import {Destination, DestinationModel} from './Destination'
import {withSetPropAction} from './helpers/withSetPropAction'
import {
  CATEGORY_TO_TITLE,
  PresetTodoContentModel,
  Todo,
  TodoModel,
  TodoSnapshotIn,
} from './Todo'
import {ka} from 'date-fns/locale'

export const PresetItemModel = types
  .model('Preset')
  .props({
    isFlaggedToAdd: types.boolean,
    item: PresetTodoContentModel,
  })
  .actions(withSetPropAction)
  .actions(presetItem => ({
    toggleAddFlag() {
      presetItem.setProp('isFlaggedToAdd', !presetItem.isFlaggedToAdd)
    },
  }))

export interface Preset extends Instance<typeof PresetItemModel> {}
export interface PresetSnapshotIn extends SnapshotOut<typeof PresetItemModel> {}

export const TripStoreModel = types
  .model('TripStore')
  .props({
    id: '',
    title: '',
    startDateISOString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
    endDateISOString: types.maybeNull(types.string), // Ex: 2022-08-12 21:05:36
    destination: types.array(DestinationModel),
    todoMap: types.map(TodoModel),
    todolist: types.map(types.array(types.reference(TodoModel))),
    activeItem: types.maybeNull(types.reference(TodoModel)),
    accomodation: types.map(AccomodationItemModel),
    preset: types.map(types.array(PresetItemModel)),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    addTodo(todo: TodoSnapshotIn) {
      store.todoMap.put(todo)
      store.todolist.get(todo.category)?.push(todo.id)
    },
    set(trip: TripStoreSnapshot) {
      store.setProp('id', trip.id)
      store.setProp('title', trip.title)
      store.setProp('destination', trip.destination)
      store.setProp('startDateISOString', trip.startDateISOString)
      store.setProp('endDateISOString', trip.endDateISOString)
      store.setProp(
        'todoMap',
        trip.todoMap,
        // Object.fromEntries(
        //   trip.todolist.map(item => [item.id, item]),
        // ),
      )
      store.setProp('todolist', trip.todolist)
      /* Nested Object: UseSetProps */
      store.setProp('preset', trip.preset)
    },
    setTodo(todo: TodoSnapshotIn) {
      store.todoMap.set(todo.id, todo)
    },
    /* Active Item Actions */
    setActiveItem(todo?: Todo) {
      console.log('SETACTIVE', todo?.title)
      store.setProp('activeItem', todo ? todo.id : undefined)
    },
    removeActiveItem() {
      store.setProp('activeItem', undefined)
    },
    _deleteTodo(todo: Todo) {
      store.todolist.get(todo.category)?.remove(todo)
      store.todoMap.delete(todo.id)
    },
    updatePreset() {
      const usedPresetIds = [
        ...new Set(
          Array.from(store.todoMap.values()).map(todo => todo.presetId),
        ),
      ]
        .filter(presetId => presetId != null)
        .map(presetId => presetId.toString())
      store.setProp(
        'preset',
        Object.fromEntries(
          Array.from(store.preset.entries())
            .map(([category, presets]) => [
              category,
              presets.filter(preset => !usedPresetIds.includes(preset.item.id)),
            ])
            .filter(([category, presets]) => presets.length > 0),
        ),
      )
      console.log('updatePreset')
    },
    syncOrderInCategory(category: string) {
      store.todolist.get(category)?.sort((a, b) => a.orderKey - b.orderKey)
    },
  }))
  .actions(store => ({
    add(todo: TodoSnapshotIn) {
      store.todoMap.put(todo)
      store.addTodo(todo)
    },
    async fetchPreset() {
      api.getTodoPreset(store.id).then(response => {
        if (response.kind == 'ok') {
          const map = new Map<string, PresetSnapshotIn[]>()
          response.data.forEach(preset => {
            if (!map.has(preset.category)) {
              map.set(preset.category, [])
            }
            map.get(preset.category)?.push({
              isFlaggedToAdd: false,
              item: preset,
            })
          })

          store.setProp('preset', Object.fromEntries(map.entries()))
          store.updatePreset()
        }
      })
    },
    syncOrder() {
      store.todolist.forEach((v, k) => {
        store.syncOrderInCategory(k.toString())
      })
    },
  }))
  .actions(store => ({
    /**
     * Trip CRUD Actions
     */
    /**
     * Create an empty trip and fetch it with backend-generated id.
     */
    async create() {
      const response = await api.createTrip()
      if (response.kind === 'ok') {
        store.setProp('id', response.data.id)
      }
    },
    /**
     * Fetch a trip with given id.
     */
    async fetch(id: string) {
      const response = await api.getTrip(id)
      if (response.kind === 'ok') {
        store.set(response.data as TripStoreSnapshot)
      } else {
        console.error(`Error fetching Trip: ${JSON.stringify(response)}`)
      }
      console.log(store)
    },
    /**
     * Patch(update) a trip.
     */
    async patch() {
      const response = await api.patchTrip(store as TripStore)
      if (response.kind == 'ok') {
        store.set(response.data as TripStoreSnapshot)
      }
    },

    /**
     * Todo CRUD Actions
     */
    /**
     * Create an empty todo and fetch it with backend-generated id.
     */
    async createCustomTodo(category: string) {
      const response = await api.createTodo({tripId: store.id, category})
      if (response.kind === 'ok') {
        const todo = response.data
        store.addTodo(todo)
        return todo
      }
    },
    /**
     * Create an empty todo and fetch it with backend-generated id.
     */
    // async createPresetTodo(presetId: string) {
    //   const response = await api.createTodo({tripId: store.id, presetId})
    //   if (response.kind === 'ok') {
    //     const todo = response.data
    //     store.addTodo(todo)
    //   }
    // },
    /**
     * Patch(update) a trip.
     */
    async patchTodo(todo: Todo) {
      const response = await api.patchTodo(store.id, todo)
      if (response.kind === 'ok') store.setTodo(todo)
    },
    /**
     * Delete a trip.
     */
    async deleteTodo(todo: Todo) {
      await api.deleteTodo(store.id, todo.id).then(({kind}) => {
        if (kind == 'ok') {
          store._deleteTodo(todo)
          console.log('[deleteTodo]', todo)
        }
      })
    },

    /* Preset Actions */

    // async fetchPreset() {
    //   const response = await api.getPreset('1')
    //   console.log(response)
    //   if (response.kind === 'ok') {
    //     response.preset.forEach(preset => {
    //       store.addTodo(preset.item)
    //       store.addPreset(preset)
    //     })
    //     console.log(store.preset)
    //   } else {
    //     console.error(`Error fetching Trip: ${JSON.stringify(response)}`)
    //   }
    // },

    /**
     * Destination CRUD Actions
     */
    /**
     * Create an empty destination and fetch it with backend-generated id.
     */
    async createDestination() {
      const {kind, ...destination} = await api.createDestination(store.id)
      if (kind === 'ok') {
        store.destination.push(destination as Destination)
      }
    },
    /**
     * Delete a destination.
     */
    async deleteDestination(destination: Destination) {
      api.deleteDestination(store.id, destination.id).then(({kind}) => {
        if (kind == 'ok') {
          store.destination.remove(destination)
        }
      })
    },
    /**
     * Create an empty accomodation and fetch it with backend-generated id.
     */
    async createAccomodation() {
      const response = await api.createAccomodation(store.id)
      if (response.kind === 'ok') {
        const accomodation = response.data as AccomodationItemSnapshotIn
        store.accomodation.put(accomodation)
      }
    },
    /**
     * Patch(update) a accomodation.
     */
    async patchAccomodation(accomodation: AccomodationItemSnapshotIn) {
      const response = await api.patchAccomodation(store.id, accomodation)
      if (response.kind === 'ok')
        store.accomodation.set(accomodation.id, accomodation)
    },
    /**
     * Delete a accomodation.
     */
    async deleteAccomodation(item: AccomodationItemSnapshotIn) {
      api.deleteAccomodation(store.id, item.id).then(({kind}) => {
        if (kind == 'ok') {
          store.accomodation.delete(item.id)
        }
      })
    },
  }))
  .views(store => ({
    // get preset() {
    //   return Array.from(store.preset.values())
    // },
    get startDate() {
      return store.startDateISOString
        ? new Date(store.startDateISOString)
        : undefined
    },
    get endDate() {
      return store.endDateISOString
        ? new Date(store.endDateISOString)
        : undefined
    },
    get isScheduleSet() {
      return this.startDate !== undefined
    },
    get isDestinationSet() {
      return store.destination.length > 0
    },
    get destinationTitles() {
      return store.destination.map(item => item.title)
      // return store.destination.map((item) => item.title).join(', ')
    },
    get passportExpiryRequiredAfterThisDate() {
      const daysPadding = 1
      const passportExpiryRequiredAfterThisDate = this.endDate?.setDate(
        this.endDate?.getDate() + daysPadding,
      )
      const date = this.endDate?.getDate()
      const month = this.endDate?.toLocaleDateString('en', {
        month: 'short',
      })
      const monthLocale = this.endDate?.toLocaleDateString(undefined, {
        month: 'short',
      })
      const year = this.endDate?.getFullYear()
      return `${date} ${monthLocale && `${monthLocale}/`}${month} ${year}`
    },
    get nonEmptysections() {
      return Array.from(store.todolist.entries())
        .filter(([category, data]) => data.length > 0)
        .map(([category, _]) => ({
          category,
          title: CATEGORY_TO_TITLE[category],
          data: [category],
        }))
    },
    get sections() {
      return [
        ...new Set([
          ...Array.from(store.todoMap.values()).map(item => item.category),
          ...(Array.from(store.preset.values()).flat() as Preset[]).map(
            preset => preset.item.category,
          ),
        ]),
      ]
    },
    get sectionedTrip() {
      return Array.from(store.todolist.entries()).map(([category, data]) => ({
        category,
        title: CATEGORY_TO_TITLE[category],
        data,
      }))
    },
    get sectionedNonEmptyTrip() {
      return this.sectionedTrip.filter(({data}) => data.length > 0)
    },
    get incompleteTrip() {
      return this.sectionedNonEmptyTrip.map(({title, data}) => {
        return {title, data: data.filter(item => !item.completeDateISOString)}
      })
    },
    get completedTrip() {
      return this.sectionedNonEmptyTrip
        .map(({title, data}) => {
          return {
            title,
            data: data.filter(item => !!item.completeDateISOString),
          }
        })
        .filter(({data}) => data.length > 0)
    },
    get deleteFlaggedTrip() {
      return this.sectionedNonEmptyTrip.map(({title, data}) => {
        // const completeData = data.sort((a, b) =>
        //   a.isFlaggedToDelete === b.isFlaggedToDelete
        //     ? 0
        //     : b.isFlaggedToDelete
        //       ? -1
        //       : 1,
        // )
        return {
          title,
          data: data.toSorted((a, b) =>
            a.isFlaggedToDelete === b.isFlaggedToDelete
              ? 0
              : b.isFlaggedToDelete
                ? -1
                : 1,
          ),
        }
      })
    },
    get todolistWithPreset() {
      return this.sections.map(category => {
        const addedItems = store.todolist.get(category)
        // const addedItemIds = addedItems?.map(item => item.id) as string[]
        return {
          category,
          title: CATEGORY_TO_TITLE[category],
          data: [
            ...((addedItems?.map(item => ({
              todo: item,
            })) as {todo?: Todo; preset?: Preset}[]) || []),
            ...(store.preset.get(category)?.map(preset => ({
              preset,
            })) || []),
          ],
        }
      })
    },
    get isActive() {
      return store.activeItem !== undefined
    },
  }))
  .views(store => ({
    get orderedItems() {
      console.log(store.accomodation.values())
      return [...store.accomodation.values()].sort(
        (a, b) => a.checkinDate.getDate() - b.checkinDate.getDate(),
      )
    },
    get indexedUniqueTitles() {
      return [...new Set(this.orderedItems.map(item => item.title))]
    },
    get calendarMarkedDateEntries() {
      return this.orderedItems
        .map(item => {
          const start = item.checkinDate
          const end = item.checkoutDate
          console.log(start, end)
          const intervalDays = eachDayOfInterval({start, end}).slice(0, -1)
          return intervalDays.map((date, index) => [
            toCalendarString(date),
            {
              startingDay: index === 0,
              endingDay: index === intervalDays.length - 1,
              selected: true,
              colorIndex: this.indexedUniqueTitles.indexOf(item.title),
            },
          ])
        })
        .flat() as [
        string,
        {
          startingDay: boolean
          endingDay: boolean
          selected: boolean
          colorIndex: number
        },
      ][]
    },
  }))
  .actions(store => ({
    async deleteTodos() {
      await Promise.all(
        Array.from(store.todoMap.values())
          .filter(item => item.isFlaggedToDelete)
          .map(store.deleteTodo),
      )
    },
    async addFlaggedPreset() {
      await Promise.all(
        (Array.from(store.preset.values()).flat() as Preset[])
          .filter(preset => preset.isFlaggedToAdd)
          .map(async preset => {
            const response = await api.createTodo({
              tripId: store.id,
              presetId: preset.item.id,
            })
            if (response.kind === 'ok') {
              const todo = response.data
              store.addTodo(todo)
            }
            preset.setProp('isFlaggedToAdd', false)
          }),
      )
      store.syncOrder()
    },
    async reorder(category: string, keyToIndex: Record<string, number>) {
      await Promise.all(
        Object.entries(keyToIndex).map(([todoId, index]) => {
          const todo = store.todoMap.get(todoId) as Todo
          todo.setProp('orderKey', index)
          store.patchTodo(todo)
        }),
      )
      store.syncOrder()
    },
    // setPreset() {
    //   store.setProp('_presets', [])
    // },
    // toggleFavorite(item: Todo) {
    //   if (store.hasFavorite(todo)) {
    //     store.removeFavorite(todo)
    //   } else {
    //     store.addFavorite(todo)
    //   }
    // },
  }))
export interface TripStore extends Instance<typeof TripStoreModel> {}
export interface TripStoreSnapshot extends SnapshotOut<typeof TripStoreModel> {}
