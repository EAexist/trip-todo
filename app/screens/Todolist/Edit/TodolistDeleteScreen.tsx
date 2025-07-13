import { Screen } from '@/components'
import ContentTitle from '@/components/Layout/Content'
import ListSubheader from '@/components/ListSubheader'
import { DeleteTodo } from '@/components/Todo'
import { useStores } from '@/models'
import { Todo } from '@/models/Todo'
import { goBack } from '@/navigators'
import { SectionTitle } from '@/screens/Main/TodolistScreen'
import { useHeader } from '@/utils/useHeader'
import { Divider } from '@rneui/themed'
import { Observer, observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { DefaultSectionT, ScrollView, SectionList, SectionListRenderItem, View } from 'react-native'

interface TodolistDeleteScreenProps { }

export const TodolistDeleteScreen = observer(
    () => {
        const { tripStore } = useStores()

        const handleCompletePress = useCallback(() => {
            tripStore.deleteTodos().then(() => {
                goBack()
            })
        }, [tripStore])

        const renderSectionHeader = useCallback(
            ({ section: { title } }: { section: DefaultSectionT }) => (
                <ListSubheader title={title} />
            ),
            [],
        )

        const renderItem: SectionListRenderItem<Todo, DefaultSectionT> = ({
            item,
        }) => <Observer render={() => <DeleteTodo todo={item} key={item?.id} />} />

        const keyExtractor = useCallback((item: any) => item.id, [])
        useHeader({ rightActionTitle: '완료', onRightPress: handleCompletePress })
        return (
            <Screen>
                <ContentTitle title={'할 일 삭제하기'} subtitle={'관리하지 않아도 되늗 할 일을 지울 수 있어요'} />
                {/* <Tab
                  value={activeTabIndex}
                  onChange={handleTabChange}
                  // indicatorStyle={tripStyles.TabIndicator}
                >
                  <FlatList
                    data={sections}
                    renderItem={({ item }) => (
                      <Tab.Item title={<Trans>{item.title}</Trans>} />
                    )}
                    keyExtractor={(item) => item.title}
                  />
                </Tab> */}
                <ScrollView>
                    <SectionList
                        sections={tripStore.deleteFlaggedIncompleteTrip}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        renderSectionHeader={renderSectionHeader}
                    />
                    {
                        (tripStore.completedTrip.length > 0) && (
                            <View>
                                <Divider />
                                <SectionTitle title={"완료했어요"} />
                                <SectionList
                                    sections={tripStore.deleteFlaggedCompletedTrip}
                                    keyExtractor={keyExtractor}
                                    renderItem={renderItem}
                                    renderSectionHeader={renderSectionHeader}
                                />
                            </View>
                        )
                    }
                </ScrollView>
            </Screen>
        )
    },
)