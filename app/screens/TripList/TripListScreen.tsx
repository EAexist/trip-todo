import { ActivityIndicator } from '@/components/ActivityIndicator'
import { useUserStore } from '@/models'
import { AuthenticatedStackScreenProps, goBack, navigate } from '@/navigators'
import { HeaderCenterTitle, useHeader } from '@/utils/useHeader'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LoadingScreen } from '../Loading/LoadingBoundary'
import { TripListScreenBase } from './TripListScreenBase'

export const TripListScreen: FC<
    AuthenticatedStackScreenProps<'TripList'>
> = ({}) => {
    return <TripListGuard />
}

const TripListGuard = observer(() => {
    const { activeTrip } = useUserStore()

    if (!activeTrip) {
        return (
            <LoadingScreen
                title={'잠시만 기다려 주세요'}
                activityIndicator={<ActivityIndicator />}
                fabTitle={'돌아가기'}
                onPressFab={() => goBack()}
                variant={'simple'}
            />
        )
    }

    useHeader({
        backgroundColor: 'secondary',
        rightActionTitle: '삭제',
        onRightPress: () => navigate('TripDelete'),
        centerComponent: <HeaderCenterTitle title={'여행 목록'} />,
    })

    return <TripListScreenBase />
})
