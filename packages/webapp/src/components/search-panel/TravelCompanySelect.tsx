'use client'

import { travelCompanies } from "@findmyflight/api";
import { Checkbox, Fieldset, MultiSelect } from "@mantine/core";
import { useState } from "react";

export default function TravelCompanySelect({ onCompaniesSelected }) {
    const [selectedCompanies, setSelectedCompanies] = useState([])
    const allTravelCompanies = travelCompanies.map(tc => tc.id)

    return (
        <Fieldset radius='lg'>
            <MultiSelect
                label="Travel Companies"
                placeholder="Select all the travel companies you would choose"
                data={travelCompanies.map(tc => ({
                    value: tc.id,
                    label: tc.label
                }))}
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
                    const newCompanies = e.target.checked ? allTravelCompanies : selectedCompanies
                    setSelectedCompanies(newCompanies)
                    onCompaniesSelected(newCompanies)
                }}
            />
        </Fieldset>
    )
}