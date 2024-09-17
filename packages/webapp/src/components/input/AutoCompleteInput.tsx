import { Autocomplete } from '@mantine/core';

export default function AutoCompleteInput({ label, placeholder, data }) {
    return <Autocomplete
        label={label}
        placeholder={placeholder}
        data={data} />;
}