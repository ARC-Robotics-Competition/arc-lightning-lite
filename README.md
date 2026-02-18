# Lightning Lite

An externally hosted web dashboard for Lightning. This app pulls data from a Google Sheet and
allows for display (and in the future modification) wih a user-friendly format.

The front-end can be used directly on its own, or embeded as a frame (i.e. in the official
ARC Robotics website).

## Getting Started

### Prerequisites

This project uses the **Bun** Javascript runtime.
(Node.js or other runtimes *should* work with some updates to the commands, but Bun is new and fast™️)
See the [Bun website](https://bun.sh/) for installation instructions.

### Installation

1. Clone this repository and navigate to the project folder
2. Install all dependencies:
```bash
bun install
```

### Running the App

To start the development server:
```bash
bun dev
```

This will:
- Start a local web server (usually at `http://localhost:5173`)
- Watch for file changes and reload the page when you save edits

To stop the server, press `Ctrl+C` in the terminal.

### Building for Production

To create an optimized production build:
```bash
bun run build
```

This compiles and bundles everything into the `dist` folder, which can be deployed to a web server.
This command is run automatically to publish to GitHub pages when changes are pushed to main.

To preview the production build locally:
```bash
bun run preview
```

### Code Quality

To check for code issues:
```bash
bun run lint
```

This runs ESLint to catch common mistakes and enforce code style.

## How It Works

### Google OAuth Authentication

The app uses Google OAuth to authenticate users and access Google Sheets data:

1. **OAuth Setup**: The app is registered with Google Cloud Console and has a Client ID that identifies it
2. **User Login**: When you click "Sign in with Google", a popup asks you to grant permission to read spreadsheets
3. **Access Token**: After you approve, Google gives the app a temporary access token
4. **API Calls**: The app uses this token to make authenticated requests to the Google Sheets API

The authentication flow is handled by the `@react-oauth/google` library, which wraps all the OAuth complexity.

### Fetching Data from Google Sheets

Once authenticated, the app fetches data from a specific Google Sheet:

The `fetchSheetData` function:
1. Makes an HTTP GET request to the Google Sheets API
2. Includes the access token in the Authorization header
3. Receives the data as JSON (rows and columns)
4. Transforms it into a format the table component can display

### React Structure

React is a component-based framework. Think of components as reusable building blocks:

**Main Components:**

- **`App.tsx`**: The root component that handles authentication state
  - If not logged in → shows the login button
  - If logged in → shows the data table
  
- **`AuthButton`**: A component that renders the Google sign-in button
  - Uses the `useGoogleLogin` hook to handle the OAuth flow
  
- **`Content`**: The main dashboard component
  - Fetches data from Google Sheets when it loads
  - Displays the data in a table
  - Has a refresh button to reload data

**Key React Concepts:**

- **State**: Data that can change over time (like `accessToken`, `items`, `isLoading`)
- **Props**: Data passed from parent to child components
- **Hooks**: Special functions that let you use React features
  - `useState`: Creates a piece of state
  - `useEffect`: Runs code when the component loads or when dependencies change
  - `useGoogleLogin`: Custom hook from the OAuth library
- **JSX**: HTML-like syntax in JavaScript that describes what to render

### UI Components

The app uses [**AWS Cloudscape Design System**](https://cloudscape.design/) components:
- `Table`: Displays data in rows and columns
- `Button`: Clickable buttons with loading states
- `Checkbox`: Read-only checkboxes to show boolean values
- `Header`: Page and section headers
- `Box`: Layout container for spacing

These are pre-built, accessible components that handle styling and behavior for you.

## Project Structure

```
lightning-lite/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Entry point that renders App
│   └── index.css        # Global styles (currently unused)
├── dist/                # Production build output (generated)
├── node_modules/        # Dependencies (generated)
├── index.html           # HTML template
├── package.json         # Project metadata and dependencies
├── vite.config.ts       # Vite build tool configuration
└── tsconfig.json        # TypeScript compiler settings
```

## Adding New Components

To add a new component:

1. Create a new function in `App.tsx` (or a new file in `src/`)
2. Define the component's props interface if it needs data passed in
3. Use React hooks for state and side effects
4. Import Cloudscape components as needed
5. Return JSX describing what to render

**Example:**
```typescript
interface MyComponentProps {
    title: string;
}

function MyComponent({ title }: MyComponentProps) {
    const [count, setCount] = useState(0);
    
    return (
        <Box>
            <Header>{title}</Header>
            <Button onClick={() => setCount(count + 1)}>
                Clicked {count} times
            </Button>
        </Box>
    );
}
```

Then use it in another component:
```typescript
<MyComponent title="Hello World" />
```

## Maintenance Tasks

### Changing the Google Sheet

To point to a different sheet, update these values in `App.tsx`:
- `spreadsheetId`: The ID from the sheet's URL
- `range`: The sheet name and cell range (e.g., `'Sheet1!A1:Z100'`)

### Modifying Table Columns

Edit the `columnDefinitions` array in the `Content` component. Each column needs:
- `id`: Unique identifier
- `header`: Column title
- `cell`: Function that returns what to display for each row
- `sortingField`: Field name for sorting

## TODO

- [x] CD (GitHub action that builds and deploys to GitHub Pages)
- [ ] Better UI polish
- [ ] More info/functionality
- [ ] Clean up code

---

## Tech Stack

- **React 19**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Bun**: JavaScript runtime and package manager
- **Cloudscape**: AWS design system components
- **Google OAuth**: Authentication
- **Google Sheets API**: Data source

---

> This README was generated in part using Kiro.
