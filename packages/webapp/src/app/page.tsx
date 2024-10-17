'use client'

import { AppShell, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import '@mantine/dates/styles.css';

import styles from './styles.module.css'
import SearchPanel from '@/components/SearchPanel';
import FlightsGroup from '@/components/FlightsGroup';
import FlightDetails from '@/components/FlightDetails';
import SettingsPanel from '@/components/SettingsPanel';

export default function App() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell padding="md" navbar={{
            width: "30%",
            breakpoint: 'sm',
            collapsed: { mobile: true },
        }}>
            <AppShell.Navbar bg='searchPanelColor' id='navbar' p="md">
                <AppShell.Section grow component={ScrollArea}>
                    <SearchPanel className={styles.searchPanel}></SearchPanel>
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main>
                <SettingsPanel />

                <FlightsGroup groupDescription="test group">
                    <FlightDetails originAirport="Bergamo"
                        departureDateTime="depTime"
                        flightDuration="2:40"
                        travelCompany="Ryanair"
                        destinationAirport="Bologna"
                        arrivalDateTime="arrTime" />
                </FlightsGroup>
            </AppShell.Main>
        </AppShell>
    );
}