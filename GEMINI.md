# GEMINI.md

This file provides a comprehensive overview of the `murphy` project, intended to be used as a quick-start guide and for providing context to the Gemini AI assistant.

## Project Overview

This is a desktop application built using the [Electron](https://www.electronjs.org/) framework. It utilizes [React](https://reactjs.org/) for the user interface and [TypeScript](https://www.typescriptlang.org/) for type-safe code. The project is set up with [Vite](https://vitejs.dev/) for a fast development experience and build process, managed through [electron-vite](https://electron-vite.org/).

### Architecture

The project follows the standard Electron process model:

*   **Main Process:** The entry point is `src/main/index.ts`. This process manages the application's lifecycle, creates browser windows, and handles native OS interactions.
*   **Renderer Process:** The UI is a React application with its entry point at `src/renderer/src/main.tsx`. This runs in the browser window created by the main process.
*   **Preload Script:** `src/preload/index.ts` is a script that runs before the renderer process loads. It uses the `contextBridge` to securely expose specific Node.js and Electron APIs to the renderer process.

## Building and Running

The project's scripts are defined in `package.json` and can be run using `npm`.

### Development

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

### Building for Production

To build the application for production:

```bash
npm run build
```

This will create a production-ready build in the `out` directory.

To build and package the application for a specific platform:

*   **Windows:**
    ```bash
    npm run build:win
    ```
*   **macOS:**
    ```bash
    npm run build:mac
    ```
*   **Linux:**
    ```bash
    npm run build:linux
    ```

### Other useful commands

*   **Linting:** To check the code for any linting errors:
    ```bash
    npm run lint
    ```
*   **Formatting:** To format the entire codebase using Prettier:
    ```bash
    npm run format
    ```
*   **Type Checking:** To run the TypeScript compiler and check for type errors:
    ```bash
    npm run typecheck
    ```

## Development Conventions

### Code Style

The project uses [ESLint](https://eslint.org/) for code analysis and [Prettier](https://prettier.io/) for code formatting. The respective configuration files are `eslint.config.mjs` and `.prettierrc.yaml`. It is recommended to use these tools to maintain a consistent code style.

### IPC Communication

The project is set up to use Inter-Process Communication (IPC) to communicate between the main and renderer processes. An example is provided where the renderer process sends a "ping" message to the main process, which then logs "pong" to the console.
