import {createTheme} from '@rneui/themed'

const colorTheme = createTheme({
  lightColors: {
    // background:
    primary: '#006FFD',
    light0: '#2272EB',
    light1: '#E2EEFF',
    secondary: '#F2F3F5',
    black: '#333D4B',
    text: {
      primary: '#333D4B',
      secondary: '#6B7684',
    },
    contrastText: {
      primary: 'white',
      secondary: '#4E5968',
    },
    grey0: '#F2F4F6',
    grey1: '#D1D6DB',
    divider: '#F2F4F6',
    transparent: 'transparent',
  },
})

const theme = createTheme({
  ...colorTheme,
  components: {
    Avatar: (props, {colors}) => ({
      containerStyle: {
        backgroundColor: '#F5F5F7',
        ...(props.rounded
          ? {}
          : {
              borderRadius: 10,
            }),
        ...(props.size === 'medium'
          ? {
              width: 32,
              height: 32,
            }
          : props.size === 'large'
            ? {
                width: 40,
                height: 40,
              }
            : props.size === 'xlarge'
              ? {
                  width: 60,
                  height: 60,
                }
              : {
                  width: 32,
                  height: 32,
                }),
        // min-width: 32,
        // min-height: 32,
      },
      icon: {
        color: colors.primary,
      },
      iconStyle: {
        borderRadius: 10,
        ...(props.size === 'medium'
          ? {
              width: 20,
              height: 20,
            }
          : props.size === 'xlarge'
            ? {
                width: 40,
                height: 40,
              }
            : {
                // width: 32,
                // height: 32,
              }),
        // min-width: 32,
        // min-height: 32,
      },
      titleStyle: {
        borderRadius: 10,
        ...(props.size === 'medium'
          ? {
              fontSize: 20,
            }
          : props.size === 'xlarge'
            ? {
                fontSize: 40,
              }
            : {
                // width: 32,
                // height: 32,
              }),
        // min-width: 32,
        // min-height: 32,
      },
    }),
    Text: (props, {colors}) => ({
      style: {
        color: props.primary ? colors.primary : colors.text.primary,
        fontSize: 17,
        fontFamily: 'Pretendard',
        fontWeight: 400,
        fontStyle: 'normal',
        lineHeight: 1.5 * 17,
        letterSpacing: 0.15,
        // textDecoration: 'none',
        textTransform: 'none',
        ...(props.disabled ? {opacity: 0.5} : {}),
      },
      h2Style: {
        fontSize: 21,
        fontWeight: 700,
        lineHeight: 1.6 * 21,
        letterSpacing: 0,
        textTransform: 'none',
      },
      h3Style: {
        fontSize: 17,
        fontWeight: 700,
        lineHeight: 1.33 * 21,
        letterSpacing: 0,
        textTransform: 'none',
        color: '#212121',
      },
    }),
    Button: ({color}, {colors}) => ({
      titleStyle: {
        fontFamily: 'Pretendard',
        fontSize: 17,
        fontWeight: 600,
        lineHeight: 1.41 * 17,
        ...(color === 'primary'
          ? {color: colors.contrastText.primary}
          : color === 'secondary'
            ? {color: colors.contrastText.secondary}
            : {}),
      },
      buttonStyle: {
        borderRadius: 16,
        height: 56,
      },
    }),
    Header: (props, {colors}) => ({
      elevated: false,
      containerStyle: {
        // backgroundColor: colors.white,
        backgroundColor: 'bisque',
        borderBottomWidth: 0,
        height: 48,
        paddingHorizontal: 8,
      },
      leftContainerStyle: {
        justifyContent: 'center',
        paddingLeft: 4,
      },
      centerContainerStyle: {
        flexGrow: 0,
      },
      rightContainerStyle: {
        // flexDirection: 'row',
        // alignItems: 'stretch',
        // justifyContent: 'flex-end',
        // flex: 1,
        justifyContent: 'center',
        // height: '100%',
        // justifyContent: ''
        // alignItems: '',
        // flexGrow: 0,
        // alignItems: 'center',
      },
    }),
    Icon: (props, {colors}) => ({
      color: colors.primary,
    }),
    SectionHeader: props => ({
      style: {
        paddingTop: 24,
        paddingBottom: 8,
        paddingHorizontal: 20,
      },
      titleStyle: props.lg
        ? {
            // color: colors.text.primary,
          }
        : {
            fontWeight: 500,
            fontSize: 17,
            lineHeight: 1.43 * 17,
          },
    }),
    ListSubheader: (props, {colors}) => ({
      style: {
        height: props.lg ? 64 : 40,
        paddingTop: 12,
        paddingHorizontal: 20,
      },
      titleStyle: props.lg
        ? {
            fontWeight: 600,
            fontSize: 19,
            letterSpacing: 0.01,
            // color: var(-text--secondary),
          }
        : {
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: 0.01,
            color: colors.text?.secondary,
          },
    }),
    Divider: (_, {colors}) => ({
      width: 16,
      color: colors.divider,
      style: {
        height: 28,
        paddingHorizontal: 20,
      },
    }),
    Input: ({primary, label}, {colors}) => ({
      containerStyle: {
        paddingHorizontal: 20,
        // height: 92
        // paddingVertical: 14,
        // width: '100%',
        // borderBottomWidth: 1,
        // borderColor: colors.light0,
      },
      inputContainerStyle: {
        // paddingTop: label ? 0 : 12,
        borderBottomWidth: 2,
        borderColor: primary ? colors.primary : colors.grey0,
      },
      // inputContainerStyle: {},
      inputStyle: {
        fontFamily: 'Pretendard',
        fontWeight: 600,
        fontSize: 21,
        lineHeight: 1.6 * 22,
        color: colors.text.primary,
        outlineStyle: 'none',
        // fontWeight: 400,
        // fontSize: 15,
        // lineHeight: 1.6 * 15,
      },
      labelStyle: {
        fontFamily: 'Pretendard',
        fontWeight: 500,
        fontSize: 12,
        lineHeight: 1 * 12,
        letterSpacing: 0.01,
        color: primary ? colors.light0 : colors.text.secondary,
      },
      // cursorColor: colors.primary,
      // selectionColor: colors.primary,
      // placeholderTextColor: colors.text.primary,
      // leftIconContainerStyle: {
      //   paddingRight: 8,
      // },
    }),
    ListItem: props => ({
      style: {
        ...(props.useDisabledStyle ? {opacity: 0.5} : {}),
      },
      containerStyle: {
        // backgroundColor: colorTheme.lightColors?.disabled,
        height: 52,
        borderRadius: 16,
        paddingHorizontal: 20, // 1.5rem
        paddingVertical: 0, // ListItem has default vertical padding, overriding here
        // flexDirection: 'row',
        // gap: 12,
        alignItems: 'center',
      },
    }),
    ListItemTitle: (props, {colors}) => ({
      style: {
        display: 'flex',
        fontFamily: 'Pretendard',
        fontWeight: 500,
        fontSize: 17,
        lineHeight: 1.43 * 17,
        overflow: 'hidden',
        ...(props.primary ? {color: colors.primary} : {}),
      },
      numberOfLines: 1,
      ellipsizeMode: 'tail',
    }),
    ListItemSubtitle: (_, {colors}) => ({
      style: {
        fontFamily: 'Pretendard',
        color: colors.text.secondary,
        fontWeight: 400,
        fontSize: 12,
        letterSpacing: 0.17,
        lineHeight: 1 * 12,
        textOverflow: 'ellipsis',
      },
      numberOfLines: 1,
      ellipsizeMode: 'tail',
    }),
    ListItemChevron: ({primary}, {colors}) => ({
      size: 32,
      color: primary ? colors.primary : colors.text.secondary,
    }),
    ListItemCheckBox: (_, {colors}) => ({
      containerStyle: {
        width: 32,
        alignItems: 'center',
      },
    }),
    TabItem: (_, {colors}) => ({
      containerStyle: {
        backgroundColor: colors.white,
        paddingVertical: 16,
        width: '33.33%',
      },
      titleStyle: (active: boolean) => ({
        color: active ? colors.text.primary : colors.text.secondary,

        fontSize: 17,
      }),
    }),
    // FAB: {
    //   containerStyle: {
    //     backgroundColor: '#ffffff',
    //     width: '100%',
    //   },
    //   style: {
    //     backgroundColor: '#006ffd',
    //     borderRadius: 1 * 16,
    //     paddingHorizontal: 1.375 * 16,
    //     paddingVertical: 1 * 16,
    //     width: '100%',
    //   },
    //   titleStyle: {
    //     color: '#ffffff',
    //     fontSize: 17,
    //     lineHeight: 1.5 * 16,
    //     textAlign: 'left',
    //   },
    // },
  },
})

export default theme
