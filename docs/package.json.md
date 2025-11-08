What these scripts do:
npm run dev: This is for development. It uses nodemon to watch your .ts files. Any time you save a file, it will automatically restart the server, saving you from doing it manually. It runs TypeScript directly using ts-node (which nodemon will use automatically).

npm run build: This compiles your TypeScript code (from src) into plain JavaScript (in dist, assuming that's your outDir in tsconfig.json). This is what you would do before deploying to production.

npm run start: This runs the compiled JavaScript code from the dist folder. This is the "production" command, as it's faster and doesn't require all the TypeScript dev dependencies.