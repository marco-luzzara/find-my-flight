import { ActionIcon, Fieldset, Flex, FlexProps, NumberInput, useMantineTheme } from '@mantine/core';
import SelectInput from './input/SelectInput';
import AutoCompleteInput from './input/AutoCompleteInput';
import DeletableDiv from './input/DeletableDiv';
import { IconPlus } from '@tabler/icons-react';

export default function SearchPanel({ className }) {
    const theme = useMantineTheme();
    const selectedItemProps: FlexProps = {
        gap: "sm",
        align: "flex-start",
        direction: "row",
        style: {
            padding: "5%"
        }
    }
    return (
        <Flex gap="lg"
            justify="center"
            align="flex-start"
            direction="column"
            className={className}
        >
            <SelectInput data={['One Way']} description='' label='Flight Type'></SelectInput>

            <Fieldset radius='lg'>
                <h4>Origin Airport</h4>
                <AutoCompleteInput data={['Bergamo', 'Bologna']} placeholder='Enter airport name or city' label='Airport'></AutoCompleteInput>
                <Flex {...selectedItemProps}>
                    <DeletableDiv text="Bergamo"></DeletableDiv>
                    <DeletableDiv text="Bologna"></DeletableDiv>
                </Flex>
            </Fieldset>

            <Fieldset radius='lg'>
                <h4>Destination Airport</h4>
                <AutoCompleteInput data={['Bergamo', 'Bologna']} placeholder='Enter airport name or city' label='Airport'></AutoCompleteInput>
                <Flex {...selectedItemProps}>
                    <DeletableDiv text="Bergamo"></DeletableDiv>
                    <DeletableDiv text="Bologna"></DeletableDiv>
                </Flex>
            </Fieldset>

            <Fieldset radius='lg'>
                <h4>Passengers' Age</h4>
                <Flex align='flex-end'>
                    <NumberInput min={0} placeholder='Enter age' label='Age' />
                    <ActionIcon size='lg' radius='xl' style={{ marginLeft: theme.spacing.xs }}><IconPlus /></ActionIcon>
                </Flex>
                <Flex {...selectedItemProps}>
                    <DeletableDiv text="10"></DeletableDiv>
                    <DeletableDiv text="20"></DeletableDiv>
                </Flex>
            </Fieldset>
        </Flex>
    )
}