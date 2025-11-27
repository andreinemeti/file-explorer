```md
## File Explorer – Setup Requirements

- Node v18.20.4
- NPM 10.7.0

## Setting up and starting the project 
- **Server**: Navigate to the `server/` folder. Set `ROOT_DIR` in `.env` (absolute path). Run `npm i` and then  `npm run dev`. 
- **Client**: Navigate to the `web/` folder. Run `npm i` and then  `npm run dev`. Open the Vite URL.

## Setting up docker
`docker compose up`


## Creating a build
- **Server**: `npm run build` then `npm start`.
- **Client**: `npm run build` then `npm run preview`.


## Testing 
- **Server**: in `server/` run `npm run test`.
- **Client**: in `client/` `npm run test`.


## Assumptions & Decisions
- Root directory is fixed via env var and not changeable from the UI (security).
- Only two endpoints implemented: `/api/files` and `/api/file` (GET) as specified.
- Errors return JSON with an `error` field and appropriate HTTP status.
- Saas used for styling; no other UI libraries.



## Attribution & Learning Notes

I’m new to **Node.js** and **TypeScript**, and this was my first time using them.  

