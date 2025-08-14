import { Flight } from "@findmyflight/api";
import { DateUtils } from "@findmyflight/utils";
import { ActionIcon, Button, Fieldset, Group, Select, Stack, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useReducer, useState } from "react";

type GroupKeyExtractor = (f: Flight) => any
type GroupDescriptor = (groupKey: string) => string
type GroupingData = {
    // it returns the key used to aggregate the flights under the same
    // group in the Map object
    groupKeyExtractor: GroupKeyExtractor
    // It returns the group description to show starting from the group
    // key retrieved using groupKeyExtractor
    groupDescriptor: GroupDescriptor
}

type GroupingField = {
    label: string
    groupingData: GroupingData
}
type Ordering = 'Ascending' | 'Descending'
export type GroupingOption = {
    field: GroupingField
    order: Ordering
}

const oneWayGroupingFieldsMapData: [string, GroupingData][] = [
    // grouping by Price means putting all the price in the same groups and applying
    // the specified ordering
    ['Price (Only sort)', { 
        groupKeyExtractor: (f: Flight) => 0, 
        groupDescriptor: (groupKey: string) => '' 
    }],
    ['Departure Date', { 
        groupKeyExtractor: (f: Flight) => DateUtils.formatDateAsISO(f.departureDate),
        groupDescriptor: (groupKey: string) => DateUtils.formatDateLongForm(new Date(groupKey))
    }],
    ['Departure Airport', { 
        groupKeyExtractor: (f: Flight) => f.origin.name, 
        groupDescriptor: (groupKey: string) => groupKey
    }],
    ['Arrival Airport', { 
        groupKeyExtractor: (f: Flight) => f.destination.name,
        groupDescriptor: (groupKey: string) => groupKey
    }]
]
const ONEWAY_GROUPING_FIELDS: ReadonlyMap<string, GroupingData> = new Map(oneWayGroupingFieldsMapData)

function getGroupingFields(): ReadonlyMap<string, GroupingData> {
    return ONEWAY_GROUPING_FIELDS
}

// function stringedOption(option: GroupGroupingOption): string {
//     return `${option.grouping}-${option.sorting.field}`
// }

// // TODO: generalize to check for more general validation, like isGroupGroupingOptionAcceptable(newOptions)
// function isGroupGroupingOptionAcceptable(
//     currentOptions: GroupGroupingOption[],
//     newOption: GroupGroupingOption
// ): boolean {
//     let stringedNewOption = stringedOption(newOption)
//     return !currentOptions.map(opt => stringedOption(opt)).some(strOpt => strOpt === stringedNewOption)
// }

export default function FlightsSorter({ onSort }) {
    const [options, dispatch] = useReducer(optionsReducer, [] as GroupingOption[])
    const groupingFields = getGroupingFields()

    return (
        <Fieldset>
            <Stack align="center">
                <Text style={{ alignSelf: 'flex-start' }}>Group/Sort options</Text>

                {
                    options.map((option, i) => {
                        return (
                            <Group key={i}>
                                <ActionIcon radius="xl" onClick={() => dispatch({
                                    type: OptionActionType.Deleted,
                                    index: i
                                })}>
                                    <IconMinus />
                                </ActionIcon>

                                <Select placeholder="Sort by..."
                                    label="Sort by"
                                    data={Array.from(groupingFields.keys())}
                                    value={option.field.label}
                                    onChange={fieldName => {
                                        dispatch({
                                            type: OptionActionType.FieldChanged,
                                            index: i,
                                            changedField: fieldName
                                        })
                                    }}>
                                </Select>

                                <Select placeholder="Order by..."
                                    label="Order by"
                                    data={[
                                        {
                                            value: 'Ascending', label: 'Ascending (A → Z)'
                                        },
                                        {
                                            value: 'Descending', label: 'Descending (Z → A)'
                                        }
                                    ]}
                                    value={option.order}
                                    onChange={order => {
                                        dispatch({
                                            type: OptionActionType.OrderChanged,
                                            index: i,
                                            changedOrder: order as Ordering
                                        })
                                    }}>
                                </Select>
                            </Group>
                        )
                    })
                }

                <ActionIcon radius="xl" onClick={() => {
                    const defaultKey = groupingFields.keys().next().value
                    dispatch({
                        type: OptionActionType.Added,
                        newOption: {
                            field: {
                                label: defaultKey,
                                groupingData: groupingFields.get(defaultKey)
                            },
                            order: 'Ascending'
                        }
                    })
                }}>
                    <IconPlus />
                </ActionIcon>

                <Button mr="xl" style={{ alignSelf: 'flex-end' }} onClick={ onSort(options) }>Apply</Button>
            </Stack>
        </Fieldset>
    )
}

enum OptionActionType {
    Added,
    FieldChanged,
    OrderChanged,
    Deleted
}

type OptionAction = {
    type: OptionActionType.Added,
    newOption: GroupingOption
} | {
    type: OptionActionType.FieldChanged,
    index: number,
    changedField: string
} | {
    type: OptionActionType.OrderChanged,
    index: number,
    changedOrder: Ordering
} | {
    type: OptionActionType.Deleted,
    index: number
}

function optionsReducer(
    options: GroupingOption[],
    action: OptionAction
): GroupingOption[] {
    const actionType = action.type
    switch (actionType) {
        case OptionActionType.Added: {
            return [
                ...options,
                action.newOption,
            ]
        }
        case OptionActionType.FieldChanged: {
            return options.map((option, i) => {
                if (i === action.index) {
                    return {
                        field: {
                            label: action.changedField,
                            groupingData: getGroupingFields().get(action.changedField)
                        },
                        order: option.order
                    }
                }
                else {
                    return option;
                }
            })
        }
        case OptionActionType.OrderChanged: {
            return options.map((option, i) => {
                if (i === action.index) {
                    return {
                        field: option.field,
                        order: action.changedOrder
                    }
                }
                else {
                    return option;
                }
            })
        }
        case OptionActionType.Deleted: {
            return options.filter((option, i) => i !== action.index)
        }
        default: {
            throw Error('Unknown action type: ' + actionType)
        }
    }
}