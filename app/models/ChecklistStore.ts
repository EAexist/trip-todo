import {
  getSnapshot,
  Instance,
  onAction,
  SnapshotOut,
  types,
} from 'mobx-state-tree'
import {api} from '../services/api'
import {
  CATEGORY_TO_TITLE,
  ChecklistItem,
  ChecklistItemModel,
  ChecklistItemSnapshotIn,
  defaultChecklistItem,
} from './ChecklistItem'
import {DestinationModel} from './Destination'
import {withSetPropAction} from './helpers/withSetPropAction'

export const PresetItemModel = types
  .model('Preset')
  .props({
    isFlaggedToAdd: types.boolean,
    item: types.reference(ChecklistItemModel),
  })
  .actions(withSetPropAction)
  .actions(presetItem => ({
    toggleAddFlag() {
      presetItem.setProp('isFlaggedToAdd', !presetItem.isFlaggedToAdd)
    },
  }))

export interface Preset extends Instance<typeof PresetItemModel> {}

export const ChecklistStoreModel = types
  .model('ChecklistStore')
  .props({
    id: '',
    title: '',
    destinations: types.array(DestinationModel),
    startDateISOString: types.maybe(types.string), // Ex: 2022-08-12 21:05:36
    endDateISOString: types.maybe(types.string), // Ex: 2022-08-12 21:05:36
    checklistItemMap: types.map(ChecklistItemModel),
    checklistItems: types.map(types.array(types.reference(ChecklistItemModel))),
    preset: types.array(PresetItemModel),
    activeItem: types.maybe(types.reference(ChecklistItemModel)),
    // _presets: types.model({
    //   reservation: types.array(ChecklistItemModel),
    //   foreign: types.array(ChecklistItemModel),
    //   goods: types.array(ChecklistItemModel),
    // }),
    // doSync: types.maybe(types.boolean),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    initalizeChecklistKeys() {
      // Array.from(store.checklistItemMap.values()).forEach(item =>
      //   store.checklistItems.push(item),
      // )
    },
    createItem(item: ChecklistItemSnapshotIn) {
      store.checklistItemMap.put(item)
      store.checklistItems.get(item.category)?.push(item.id)
    },
    addItem(item: ChecklistItemSnapshotIn) {
      store.checklistItems.get(item.category)?.push(item.id)
    },
    // _addItem(item: ChecklistItem) {
    //   store.checklistItemMap.put(item)
    //   store.checklistItems.push(item)
    // },
    // addPreset(preset: Preset) {
    //   store.preset.push({
    //     isFlaggedToAdd: preset.isFlaggedToAdd,
    //     item: preset.item.id,
    //   })
    // },
    set(checklist: ChecklistStoreSnapshot) {
      store.setProp('id', checklist.id)
      store.setProp('title', checklist.title)
      store.setProp('destinations', checklist.destinations)
      store.setProp('startDateISOString', checklist.startDateISOString)
      store.setProp('endDateISOString', checklist.endDateISOString)
      store.setProp(
        'checklistItemMap',
        checklist.checklistItemMap,
        // Object.fromEntries(
        //   checklist.checklistItems.map(item => [item.id, item]),
        // ),
      )
      store.setProp('checklistItems', checklist.checklistItems)
      /* Nested Object: UseSetProps */
      store.setProp('preset', checklist.preset)
    },
  }))
  .actions(store => ({
    add(item: ChecklistItemSnapshotIn) {
      store.checklistItemMap.put(item)
      store.addItem(item)
    },
  }))
  .actions(store => ({
    add(item: ChecklistItemSnapshotIn) {
      store.checklistItemMap.put(item)
      store.addItem(item)
    },
    /**
     * Create an empty checklist and fetch it with backend-generated id.
     */
    async create() {
      const response = (await api.createChecklist()) as ChecklistStoreSnapshot
      store.set(response)
    },
    /**
     * Create an empty checklist and fetch it with backend-generated id.
     */
    async fetch(id: string) {
      const response = await api.getChecklist(id)
      if (response.kind === 'ok') {
        store.set(response as ChecklistStoreSnapshot)
      } else {
        console.error(`Error fetching Checklist: ${JSON.stringify(response)}`)
      }
      console.log(store)
    },
    async put() {
      const response = (await api.putChecklist(
        getSnapshot(store),
      )) as ChecklistStoreSnapshot
      store.set(response)
    },
    // async fetchPreset() {
    //   const response = await api.getPreset('1')
    //   console.log(response)
    //   if (response.kind === 'ok') {
    //     response.preset.forEach(preset => {
    //       store.addItem(preset.item)
    //       store.addPreset(preset)
    //     })
    //     console.log(store.preset)
    //   } else {
    //     console.error(`Error fetching Checklist: ${JSON.stringify(response)}`)
    //   }
    // },
    async createChecklistItem(
      item: Partial<Omit<ChecklistItemSnapshotIn, 'id'>>,
    ) {
      const response = (await api.createChecklistItem(store.id, {
        ...defaultChecklistItem,
        ...item,
      })) as ChecklistItemSnapshotIn
      store.add(response)
      return response.id
    },
    setActiveItem(checklistItem?: ChecklistItem) {
      console.log('SETACTIVE', checklistItem?.title)
      store.setProp('activeItem', checklistItem ? checklistItem.id : undefined)
    },
    removeActiveItem() {
      // console.log('SETACTIVE', checklistItem?.title)
      store.setProp('activeItem', undefined)
    },
    remove(item: ChecklistItem) {
      store.checklistItems.get(item.category)?.remove(item)
      if (!store.preset.map(({item}) => item).includes(item))
        store.checklistItemMap.delete(item.id)
    },
    initializePreset() {
      // https://stackoverflow.com/questions/39007637/javascript-set-vs-array-performance
      // const usedPresets = new Set(data.map((item) => item.type))
      // const usedPreset = Array.from(store.checklistItems.values()).map(
      //   item => item.type,
      // )
      // const preset = presets.filter(
      //   item => !usedPreset.includes(item.type as string),
      // ).map(item=> {isFlaggedTo})
      // .map((item) => ({
      //   isPreset: true,
      //   ...item,
      // }))
      // store.setProp('preset', preset)
    },
    // flagToAdd(presetId: string) {
    //   if (!(presetId in store.addFlaggedPresetIds))
    //     store.addFlaggedPresetIds.push(presetId)
    //   else store.addFlaggedPresetIds.push(presetId)
    // },
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
      return store.destinations.length > 0
    },
    get destinationTitles() {
      return store.destinations.map(item => item.title)
      // return store.destinations.map((item) => item.title).join(', ')
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
      return Array.from(store.checklistItems.entries())
        .filter(([category, data]) => data.length > 0)
        .map(([category, _]) => ({
          category,
          title: CATEGORY_TO_TITLE[category],
          data: [category],
        }))
    },
    get sections() {
      return [
        ...new Set(
          Array.from(store.checklistItemMap.values()).map(
            item => item.category,
          ),
        ),
      ]
    },
    get sectionedChecklist() {
      return Array.from(store.checklistItems.entries()).map(
        ([category, data]) => ({
          category,
          title: CATEGORY_TO_TITLE[category],
          data,
        }),
      )
    },
    get sectionedNonEmptyChecklist() {
      return this.sectionedChecklist.filter(({data}) => data.length > 0)
    },
    get incompleteChecklist() {
      return this.sectionedNonEmptyChecklist.map(({title, data}) => {
        return {title, data: data.filter(item => !item.completeDateISOString)}
      })
    },
    get completedChecklist() {
      return this.sectionedNonEmptyChecklist
        .map(({title, data}) => {
          return {
            title,
            data: data.filter(item => !!item.completeDateISOString),
          }
        })
        .filter(({data}) => data.length > 0)
    },
    get deleteFlaggedChecklist() {
      return this.sectionedNonEmptyChecklist.map(({title, data}) => {
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
    get checklistWithPreset() {
      console.log(
        this.sections.map(category => {
          const addedItems = store.checklistItems.get(category)
          const addedItemIds = addedItems?.map(item => item.id) as string[]
          return {
            category,
            title: CATEGORY_TO_TITLE[category],
            data: addedItems
              ?.map(item => ({isPreset: false, preset: {item}}))
              .concat(
                store.preset
                  .filter(
                    ({item}) =>
                      item.category === category && !addedItems.includes(item),
                  )
                  // .filter(({item}) => )
                  .map(preset => {
                    console.log(preset.item.id, addedItemIds)
                    return {
                      isPreset: true,
                      preset,
                    }
                  }),
              ) as {isPreset: boolean; preset: Preset}[],
          }
        }),
      )
      return this.sections.map(category => {
        const addedItems = store.checklistItems.get(category)
        const addedItemIds = addedItems?.map(item => item.id) as string[]
        return {
          category,
          title: CATEGORY_TO_TITLE[category],
          data: addedItems
            ?.map(item => ({isPreset: false, preset: {item}}))
            .concat(
              store.preset
                .filter(
                  ({item}) =>
                    item.category === category && !addedItems.includes(item),
                )
                // .filter(({item}) => )
                .map(preset => {
                  console.log(preset.item.id, addedItemIds)
                  return {
                    isPreset: true,
                    preset,
                  }
                }),
            ) as {isPreset: boolean; preset: Preset}[],
        }
      })
    },
    get isActive() {
      return store.activeItem !== undefined
    },
    // get ChecklistForList() {
    //   return store.favoritesOnly ? store.favorites : store.Checklist
    // },
    // hasFavorite(item: ChecklistItem) {
    //   return store.favorites.includes(checklistItem)
    // },
  }))
  .actions(store => ({
    async deleteItems() {
      Array.from(store.checklistItemMap.values())
        .filter(item => item.isFlaggedToDelete)
        .forEach(item => {
          item.setProp('isFlaggedToDelete', false)
          store.remove(item)
        })
      store.put()
    },
    async addFlaggedPreset() {
      store.preset
        .filter(preset => preset.isFlaggedToAdd)
        .forEach(preset => {
          store.addItem(preset.item)
          preset.setProp('isFlaggedToAdd', false)
        })
      store.put()
    },
    async reorder(category: string, ids: string[]) {
      store.checklistItems.set(category, ids)
      store.put()
    },
    // setPreset() {
    //   store.setProp('_presets', [])
    // },
    // toggleFavorite(item: ChecklistItem) {
    //   if (store.hasFavorite(checklistItem)) {
    //     store.removeFavorite(checklistItem)
    //   } else {
    //     store.addFavorite(checklistItem)
    //   }
    // },
  }))

// reaction(()=>
// )

export interface ChecklistStore extends Instance<typeof ChecklistStoreModel> {}
export interface ChecklistStoreSnapshot
  extends SnapshotOut<typeof ChecklistStoreModel> {}
