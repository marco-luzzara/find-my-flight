'use client'

import { travelCompanyIntegrations } from "@findmyflight/api";
import { Checkbox, Fieldset, MultiSelect } from "@mantine/core";
import { useState } from "react";

export default async function TravelCompanySelect({ onCompaniesSelected }) {
    const [selectedCompanies, setSelectedCompanies] = useState([])
    const allTravelCompanies = Array.from(travelCompanyIntegrations.keys())

    return (
        <Fieldset radius='lg'>
            <MultiSelect
                label="Travel Companies"
                placeholder="Select all the travel companies you would choose"
                data={Array.from(travelCompanyIntegrations.entries()).map(e => ({
                    value: e[0],
                    label: e[1].label
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