import { ActionIcon, useMantineTheme } from '@mantine/core';
import { IconCircleX } from '@tabler/icons-react';

export default function DeletableDiv({ text }) {
    const theme = useMantineTheme();
    const childrenStyle = {
        alignItems: 'center',
        display: 'grid'
    }

    return (
        <div style={{
            color: theme.colors.blue[0],
            backgroundColor: theme.colors.blue[6],
            borderRadius: theme.radius.md,
            padding: '1%',
            paddingLeft: '3%',
            display: 'flex'
        }}>
            <b style={childrenStyle}>{text.toUpperCase()}</b>
            <span style={childrenStyle}><ActionIcon radius="xl"><IconCircleX /></ActionIcon></span>
        </div>
    )
}