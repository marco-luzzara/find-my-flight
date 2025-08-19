'use client'

import { Container, Stack, Accordion } from "@mantine/core";

import { DateUtils } from "@findmyflight/utils";

import { FlightsGroupContainer, FlightsList, FlightsGroup } from './FlightsSorter'
import FlightDetails from "./FlightDetails";
import travelCompanies from '../../config-files/travel-companies.json'


function FlightsGroupContainerViewer(
    { groups, groupsChain }: { groups: FlightsGroup[], groupsChain: string[] }
) {

    const renderedGroups = groups.map(group => {
        const currentGroupsChain = Array.from(groupsChain)
        currentGroupsChain.push(group.description)
        const groupKey = currentGroupsChain.join('_')

        return (
            <Accordion.Item key={groupKey} value={group.description}>
                <Accordion.Control>{group.description}</Accordion.Control>
                <Accordion.Panel>
                    <RecursiveFlightsViewer flights={group.content} groupsChain={currentGroupsChain}/>
                </Accordion.Panel>
            </Accordion.Item>            
        )
    });
    
    return (
        <Accordion variant="separated" radius="md" chevronPosition="left" chevronIconSize={19}>
            {renderedGroups}
        </Accordion>
    )
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