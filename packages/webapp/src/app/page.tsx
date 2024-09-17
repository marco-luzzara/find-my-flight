'use client'

import { AppShell, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import styles from './styles.module.css'
import SearchPanel from '@/components/SearchPanel';

export default function App() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell padding="md" navbar={{
            width: "30%",
            breakpoint: 'sm',
            collapsed: { mobile: true },
        }}>
            <AppShell.Navbar id={styles.navbar} p="md">
                <AppShell.Section grow component={ScrollArea}>
                    <SearchPanel className={styles.searchPanel}></SearchPanel>
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main>Main</AppShell.Main>
        </AppShell>
    );
}