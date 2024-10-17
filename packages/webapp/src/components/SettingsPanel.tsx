'use client'

import { Flex, ActionIcon, useComputedColorScheme, useMantineColorScheme, Group } from '@mantine/core';
import { IconMoonFilled, IconSunFilled } from '@tabler/icons-react';

export default function SettingsPanel() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('dark');

    return (
        <Group
            gap="lg"
            align="center"
            justify="flex-end"
        >
            <ActionIcon variant="default" size="xl" onClick={() => toggleColorScheme()}>
                {
                    computedColorScheme === 'dark' ?
                        <IconSunFilled />
                        :
                        <IconMoonFilled />
                }
            </ActionIcon>
        </Group>
    )
}