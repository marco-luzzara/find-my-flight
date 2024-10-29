import { Card, Divider, Group, MantineStyleProp, Stack, Text, ThemeIcon, useMantineTheme } from "@mantine/core";
import { IconPlaneTilt } from "@tabler/icons-react";

export default function FlightDetails(
    {
        flightNumber,
        originAirport,
        departureDateTime,
        flightDuration,
        travelCompany,
        destinationAirport,
        arrivalDateTime
    }) {
    const theme = useMantineTheme();
    const boxStyle: MantineStyleProp = {
        gap: theme.spacing.xs,
        alignItems: 'center'
    }

    return (
        <Card shadow="sm" padding="sm" radius="md" withBorder>
            <Group style={{ alignItems: 'flex-start' }}>
                <Stack style={boxStyle}>
                    <Text>{originAirport}</Text>
                    <Text>{departureDateTime}</Text>
                </Stack>
                <Stack style={{ flexGrow: 1, ...boxStyle }}>
                    <Group style={{ width: '100%' }}>
                        <Divider size="md" style={{ flexGrow: 1 }} />
                        <ThemeIcon variant="default" style={{ border: 'none' }}>
                            <IconPlaneTilt />
                        </ThemeIcon>
                        <Divider size="md" style={{ flexGrow: 1 }} />
                    </Group>
                    <Text>{flightDuration}</Text>
                    <Text>{travelCompany}</Text>
                </Stack>
                <Stack style={boxStyle}>
                    <Text>{destinationAirport}</Text>
                    <Text>{arrivalDateTime}</Text>
                </Stack>
            </Group>
        </Card >
    )
}