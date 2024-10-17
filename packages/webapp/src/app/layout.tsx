'use client'

import '@mantine/core/styles.css';
import { StrictMode } from 'react';

import { ColorSchemeScript, colorsTuple, createTheme, MantineProvider, virtualColor } from '@mantine/core';

const theme = createTheme({
    colors: {
        searchPanelColorLight: colorsTuple('#FFBDBD'),
        searchPanelColorDark: colorsTuple('#600000'),
        searchPanelColor: virtualColor({
            name: 'searchPanelColor',
            dark: 'searchPanelColorDark',
            light: 'searchPanelColorLight'
        })
    },
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <StrictMode>
                    <MantineProvider theme={theme} defaultColorScheme="dark">
                        {children}
                    </MantineProvider>
                </StrictMode>
            </body>
        </html>
    )
}