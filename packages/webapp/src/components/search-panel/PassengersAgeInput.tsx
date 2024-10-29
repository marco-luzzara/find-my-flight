import { TagsInput } from "@mantine/core";
import { useState } from "react";

export default function PassengersAgeInput({ onValidInput }) {
    const [ages, setAges] = useState([]);
    const [isInputInvalid, setIsInputInvalid] = useState(false);

    function onChangeAges(values: string[]) {
        if (!values.every(v => v.match(/^\d{1,3}$/)))
            setIsInputInvalid(true)
        else {
            setAges(values)
            setIsInputInvalid(false)
            onValidInput(values.map(v => parseInt(v)))
        }
    }

    return (
        <TagsInput label="Passengers' age"
            placeholder="Type age and press Enter"
            clearable
            allowDuplicates
            value={ages}
            onFocus={() => setIsInputInvalid(false)}
            error={isInputInvalid ? 'Only positive integers are allowed' : null}
            onChange={onChangeAges}
            splitChars={[' ', ',']} />
    )
}