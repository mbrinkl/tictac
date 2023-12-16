Client/Server monorepo with Colyseus, Svelte (spa mode), pnpm Workspaces

#### Setup

`pnpm i`

#### Run package commands from root

ie
`pnpm client dev`,
`pnpm srv start`,
`pnpm shared install ...`

#### Run Locally

`pnpm start` Runs the client and server with concurrently

#### Start prod express server

`pnpm build`

`pnpm start:prod`

Serves the Svelte spa as static files from the express server.
