import travelCompanies from './config-files/travel-companies.json'

const configurationManager = {
    apiEndpoint: process.env.API_ENDPOINT,
    travelCompanies: travelCompanies
}

export default configurationManager;