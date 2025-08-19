import { AirportRepository } from '@/repositories/AirportsRepository';
import { Fieldset, Flex, MultiSelect, Text, RangeSlider, Select, Slider, useMantineTheme, Divider, Button, Space } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import TravelCompanySelect from './TravelCompanySelect';
import PassengersAgeInput from './PassengersAgeInput';
import { OneWayFlightsSearchFilters } from '@/types/search';

const airportsRepo = new AirportRepository()

export default function SearchPanel({ className, onSearch }) {
    const theme = useMantineTheme();
    const [airportsData, setAirportsData] = useState(null)
    const searchFilters: MutableRefObject<OneWayFlightsSearchFilters> = useRef({
        originAirports: [],
        destinationAirports: [],
        passengersAge: [],
        departureDates: [],
        departureTimeStart: 0,
        departureTimeEnd: 24,
        maxFlightHours: 24,
        travelCompanies: []
    })

    // the airports are re-loaded every time the day changes
    const currentDate = (new Date()).getDate()
    useEffect(() => {
        airportsRepo.listAirports()
            .then(res => res.map(a => ({
                value: a.code,
                label: `${a.name} (${a.code})`
            })))
            .then(airports => setAirportsData(airports))
    }, [currentDate])

    function handleSearch() {
        let areSearchFiltersFilled = true
        for (let p in searchFilters.current) {
            if (Array.isArray(searchFilters.current[p]) && searchFilters.current[p].length === 0) {
                areSearchFiltersFilled = false
                break
            }
        }

        if (areSearchFiltersFilled)
            onSearch(searchFilters.current)
        else
            alert('Please fill all the search filters')
    }

    return (
        <Flex
            gap="lg"
            justify="center"
            align="flex-start"
            direction="column"
            className={className}
        >
            <Fieldset radius='lg'>
                <Select data={[{ value: 'one-way', label: 'One Way' }]} label='Flight Type' placeholder='Choose the flight type...' />
            </Fieldset>

            <Fieldset radius='lg'>
                <MultiSelect
                    label="Origin Airport"
                    placeholder="Select the origin airport..."
                    limit={10}
                    data={airportsData}
                    searchable
                    clearable
                    nothingFoundMessage="No airport with this name..."
                    onChange={value => searchFilters.current.originAirports = value}
                />

                <Space h="md" />

                <MultiSelect
                    label="Destination Airport"
                    placeholder="Select the destination airport..."
                    limit={10}
                    data={airportsData}
                    searchable
                    clearable
                    nothingFoundMessage="No airport with this name..."
                    onChange={value => searchFilters.current.destinationAirports = value}
                />
            </Fieldset>

            <Fieldset radius='lg'>
                <PassengersAgeInput onValidInput={(value: number[]) => {
                    searchFilters.current.passengersAge = value
                }} />
            </Fieldset>

            <Fieldset radius='lg'>
                <Text size='sm'>Departure Date</Text>

                <Divider />

                <DatePicker type="multiple"
                    onChange={value => searchFilters.current.departureDates = value.map(v => new Date(v))} />

                <Text size='sm' style={{ marginTop: theme.spacing.md }}>Departure Time</Text>

                <Divider />

                <RangeSlider minRange={1} marks={[{ value: 0, label: '00:00' }, { value: 12, label: '12:00' }, { value: 24, label: '23:59' }]}
                    min={0} max={24} step={1} defaultValue={[0, 24]}
                    onChange={value => {
                        searchFilters.current.departureTimeStart = value[0]
                        searchFilters.current.departureTimeEnd = value[1]
                    }}
                    labelAlwaysOn label={(value) => `${value === 24 ? 23 : value}:${value === 24 ? '59' : '00'}`}
                    style={{ marginTop: theme.spacing.xl, marginBottom: theme.spacing.lg }} />
            </Fieldset>

            <Fieldset radius='lg'>
                <Text size='sm'>Max Flight Hours</Text>

                <Slider marks={[{ value: 1, label: '1h' }, { value: 12, label: '12h' }, { value: 24, label: '24h' }]}
                    min={1} max={24} step={1} defaultValue={24}
                    labelAlwaysOn label={(value) => `${value}h`}
                    onChange={value => searchFilters.current.maxFlightHours = value}
                    style={{ marginTop: theme.spacing.xl, marginBottom: theme.spacing.lg }} />
            </Fieldset>

            <TravelCompanySelect onCompaniesSelected={(values: string[]) =>
                searchFilters.current.travelCompanies = values
            } />

            <Button variant="filled"
                onClick={e => handleSearch()}>Search</Button>
        </Flex>
    )
}