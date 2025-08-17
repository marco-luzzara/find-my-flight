'use client'

import { Box, Collapse, Text, Container, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronCompactDown, IconChevronCompactUp } from '@tabler/icons-react';

import { DateUtils } from "@findmyflight/utils";

import { FlightsGroupContainer, FlightsList, FlightsGroup } from './FlightsPanel'
import FlightDetails from "./FlightDetails";
import travelCompanies from '../../config-files/travel-companies.json'


function FlightsGroupContainerViewer(
    { groups, groupsChain }: { groups: FlightsGroup[], groupsChain: string[] }
) {
    const [collapseOpened, { toggle: toggleCollapse }] = useDisclosure(false);

    return groups.map(group => {
        const currentGroupsChain = Array.from(groupsChain)
        currentGroupsChain.push(group.description)
        const groupKey = currentGroupsChain.join('_')

        return (
            <Box mx="auto" key={groupKey}>
                <Group justify="center" w="90%" maw="50vw" gap="1" onClick={e => toggleCollapse()}>
                    {
                        collapseOpened ? 
                        <IconChevronCompactUp stroke={1.5} /> : 
                        <IconChevronCompactDown stroke={1.5} /> 
                    }
                    <Text size="lg">{group.description}</Text>
                </Group>

                <Collapse in={collapseOpened}>
                    <RecursiveFlightsViewer flights={group.content} groupsChain={currentGroupsChain}/>
                </Collapse>
            </Box>
        )
    });                
}


function RecursiveFlightsViewer(
    { flights, groupsChain }: { flights: FlightsList | FlightsGroupContainer, groupsChain: string[] }
) {
    switch (flights.type) {
        case 'flights-list':
            const flightsDetails = flights.content.map(f => (
                <FlightDetails
                    key={`${f.flightNumber}-${f.departureDate}`}
                    flightNumber={f.flightNumber}
                    originAirport={`${f.origin.name} (${f.origin.code})`}
                    departureDateTime={DateUtils.formatFlightDateTime(f.departureDate)}
                    flightDuration={DateUtils.getDurationFromDates(f.departureDate, f.arrivalDate)}
                    travelCompany={travelCompanies.find(tc => tc.id === f.travelCompany)!.label}
                    destinationAirport={`${f.destination.name} (${f.destination.code})`}
                    arrivalDateTime={DateUtils.formatFlightDateTime(f.arrivalDate)}
                    price={f.price} />
            ))
            return (
                <Container style={{ width: '90%', maxWidth: '50vw' }}>
                    <Stack style={{ width: '100%' }}>
                        { flightsDetails }
                    </Stack>
                </Container>
            )
        case 'flights-group-container':
            return (
                <FlightsGroupContainerViewer groups={flights.content} groupsChain={groupsChain} />
            )
        default:
            throw new TypeError(`Unhandled grouped flights type while rendering flights viewer`)
    }
}


export default function FlightsViewer({ flights }: { flights: FlightsList | FlightsGroupContainer }) {
    return (
        <RecursiveFlightsViewer flights={flights} groupsChain={[]} />
    )
}