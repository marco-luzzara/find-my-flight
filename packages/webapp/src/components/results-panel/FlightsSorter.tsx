'use client'

import { ActionIcon, Button, Fieldset, Group, Select, Stack, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useReducer, useState } from "react";

import { Flight } from "@findmyflight/api";
import { ArrayUtils, DateUtils } from "@findmyflight/utils";


export type FlightsList = {
    type: 'flights-list'
    content: Flight[]
}

export type FlightsGroupContainer = {
    type: 'flights-group-container'
    groupByField: string
    content: FlightsGroup[]
}

export type FlightsGroup = {
    type: 'flights-group'
    description: string
    content: FlightsList | FlightsGroupContainer
}


/**
 * Build a data structure that reflects the groupby and sortby operations specified by the
 * groupingOptions and applied on the flights. The data structure can have multiple levels of
 * nesting

// simplest case with no grouping
{
    "type": "flights-list",
    "content": [
        { "flight": 1 },
        { "flight": 2 }
    ]
} |
// one grouping option, where each group contain a flights-list
{
    "type": "flights-group-container",
    "groupByField": "Departure Airport"
    "content": [
        {
            "type": "flights-group",
            "description": "Departure: DDD",
            "content": {
                "type": "flights-list",
                "content": [
                    { "flight": 1 },
                    { "flight": 2 }
                ]
            }
        }
    ]
} |
{
    "type": "flights-group-container",
    "groupByField": "Departure Airport"
    "content": [
        {
            "type": "flights-group",
            "description": "Departure: DDD",
            "content": {
                "type": "flights-group-container",
                "groupByField": "Departure Date"
                "content": [
                    {
                        "type": "flights-group",
                        "description": "Day XXX",
                        "content": {
                            "type": "flights-list",
                            "content": [
                                { "flight": 1 },
                                { "flight": 2 }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}
*/
export function groupAndSortFlights(
    groupingOptions: GroupingOption[], 
    flights: Flight[]
): FlightsList | FlightsGroupContainer {
    const groupingOption = groupingOptions.shift()

    if (groupingOption === undefined) {
        return {
            type: 'flights-list',
            content: flights
        }
    }

    const sortDirection = groupingOption.order === 'Ascending' ? 1 : -1
    const groupingData = groupingOption.field.groupingData
    let result: FlightsList | FlightsGroupContainer
    if (groupingData.onlySort === true) {
        result = {
            type: 'flights-list',
            content: flights.sort((a, b) => {
                const aValue = groupingData.sortByFieldExtractor(a)
                const bValue = groupingData.sortByFieldExtractor(b)
                // multiply by direction to invert the result in case of descending ordering
                return (
                        typeof(aValue) === 'string' ?
                        aValue.localeCompare(bValue) :
                        aValue - bValue
                    ) * sortDirection
                })
        } as FlightsList
    }
    else {
        const groups = ArrayUtils.groupBy(flights, groupingData.groupKeyExtractor)

        result = {
            type: 'flights-group-container',
            groupByField: groupingOption.field.label,
            content: Array.from(groups.entries())
                .sort(([groupKeyA, _A], [groupKeyB, _B]) => {
                    // multiply by direction to invert the result in case of descending ordering
                    return (
                            typeof(groupKeyA) === 'string' ?
                            groupKeyA.localeCompare(groupKeyB) :
                            groupKeyA - groupKeyB
                        ) * sortDirection
                })
                .map(([groupKey, groupFlights]) => ({
                    type: 'flights-group',
                    description: groupingData.groupDescriptor(groupKey),
                    content: groupAndSortFlights(groupingOptions, groupFlights)
                } as FlightsGroup))
        } as FlightsGroupContainer
    }

    groupingOptions.unshift(groupingOption);

    return result
}


type GroupingData = {
    // it returns the key used to aggregate the flights under the same
    // group in the Map object
    groupKeyExtractor: (f: Flight) => any,
    // It returns the group description to show starting from the group
    // key retrieved using groupKeyExtractor
    groupDescriptor: (groupKey: string) => string;
    // used to avoid the creation of groups, instead flights are only ordered
    onlySort: false
} | {
    // it returns the field value that the flights must be sorted by
    sortByFieldExtractor: (f: Flight) => any;
    onlySort: true
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
    ['Departure Date', { 
        groupKeyExtractor: (f: Flight) => DateUtils.formatDateAsISO(f.departureDate),
        groupDescriptor: (groupKey: string) => DateUtils.formatDateLongForm(new Date(groupKey)),
        onlySort: false
    }],
    // grouping by Price means putting all the price in the same groups and applying
    // the specified ordering
    ['Price (Only sort)', { 
        onlySort: true,
        sortByFieldExtractor: (f: Flight) => f.price
    }],
    ['Departure Airport', { 
        groupKeyExtractor: (f: Flight) => f.origin.name, 
        groupDescriptor: (groupKey: string) => groupKey,
        onlySort: false
    }],
    ['Arrival Airport', { 
        groupKeyExtractor: (f: Flight) => f.destination.name,
        groupDescriptor: (groupKey: string) => groupKey,
        onlySort: false
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

                                <Select placeholder="Group by..."
                                    label="Group by"
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

                <Button mr="xl" style={{ alignSelf: 'flex-end' }} onClick={ (e) => onSort(options) }>Apply</Button>
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


/**
 * verifies that there is no onlySort field in the options. The only 
 * exception is for the last option
 * @param options 
 * @returns true if the options are valid, false otherwise
 */
function areOptionsValid(options: GroupingOption[]): boolean {
    return !options.slice(0, -1).some(opt => opt.field.groupingData.onlySort)
}


function optionsReducer(
    options: GroupingOption[],
    action: OptionAction
): GroupingOption[] {
    const actionType = action.type
    switch (actionType) {
        case OptionActionType.Added: {
            const newOptions = [
                ...options,
                action.newOption,
            ]

            if (areOptionsValid(newOptions))
                return newOptions
            else {
                window.alert('Only the last option can be "Sort Only"')
                return options
            }
        }
        case OptionActionType.FieldChanged: {
            const newOptions = options.map((option, i) => {
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
            if (areOptionsValid(newOptions))
                return newOptions
            else {
                window.alert('Only the last option can be "Sort Only"')
                return options
            }
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