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
        arrivalDateTime,
        price
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
                    <Group w="100%">
                        <Divider size="md" style={{ flexGrow: 1 }} />
                        <ThemeIcon variant="default" bd="none">
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
                <Divider orientation="vertical" />
                <Stack style={boxStyle}>
                    <Text>{flightNumber}</Text>
                    <Text>{price}€</Text>
                </Stack>
            </Group>
        </Card >
    )
}