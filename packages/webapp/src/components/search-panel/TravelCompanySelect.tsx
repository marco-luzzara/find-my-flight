'use client'

import { Checkbox, Fieldset, MultiSelect } from "@mantine/core";
import { TravelCompany, travelCompaniesMap } from '@findmyflight/api';
import { useState } from "react";

export default function TravelCompanySelect({ onCompaniesSelected }) {
    const [selectedCompanies, setSelectedCompanies] = useState([])
    const allTravelCompanies = Array.from(travelCompaniesMap.keys()).map(tc => tc.toString())

    return (
        <Fieldset radius='lg'>
            <MultiSelect
                label="Travel Companies"
                placeholder="Select all the travel companies you would choose"
                data={Array.from(travelCompaniesMap.entries()).map(e => ({
                    value: e[0].toString(),
                    label: e[1]
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