import * as fs from 'node:fs/promises'

export class MockUtils {
    public static mockFetch(endpoint: string, jsonResponsePath: string = '', statusCode: number = 200): jest.Mock {
        const fetchMock = jest.fn()
        global.fetch = fetchMock

        fetchMock.mockImplementation((url) => {
            if (url === endpoint) {
                return Promise.resolve({
                    status: statusCode,
                    json: async () => {
                        return jsonResponsePath === '' ?
                            Promise.resolve('') :
                            JSON.parse(
                                await fs.readFile(jsonResponsePath, { encoding: 'utf8' })
                            )
                    }
                });
            }
            else
                return Promise.reject(`Mocked \`fetch\` expects an endpoint (${endpoint}) that has not been called`)
        });

        return fetchMock
    }
}