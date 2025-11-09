import * as fs from 'node:fs/promises'
// import * as assert from 'node:assert'

export class MockUtils {
    // public static async mockHttpGet(endpoint: string, jsonResponsePath: string = '', statusCode: number = 200): Promise<jest.Mock> {
    //     let jsonBody: any
    //     if (jsonResponsePath !== '') {
    //         const fileStat = await fs.stat(jsonResponsePath);
    //         assert.ok(fileStat.isFile())

    //         jsonBody = JSON.parse(
    //             await fs.readFile(jsonResponsePath, { encoding: 'utf8' })
    //         )
    //     }
    //     else
    //         jsonBody = {}

    //     const fetchMock = jest.fn()
    //     global.fetch = fetchMock

    //     fetchMock.mockImplementation((url) => {
    //         if (url === endpoint) {
    //             const response = {
    //                 status: statusCode,
    //                 json: () => Promise.resolve(jsonBody)
    //             } as Response
    //             return Promise.resolve(response)
    //         }
    //         else
    //             return Promise.reject(`Mocked \`fetch\` expects an endpoint (${endpoint}) that has not been called`)
    //     });

    //     return fetchMock
    // }

    public static async mockFetchResponse(statusCode: number): Promise<Response> {
        // @ts-ignore
        return Promise.resolve({
            status: statusCode
        } as Response)
    }

    public static async mockFetchResponseFromFile(statusCode: number, bodyFilePath: string): Promise<Response> {
        const body = await fs.readFile(bodyFilePath, { encoding: 'utf8' })

        // @ts-ignore
        return {
            status: statusCode,
            json: async () => Promise.resolve(JSON.parse(body))
        } as Response
    }

    public static async mockFetchResponseWithHeader(statusCode: number, headerFilePath: string): Promise<Response> {
        const headerContent = (await fs.readFile(headerFilePath, { encoding: 'utf8' })).split('\n')

        // @ts-ignore
        return {
            status: statusCode,
            headers: {
                getSetCookie: () => headerContent
            }
        } as Response
    }
}
