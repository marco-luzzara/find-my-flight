import { AirportRepository } from '@/repositories/AirportsRepository';
import { Fieldset, Flex, MultiSelect, Text, RangeSlider, Select, Slider, TagsInput, useMantineTheme, Divider, Button, Space } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useEffect, useState } from 'react';
import TravelCompanySelect from './TravelCompanySelect';

const airportsRepo = new AirportRepository()

export default function SearchPanel({ className }) {
    const theme = useMantineTheme();
    const [airportsData, setAirportsData] = useState(null)

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
                />
            </Fieldset>

            <Fieldset radius='lg'>
                <TagsInput label="Passengers' age"
                    placeholder="Type age and press Enter"
                    clearable
                    splitChars={[' ', ',']} />
            </Fieldset>

            <Fieldset radius='lg'>
                <Text size='sm'>Departure Date</Text>

                <Divider />

                <DatePicker type="multiple" />

                <Text size='sm' style={{ marginTop: theme.spacing.md }}>Departure Time</Text>

                <Divider />

                <RangeSlider minRange={1} marks={[{ value: 0, label: '00:00' }, { value: 12, label: '12:00' }, { value: 24, label: '23:59' }]}
                    min={0} max={24} step={1} defaultValue={[0, 24]}
                    labelAlwaysOn label={(value) => `${value === 24 ? 23 : value}:${value === 24 ? '59' : '00'}`}
                    style={{ marginTop: theme.spacing.xl, marginBottom: theme.spacing.lg }} />
            </Fieldset>

            <Fieldset radius='lg'>
                <Text size='sm'>Max Flight Duration</Text>

                <Slider marks={[{ value: 1, label: '1h' }, { value: 12, label: '12h' }, { value: 24, label: '24h' }]}
                    min={1} max={24} step={1} defaultValue={24}
                    labelAlwaysOn label={(value) => `${value}h`}
                    style={{ marginTop: theme.spacing.xl, marginBottom: theme.spacing.lg }} />
            </Fieldset>

            <TravelCompanySelect />

            <Button variant="filled">Search</Button>
        </Flex>
    )
}