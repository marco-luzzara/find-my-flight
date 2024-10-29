'use client'

import { Checkbox, Fieldset, MultiSelect } from "@mantine/core";
import { TravelCompany } from '@findmyflight/api';
import { useState } from "react";

export default function TravelCompanySelect({ onCompaniesSelected }) {
    const [selectedCompanies, setSelectedCompanies] = useState([])

    return (
        <Fieldset radius='lg'>
            <MultiSelect
                label="Travel Companies"
                placeholder="Select all the travel companies you would choose"
                data={Object.values(TravelCompany)}
                value={selectedCompanies}
                onChange={companies => {
                    setSelectedCompanies(companies)
                    onCompaniesSelected(companies)
                }}
                searchable
                clearable
                nothingFoundMessage="No travel company with this name..."
            />

            <hr />

            <Checkbox
                label="All travel companies"
                onChange={e => {
                    const newCompanies = e.target.checked ? Object.values(TravelCompany) : selectedCompanies
                    setSelectedCompanies(newCompanies)
                    onCompaniesSelected(newCompanies)
                }}
            />
        </Fieldset>
    )
}