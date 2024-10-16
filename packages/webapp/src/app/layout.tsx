import '@mantine/core/styles.css';
import { StrictMode } from 'react';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';

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
                    <MantineProvider>{children}</MantineProvider>
                </StrictMode>
            </body>
        </html>
    )
}