export default class ApiEndpointBuilder {
    public static listAirports(languageLocale: string): string {
        return `https://www.ryanair.com/api/views/locate/5/airports/${languageLocale}/active`
    }
}