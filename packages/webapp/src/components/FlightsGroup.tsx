import { Center, Container, Divider, Stack } from "@mantine/core";

export default function FlightsGroup({ groupDescription, children }) {
    return (
        <Container style={{ width: '90%', maxWidth: '50vw' }}>
            <Divider my="md" label={groupDescription} labelPosition="left" />
            <Stack style={{ width: '100%' }}>
                {children}
            </Stack>
        </Container>
    )
}