'use client'

import { AppShell, Box, Divider, LoadingOverlay, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useMemo, useState } from 'react';
import '@mantine/dates/styles.css';

import styles from './styles.module.css'
import SearchPanel from '@/components/search-panel/SearchPanel';
import SettingsPanel from '@/components/SettingsPanel';
import { OneWayFlightsSearchFilters } from '@/types/search';
import { FlightsRepository } from '@/repositories/FlightsRepository';
import FlightsSorter, { groupAndSortFlights, GroupingOption } from '@/components/results-panel/FlightsSorter';
import FlightsViewer from '@/components/results-panel/FlightsViewer';
import FullPageLoadingOverlay from '@/components/FullPageLoadingOverlay';

const flightsRepository = new FlightsRepository()

export default function App() {
    // const [opened, { toggle }] = useDisclosure();
    const [flights, setFlights] = useState([])
    const [groupingOptions, setGroupingOptions] = useState([] as GroupingOption[])
    const sortedFlights = useMemo(() => groupAndSortFlights(groupingOptions, flights), [groupingOptions, flights])
    const [areResultsLoading, setAreResultsLoading] = useState(false)

    function handleSearch(searchFilters: OneWayFlightsSearchFilters) {
        setAreResultsLoading(true)

        flightsRepository.searchOneWayFlights(searchFilters).then(res => {
            setFlights(res)
            setAreResultsLoading(false)
        })
    }

    return (
        <AppShell padding="md" navbar={{
            width: "30%",
            breakpoint: 'sm',
            collapsed: { mobile: true },
        }}>
            <AppShell.Navbar bg='searchPanelColor' id='navbar' p="md">
                <AppShell.Section grow component={ScrollArea}>
                    <SearchPanel className={styles.searchPanel} onSearch={handleSearch}></SearchPanel>
                </AppShell.Section>
            </AppShell.Navbar>

            <FullPageLoadingOverlay isVisible={areResultsLoading}></FullPageLoadingOverlay>

            <AppShell.Main>
                <SettingsPanel />

                <Divider my="md" />

                <FlightsSorter onSort={sortOptions => setGroupingOptions(sortOptions)}/>

                <Divider my="md" />

                <FlightsViewer flights={sortedFlights} />
            </AppShell.Main>
        </AppShell>
    );
}