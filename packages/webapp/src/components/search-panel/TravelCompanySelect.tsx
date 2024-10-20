'use client'

import { Checkbox, Fieldset, MultiSelect } from "@mantine/core";
import { TravelCompany } from '@findmyflight/api';
import { useState } from "react";

export default function TravelCompanySelect() {
    const [selectedCompanies, setSelectedCompanies] = useState([])

    return (
        <Fieldset radius='lg'>
            <MultiSelect
                label="Travel Companies"
                placeholder="Select all the travel companies you would choose"
                data={Object.values(TravelCompany)}
                value={selectedCompanies}
                onChange={companies => setSelectedCompanies(companies)}
                searchable
                clearable
                nothingFoundMessage="No travel company with this name..."
            />

            <hr />

            <Checkbox
                defaultChecked
                label="All travel companies"
                onChange={e => setSelectedCompanies(e.target.checked ? Object.values(TravelCompany) : selectedCompanies)}
            />
        </Fieldset>
    )
}