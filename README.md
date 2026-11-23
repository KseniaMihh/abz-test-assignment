# abz.agency front-end test assignment

A single-page React app built as the front-end test assignment for abz.agency. It shows a paginated list of users from the assignment's REST API and lets a visitor register a new user through a validated form with a photo upload.

## Features

- **Users list (GET)**: loads users six at a time, newest first, with a "Show more" button that disappears on the last page. Long names and emails are truncated, and a fallback avatar is shown if a photo fails to load.
- **Registration form (POST)**: name, email, phone, position and photo fields. Positions are loaded from the API. A one-time token is requested before submitting.
- **Validation**: client-side checks for name length, email format, `+380` phone format, and JPEG photos up to 5 MB. The submit button stays disabled until the form is valid, and field errors returned by the API are shown next to the matching field.
- **After sign-up**: a success screen replaces the form and the users list reloads from the first page so the new user appears at the top.
- **Navigation**: header and banner buttons scroll smoothly to the users and sign-up sections.

## Tech stack

- React 19
- Vite 7
- Plain CSS with shared variables for colours and typography
- ESLint and Prettier

## Getting started

Requires Node.js 20.19 or newer.

```sh
npm install
npm run dev
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── App.jsx                  # Page layout; reloads the users list after sign-up
├── components/
│   ├── Header.jsx           # Logo and scroll buttons
│   ├── BannerSection.jsx    # Hero banner
│   ├── UsersSection.jsx     # Paginated users list
│   ├── FormSection.jsx      # Registration form and validation
│   └── SuccessMessage.jsx   # Shown after a successful sign-up
└── styles/                  # Component, layout and variable stylesheets
```

## API

The app talks to the public assignment API at `https://frontend-test-assignment-api.abz.agency/api/v1`:

| Endpoint | Used for |
|---|---|
| `GET /users?page=&count=` | Users list |
| `GET /positions` | Position options in the form |
| `POST /token` | One-time token for registration |
| `POST /users` | Register a new user |
