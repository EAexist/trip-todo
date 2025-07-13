import { AppStackScreenProps, useNavigate } from '@/navigators'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect } from 'react'
import {
    TodolistAddScreenBase,
    useAddFlaggedPreset,
} from '../Todolist/Edit/TodolistAddScreenBase'
import * as Fab from '@/components/Fab'
import { useStores } from '@/models'
import { useHeader } from '@/utils/useHeader'

export const TodolistSettingScreen: FC<AppStackScreenProps<'TodolistSetting'>> =
    observer(({ route }) => {
        const { tripStore } = useStores()
        const { navigateWithTrip } = useNavigate()
        const addFlaggedPreset = useAddFlaggedPreset()

        const handlePressNext = useCallback(() => {
            addFlaggedPreset().then(async () => {
                await tripStore.initialize()
            })
        }, [])

        useEffect(() => {
            if (tripStore.isInitialized) {
                navigateWithTrip('Main', { screen: 'Todolist' })
            }
        }, [tripStore.isInitialized])

        useHeader({
            backNavigateProps: { name: 'TitleSetting' }
        })

        return (
            <TodolistAddScreenBase
                title={'새 할 일 추가하기'}
                instruction={'체크리스트에서 관리할 할 일을 추가해보세요'}
                tripId={route.params.tripId}
                fab={
                    <Fab.Container>
                        <Fab.Button title={'확인'} onPress={handlePressNext} />
                    </Fab.Container>
                }
                callerName='TodolistSetting'
            />
        )
    })
