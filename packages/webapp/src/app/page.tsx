'use client'

import { AppShell, Box, Divider, LoadingOverlay, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import '@mantine/dates/styles.css';

import styles from './styles.module.css'
import SearchPanel from '@/components/search-panel/SearchPanel';
import SettingsPanel from '@/components/SettingsPanel';
import FlightsPanel from '@/components/results-panel/FlightsPanel';
import { useState } from 'react';
import { OneWayFlightsSearchFilters } from '@/types/search';
import { FlightsRepository } from '@/repositories/FlightsRepository';

const flightsRepository = new FlightsRepository()

export default function App() {
    // const [opened, { toggle }] = useDisclosure();
    const [flights, setFlights] = useState([])
    const [areResultsLoading, setAreResultsLoading] = useState(false)

    function handleSearch(searchFilters: OneWayFlightsSearchFilters) {
        setAreResultsLoading(true)

        flightsRepository.searchOneWayFlights(searchFilters).then(res => {
            setFlights(res)
            setAreResultsLoading(false)
        })
    }

    function handleSort() {
        setAreResultsLoading(true)

        setAreResultsLoading(false)
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

            <AppShell.Main>
                <SettingsPanel />

                <Divider my="md" />

                <Box pos="relative">
                    <LoadingOverlay visible={areResultsLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    <FlightsPanel flights={flights} />
                </Box>
            </AppShell.Main>
        </AppShell>
    );
}