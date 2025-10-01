```md
## File Explorer – Setup Requirements

- Node v18.20.4
- NPM 10.7.0

## Setting up and starting the project 
- **Server**: Navigate to the `server/` folder. Set `ROOT_DIR` in `.env` (absolute path). Run `npm i` and then  `npm run dev`. 
- **Client**: Navigate to the `web/` folder. Run `npm i` and then  `npm run dev`. Open the Vite URL.


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
- All of the server side was generated with ChatGPT, as well as troubleshooting.

- I created the project architecture, the design and the UX, integrated the generated code, adapted it to the requirements, and verified it locally. 
After that I refactored all of the project because most of the generated code was hard to read/unreadable. 
- I also integrated Sass instead of initially generated Tailwind CSS.
- The example tests (where present) were also generated with ChatGPT.
