import { useStores } from '@/models'
import { saveString } from '@/utils/storage'
import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
} from '@react-native-google-signin/google-signin'
import { ButtonProps } from '@rneui/themed'
import { FC, useCallback, useEffect } from 'react'
import { GoogleLoginButtonBase } from './GoogleLoginButton'

export const GoogleLoginButton: FC<ButtonProps> = props => {

    const { userStore } = useStores()

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '428235231680-j847tt5013n612lk39j8rjp6gih61fsd.apps.googleusercontent.com',
        })
    }, [])

    const handleGoogleLoginPress = useCallback(async () => {
        try {
            const { type, data } = await GoogleSignin.signIn()
            const idToken = data?.idToken
            if (type === 'success' && !!data.idToken) {
                userStore.googleLogin(data.user).then(() => {
                    saveString('googleIdToken', data?.idToken as string)
                })
            } else {
                // sign in was cancelled by user
                setTimeout(() => {
                    console.log('cancelled')
                }, 500)
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                console.log('error', error.message)
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        console.log(
                            'in progress',
                            'operation (eg. sign in) already in progress',
                        )
                        break
                    // case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    //   // android only
                    //   console.log('play services not available or outdated')
                    //   break
                    default:
                        console.log('Something went wrong: ', error.toString())
                }
                //   this.setState({
                //     error,
                //   })
            } else {
                alert(`an error that's not related to google sign in occurred`)
            }
        }
    }, [])

    return (
        <GoogleLoginButtonBase
            onPress={handleGoogleLoginPress}
            {...props}
        />
    )
}