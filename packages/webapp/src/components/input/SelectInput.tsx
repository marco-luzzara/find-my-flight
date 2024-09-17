import { NativeSelect } from '@mantine/core';

export default function SelectInput({ label, description, data }) {
    return <NativeSelect
        label={label}
        withAsterisk
        description={description}
        data={data} />;
}