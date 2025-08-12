# GraphQL Profile Dashboard - Functions Documentation

This document provides a comprehensive overview of all functions present in the GraphQL Profile Dashboard project.

## Table of Contents

1. [Server Functions](#server-functions)
2. [App Structure](#app-structure)
3. [Authentication & Routing](#authentication--routing)
4. [UI Components](#ui-components)
5. [Data Visualization](#data-visualization)
6. [GraphQL Configuration](#graphql-configuration)
7. [GraphQL Queries](#graphql-queries)

---

## Server Functions

### `server.js`

**Main Server Setup Function**
- **Purpose**: Sets up an Express server to serve the React application
- **Port**: 8080
- **Features**:
  - Serves static files from the `build` directory
  - Implements catch-all routing for SPA (Single Page Application)
  - Handles any non-API routes by serving React's `index.html`

---

## App Structure

### `src/App.jsx`

#### `App()`
- **Purpose**: Main application component that sets up routing structure
- **Features**:
  - Implements React Router for navigation
  - Defines route structure: `/` → `/login`, `/profile`, and error handling
  - Wraps protected routes with authentication

**Route Structure**:
- `/` - Redirects to `/login`
- `/login` - Public login page
- `/profile` - Protected profile page (requires authentication)
- `*` - Catch-all for invalid routes (shows ErrorPage)

---

## Authentication & Routing

### `src/components/ProtectedRoute.jsx`

#### `ProtectedRoute({ children })`
- **Purpose**: Higher-order component that protects routes requiring authentication
- **Parameters**: 
  - `children` - React components to render if authenticated
- **Logic**: 
  - Checks for authentication token in localStorage
  - Redirects to `/login` if no token found
  - Renders children components if authenticated

### `src/components/Login.jsx`

#### `Login()`
- **Purpose**: Login page component with authentication functionality
- **Features**: Form validation, API authentication, navigation, animations

#### `handleSubmit(e)`
- **Purpose**: Processes login form submission
- **Parameters**: `e` - Form submit event
- **Process**:
  1. Prevents default form submission
  2. Validates input fields (identifier and password)
  3. Creates Basic Authentication credentials using btoa()
  4. Makes API call to Reboot01 authentication endpoint
  5. Stores JWT token in localStorage on success
  6. Triggers slide-up animation and navigates to profile
  7. Handles authentication errors with user feedback

**API Endpoint**: `https://learn.reboot01.com/api/auth/signin`

### `src/components/ErrorPage.jsx`

#### `ErrorPage()`
- **Purpose**: 404 error page for invalid routes
- **Features**:
  - Purple gradient background design
  - Navigation links to valid pages (`/login`, `/profile`)
  - User-friendly error messaging

---

## UI Components

### `src/components/Profile.jsx`

#### `Profile()`
- **Purpose**: Main dashboard component displaying user profile and analytics
- **Features**: Multiple GraphQL queries, data visualization, logout functionality

#### `handleLogout()`
- **Purpose**: Initiates logout process by showing confirmation modal
- **Action**: Sets `showLogoutModal` state to `true`

#### `confirmLogout()`
- **Purpose**: Executes actual logout process
- **Process**:
  1. Removes authentication token from localStorage
  2. Removes user data from localStorage
  3. Redirects to login page

#### `cancelLogout()`
- **Purpose**: Cancels logout process
- **Action**: Sets `showLogoutModal` state to `false`

**Data Management**:
- Fetches user information, XP data, project completion data
- Manages loading states for better UX
- Handles error states with user-friendly messages
- Implements entry animations from login page

---

## Data Visualization

### `src/components/Graphs/PassFailChart.jsx`

#### `PassFailChart({ passCount, failCount })`
- **Purpose**: Renders pie chart showing project pass/fail ratio
- **Parameters**:
  - `passCount` - Number of passed projects
  - `failCount` - Number of failed projects
- **Features**: Custom tooltips, labels, statistics grid, success rate calculation

#### `CustomTooltip({ active, payload })`
- **Purpose**: Custom tooltip component for pie chart
- **Features**: 
  - Shows project status with color coding
  - Displays count and percentage
  - Styled with custom CSS classes

#### `CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent })`
- **Purpose**: Custom label renderer for pie chart slices
- **Logic**:
  - Hides labels for slices smaller than 5%
  - Positions labels in center of slices
  - Uses mathematical calculations for positioning

**Data Processing**:
- Calculates percentages for pass/fail rates
- Handles edge cases (no data available)
- Color coding: Green for pass, Red for fail

### `src/components/Graphs/XPByProjectChart.jsx`

#### `XPByProjectChart({ projects })`
- **Purpose**: Renders bar chart showing XP earned by latest projects
- **Parameters**:
  - `projects` - Array of project objects with XP data
- **Features**: Custom tooltips, labels, data transformation, responsive design

#### `CustomTooltip({ active, payload, label })`
- **Purpose**: Custom tooltip component for bar chart
- **Features**:
  - Shows full project name
  - Displays XP amount in KB
  - Shows completion date
  - Styled with custom CSS classes (matching pie chart)

#### `CustomLabel({ x, y, width, height, value })`
- **Purpose**: Custom label renderer for bars
- **Logic**:
  - Positions labels above short bars, inside tall bars
  - Uses dynamic color based on bar height
  - Centers labels horizontally

#### `truncateName(name, maxLength = 19)`
- **Purpose**: Utility function to truncate long project names
- **Parameters**:
  - `name` - Project name string
  - `maxLength` - Maximum character length (default: 19)
- **Returns**: Truncated string with "..." if exceeds limit

**Data Processing**:
- Limits to latest 10 projects
- Reverses chronological order (oldest to newest)
- Converts XP amounts from bytes to KB
- Calculates Y-axis maximum with 10% padding

---

## GraphQL Configuration

### `src/components/Apolloclient.js`

**Apollo Client Setup**
- **Purpose**: Configures GraphQL client for API communication
- **Endpoint**: `https://learn.reboot01.com/api/graphql-engine/v1/graphql`

**Components**:

#### `httpLink`
- **Purpose**: Creates HTTP link to GraphQL endpoint
- **Configuration**: Points to Reboot01 GraphQL API

#### `authLink`
- **Purpose**: Adds JWT authentication to requests
- **Process**:
  - Retrieves token from localStorage
  - Adds Authorization header with Bearer token
  - Chains with HTTP link for authenticated requests

#### `client`
- **Purpose**: Main Apollo Client instance
- **Features**:
  - Combines authentication and HTTP links
  - Uses InMemoryCache for query caching
  - Exported for use throughout application

---

## JWT Utilities

### `src/utils/jwtUtils.js`

**JWT Token Management and Validation Functions**

#### `decodeJWT(token)`
- **Purpose**: Decodes a JWT token payload without cryptographic verification
- **Parameters**: `token` - The JWT token string
- **Returns**: Decoded payload object or null if invalid
- **Process**:
  1. Validates token structure (3 parts: header.payload.signature)
  2. Extracts and decodes the base64url-encoded payload
  3. Handles base64url padding requirements
  4. Parses JSON payload
- **Error Handling**: Returns null and logs errors for invalid tokens

#### `isTokenExpired(token)`
- **Purpose**: Checks if a JWT token has expired
- **Parameters**: `token` - The JWT token string
- **Returns**: Boolean - true if expired, false if valid
- **Logic**: 
  - Decodes token to extract `exp` claim
  - Converts expiration time from seconds to milliseconds
  - Compares with current timestamp

#### `getTokenExpiration(token)`
- **Purpose**: Extracts the expiration date from a JWT token
- **Parameters**: `token` - The JWT token string
- **Returns**: Date object or null if invalid
- **Usage**: For displaying token expiration to users

#### `getTimeUntilExpiration(token)`
- **Purpose**: Calculates milliseconds remaining until token expiration
- **Parameters**: `token` - The JWT token string
- **Returns**: Number of milliseconds or null if expired/invalid
- **Usage**: For setting up auto-logout timers

#### `isTokenValid(token)`
- **Purpose**: Comprehensive token validation (existence + expiration)
- **Parameters**: `token` - The JWT token string
- **Returns**: Boolean - true if token exists and is not expired
- **Usage**: Primary validation function used throughout the app

#### `handleExpiredToken(navigate)`
- **Purpose**: Handles expired token cleanup and redirection
- **Parameters**: `navigate` - React Router navigate function (optional)
- **Process**:
  1. Removes token and user data from localStorage
  2. Logs expiration event
  3. Redirects to login page
- **Fallback**: Uses window.location.href if navigate not provided

---

## GraphQL Queries

### `src/graphql/queries.js`

All queries are written in GraphQL Query Language (GQL) and exported for use in components.

#### `GET_USER_INFO`
- **Purpose**: Fetches basic user information
- **Returns**: id, login, email, createdAt, updatedAt, firstName, lastName
- **Type**: Simple query without parameters

#### `GEt_Total_XPInKB($userId)`
- **Purpose**: Calculates total XP for a specific user
- **Parameters**: `$userId` - User ID integer
- **Returns**: Aggregated sum of all XP transactions
- **Filters**: User-specific XP transactions

#### `GET_PISCINE_GO_XP($userId)`
- **Purpose**: Calculates XP earned during Go Piscine
- **Parameters**: `$userId` - User ID integer
- **Filters**: Transactions with path containing "bh-piscine"
- **Returns**: Array of transaction amounts

#### `GET_PISCINE_JS_XP($userId)`
- **Purpose**: Calculates XP earned during JavaScript Piscine
- **Parameters**: `$userId` - User ID integer
- **Filters**: Events with path containing "piscine-js"
- **Returns**: Aggregated sum of JS Piscine XP

#### `GET_PROJECT_XP`
- **Purpose**: Calculates XP earned from main module projects
- **Filters**: Events from "/bahrain/bh-module" path
- **Returns**: Aggregated sum of project XP
- **Note**: No user parameter - gets all users' project XP

#### `GET_PROJECTS_WITH_XP($userId)`
- **Purpose**: Fetches all projects with their XP amounts for a user
- **Parameters**: `$userId` - User ID integer
- **Returns**: Project details (id, name, amount, createdAt)
- **Ordering**: Ascending by creation date
- **Filters**: Project-type objects only

#### `GET_PROJECTS_PASS_FAIL($userId)`
- **Purpose**: Fetches project grades for pass/fail analysis
- **Parameters**: `$userId` - User ID integer
- **Returns**: Array of grade values
- **Usage**: Determines pass (≥1) vs fail (<1) counts

#### `GET_LATEST_PROJECTS_WITH_XP($userId)`
- **Purpose**: Fetches latest 12 projects for chart visualization
- **Parameters**: `$userId` - User ID integer
- **Returns**: Project details (id, name, amount, createdAt)
- **Ordering**: Descending by creation date (newest first)
- **Limit**: 12 projects maximum

---

## Data Flow Summary

1. **Authentication**: Login → Store JWT → Access protected routes
2. **Data Fetching**: Apollo Client → GraphQL queries → Component state
3. **Visualization**: Recharts components → Custom styling → Interactive tooltips
4. **User Interaction**: Custom modals → State management → Navigation

## Key Features

- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Fetches live data from Reboot01 API
- **Interactive Charts**: Hover effects and detailed tooltips
- **Secure Authentication**: JWT-based authentication system
- **Smooth Animations**: CSS transitions and animations
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Visual feedback during data fetching

This project demonstrates modern React development with GraphQL, data visualization, and professional UI/UX design patterns.
