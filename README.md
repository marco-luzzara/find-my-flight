# Find My Flight

The project is a multi-module project composed of two main modules:
- the APIs (`packages/api`)
- The WebApp (`packages/webapp`)

The API module only exports its types to the WebApp so that they can be independently developed. As such, they need different configurations.

## APIs

To run the API server:

```bash
make api/run
```

It exposes the server to port 3000, if not specified otherwise by setting the variable `PORT`.

---

## WebApp

Create a `.env` file in `packages/webapp` with the following properties:

```bash
SERVER_PORT=3001                    # it specifies the port the webapp runs on
API_ENDPOINT=http://0.0.0.0:9678    # the endpoint of the API server
```

To import environment variables in the Webapp, add them to the `nextConfig` in `next.config.mjs`.

To run the webapp:

```bash
make start-webapp
```

---

## Testing

Run all the tests available in the project with:

```bash
make test
```

---

## Clean

```bash
make clean
```
