import { Flight } from "@findmyflight/api";
import { ActionIcon, Button, Fieldset, Group, Select, Stack, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { FlightDataPath } from "next/dist/server/app-render/types";
import { useReducer, useState } from "react";

type FlightType = Flight
type FieldMapper = (o: FlightType) => any

type SortingField = {
    name: string,
    mapping: FieldMapper
}
type Ordering = 'Ascending' | 'Descending'
type SortingOption = {
    field: SortingField,
    order: Ordering
}

const ONEWAY_SORTING_FIELDS: ReadonlyMap<string, FieldMapper> = new Map([
    ['Price', (f: Flight): any => f.price],
    ['Departure Date', (f: Flight) => f.departureDate],
    ['Departure Airport', (f: Flight) => f.origin.name],
    ['Arrival Airport', (f: Flight) => f.destination.name]
])

function getSortingFields(): ReadonlyMap<string, FieldMapper> {
    return ONEWAY_SORTING_FIELDS
}

// function stringedOption(option: GroupSortingOption): string {
//     return `${option.grouping}-${option.sorting.field}`
// }

// // TODO: generalize to check for more general validation, like isGroupSortingOptionAcceptable(newOptions)
// function isGroupSortingOptionAcceptable(
//     currentOptions: GroupSortingOption[],
//     newOption: GroupSortingOption
// ): boolean {
//     let stringedNewOption = stringedOption(newOption)
//     return !currentOptions.map(opt => stringedOption(opt)).some(strOpt => strOpt === stringedNewOption)
// }

export default function FlightsSorter({ onSort }) {
    const [options, dispatch] = useReducer(optionsReducer, [] as SortingOption[])
    const sortingFields = getSortingFields()

    return (
        <Fieldset>
            <Stack align="center">
                <Text style={{ alignSelf: 'flex-start' }}>Sorting options</Text>

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
                                    data={Array.from(sortingFields.keys())}
                                    value={option.field.name}
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
                    const defaultKey = ONEWAY_SORTING_FIELDS.keys().next().value
                    dispatch({
                        type: OptionActionType.Added,
                        newOption: {
                            field: {
                                name: defaultKey,
                                mapping: ONEWAY_SORTING_FIELDS.get(defaultKey)
                            },
                            order: 'Ascending'
                        }
                    })
                }}>
                    <IconPlus />
                </ActionIcon>

                <Button mr="xl" style={{ alignSelf: 'flex-end' }}>Apply</Button>
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
    newOption: SortingOption
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
    options: SortingOption[],
    action: OptionAction
): SortingOption[] {
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
                            name: action.changedField,
                            mapping: getSortingFields().get(action.changedField)
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