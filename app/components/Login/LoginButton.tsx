import { FC } from 'react'
import { Button, ButtonProps, Image } from '@rneui/themed'
import { ImageSourcePropType, Platform, StyleSheet } from 'react-native'

export const LoginButton: FC<ButtonProps & { symbolSource?: ImageSourcePropType }> = ({
    symbolSource,
    title,
    buttonStyle,
    titleStyle,
    ...props
}) => (
    <Button
        buttonStyle={[$loginButtonStyle.buttonStyle, buttonStyle]}
        titleStyle={[$loginButtonStyle.titleStyle, titleStyle]}
        {...props}>
        {
            (symbolSource !== undefined) &&
            <Image
                source={symbolSource}
                containerStyle={$loginButtonStyle.symbolContainerStyle}
                style={$loginButtonStyle.symbolStyle}
                resizeMode={'contain'}
            />
        }
        {title}
    </Button>
)

const $loginButtonStyle = StyleSheet.create(
    Platform.OS === 'android'
        ? {
            buttonStyle: {
                paddingHorizontal: 10,
                paddingRight: 12,
            },
            titleStyle: {
                flexGrow: 1,
                fontSize: 14,
            },
            symbolContainerStyle: {
                width: 20,
                height: 20,
                paddingLeft: 12,
                paddingRight: 10,
            },
            symbolStyle: { width: 20, height: 20 },
        }
        : {
            buttonStyle: {
                height: 40,
                borderRadius: 32,
                paddingVertical: 2,
                paddingHorizontal: 10,
                paddingRight: 16,
                // width: 400,
                // maxWidth: 400,
            },
            titleStyle: { flexGrow: 1, fontSize: 14 },
            symbolContainerStyle: {
                width: 20,
                height: 20,
                paddingLeft: 16,
                paddingRight: 12,
            },
            symbolStyle: { width: 20, height: 20 },
        },
)