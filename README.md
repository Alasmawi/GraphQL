# GraphQL Student Profile Dashboard

A modern React dashboard for visualizing student progress, XP, and project stats using a GraphQL backend and SVG-based charts.

---

## Features

- **JWT Authentication:** Secure login and protected routes using JSON Web Tokens.
- **Profile Dashboard:** View user info, XP summaries, and project completion stats.
- **Interactive Charts:** SVG-based bar and pie charts (Recharts) for XP and pass/fail ratios.
- **Responsive UI:** Works on desktop and mobile.
- **Custom Modular CSS:** Clean, maintainable styles split by feature.

---

## Tech Stack

- **Frontend:** React, React Router, Recharts
- **GraphQL Client:** Apollo Client
- **Backend:** Expects a GraphQL API (see endpoint in code)
- **Styling:** Modular CSS (`/src/styles/`)
- **Authentication:** JWT (JSON Web Token)

---

## Project Structure

```
src/
  components/
    Graphs/
      PassFailChart.jsx
      XPByProjectChart.jsx
    ErrorPage.jsx
    Login.jsx
    Profile.jsx
    ProtectedRoute.jsx
    Apolloclient.js
  graphql/
    queries.js
  styles/
    base.css
    animations.css
    login.css
    profile.css
    charts.css
    modal.css
    error.css
    utility.css
  utils/
    jwtUtils.js
  index.js
  index.css
```

---

## Live Demo

The app is already deployed:  
👉 [https://graph-ql-lilac-five.vercel.app/login](https://graph-ql-lilac-five.vercel.app/login)

---

## Usage

- **Login:** Use your Reboot credentials to sign in.
- **Profile:** View your XP, project stats, and interactive charts.
- **Charts:** Hover for tooltips, see XP by project and pass/fail ratio.

---

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alasmawi/GraphQL.git
   cd GraphQL
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the development server**
   ```bash
   npm start
   ```
4. **Build for production**
   ```bash
   npm run build
   ```

> The app expects a GraphQL API endpoint compatible with the queries in `src/graphql/queries.js`.

---

## Authentication Flow

- On login, a JWT is stored in `localStorage`.
- All GraphQL requests include the JWT as a Bearer token.
- Protected routes use `ProtectedRoute` to check token validity and expiration.
- If the token is invalid or expired, the user is logged out and redirected to `/login`.

---

## Graphs & Visualization

- **SVG-based:** All charts are rendered as SVG using Recharts.
- **XP By Project:** Bar chart showing XP for the latest 10 projects.
- **Pass/Fail Ratio:** Pie chart showing the ratio of passed to failed projects.
- **Custom Tooltips:** Hovering over chart elements shows detailed info.

---

## Customization

- **Styling:** Edit files in `src/styles/` for modular CSS changes.
- **GraphQL Queries:** Edit `src/graphql/queries.js` to adjust or add queries.
- **JWT Logic:** See `src/utils/jwtUtils.js` for token handling.

---

## License

ISC

---

## Credits

- [Recharts](https://recharts.org/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Create React App](https://create-react-app.dev/)

---

**Maintained by:** [Alasmawi](https://github.com/Alasmawi)
