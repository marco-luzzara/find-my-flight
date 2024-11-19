import { ActionIcon, Button, Fieldset, Group, Select, Stack, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useReducer, useState } from "react";

enum Ordering {
    ascending,
    descending
}

enum OneWayGroupingFields {
    NoGrouping = '(Empty)',
    DepartureDate = 'Departure Date',
    DepartureAirport = 'Departure Airport',
    ArrivalAirport = 'Arrival Airport'
}

enum OneWaySortingFields {
    NoSorting = '(Empty)',
    Price = 'Price',
    DepartureDate = 'Departure Date',
    DepartureAirport = 'Departure Airport',
    ArrivalAirport = 'Arrival Airport'
}

type SortingDetails = {
    field: OneWaySortingFields
    ordering: Ordering
}

type GroupSortingOption = {
    grouping: OneWayGroupingFields,
    sorting: SortingDetails
}

function stringedOption(option: GroupSortingOption): string {
    return `${option.grouping}-${option.sorting.field}`
}

// TODO: generalize to check for more general validation, like isGroupSortingOptionAcceptable(newOptions)
function isGroupSortingOptionAcceptable(
    currentOptions: GroupSortingOption[],
    newOption: GroupSortingOption
): boolean {
    let stringedNewOption = stringedOption(newOption)
    return !currentOptions.map(opt => stringedOption(opt)).some(strOpt => strOpt === stringedNewOption)
}

export default function FlightsSorter({ onSort }) {
    const [options, dispatch] = useReducer(optionsReducer, [] as GroupSortingOption[]);

    return (
        <Fieldset>
            <Stack align="center">
                <Text style={{ alignSelf: 'flex-start' }}>Grouping and Sorting options</Text>

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
                                    data={Object.values(OneWayGroupingFields)}
                                    value={option.grouping}
                                    onChange={grouping => {
                                        dispatch({
                                            type: OptionActionType.GroupingChanged,
                                            index: i,
                                            newGrouping: OneWayGroupingFields[grouping]
                                        })
                                    }}>
                                </Select>

                                <Select placeholder="Sort by..."
                                    label="Sort by"
                                    data={Object.values(OneWaySortingFields)}
                                    value={option.sorting.field}
                                    onChange={sorting => {
                                        dispatch({
                                            type: OptionActionType.SortingFieldChanged,
                                            index: i,
                                            newSortingField: OneWaySortingFields[sorting]
                                        })
                                    }}>
                                </Select>
                            </Group>
                        )
                    })
                }

                <ActionIcon radius="xl" onClick={() => {
                    dispatch({
                        type: OptionActionType.Added,
                        newOption: {
                            grouping: OneWayGroupingFields.NoGrouping,
                            sorting: {
                                // TODO: when NoSorting, the ordering should not exist
                                field: OneWaySortingFields.NoSorting,
                                ordering: Ordering.ascending
                            }
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
    GroupingChanged,
    SortingFieldChanged,
    Deleted
}

type OptionAction = {
    type: OptionActionType.Added,
    newOption: GroupSortingOption
} | {
    type: OptionActionType.GroupingChanged,
    index: number,
    newGrouping: OneWayGroupingFields
} | {
    type: OptionActionType.SortingFieldChanged,
    index: number,
    newSortingField: OneWaySortingFields
} | {
    type: OptionActionType.Deleted,
    index: number
}

function optionsReducer(options: GroupSortingOption[], action: OptionAction): GroupSortingOption[] {
    const actionType = action.type
    switch (actionType) {
        case OptionActionType.Added: {
            return [
                ...options,
                action.newOption,
            ]
        }
        // TODO: the first time the field is changed, UI does not update the selected field
        case OptionActionType.GroupingChanged: {
            return options.map((option, i) => {
                if (i === action.index) {
                    return {
                        grouping: action.newGrouping,
                        sorting: option.sorting
                    }
                }
                else {
                    return option;
                }
            })
        }
        case OptionActionType.SortingFieldChanged: {
            return options.map((option, i) => {
                if (i === action.index) {
                    return {
                        grouping: option.grouping,
                        sorting: {
                            field: action.newSortingField,
                            ordering: option.sorting.ordering
                        }
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