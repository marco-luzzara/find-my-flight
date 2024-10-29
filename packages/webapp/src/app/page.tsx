'use client'

import { AppShell, ScrollArea } from '@mantine/core';
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
    const [opened, { toggle }] = useDisclosure();
    const [flights, setFlights] = useState([])

    async function callSearchAPI(searchFilters: OneWayFlightsSearchFilters) {
        const foundFlights = await flightsRepository.searchOneWayFlights(searchFilters)
        setFlights(foundFlights)
    }

    return (
        <AppShell padding="md" navbar={{
            width: "30%",
            breakpoint: 'sm',
            collapsed: { mobile: true },
        }}>
            <AppShell.Navbar bg='searchPanelColor' id='navbar' p="md">
                <AppShell.Section grow component={ScrollArea}>
                    <SearchPanel className={styles.searchPanel} onSearch={callSearchAPI}></SearchPanel>
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main>
                <SettingsPanel />

                <FlightsPanel flights={flights} />
            </AppShell.Main>
        </AppShell>
    );
}