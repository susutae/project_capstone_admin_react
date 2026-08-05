# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Capstone Commerce Admin

React Admin frontend for the API in `Capstone-project-Backend1/capstone-project-backend`.

## Configure and run

The deployed backend is configured by default:

```text
https://capstone-project-backend-delta.vercel.app/api
```

To use a different backend, copy `.env.example` to `.env` and change
`VITE_API_URL`. The value must include `/api` and should not include a resource
path such as `/users`.

Start the frontend:

```bash
npm install
npm run dev
```

The UI supports creating, viewing, updating, and deleting users, categories,
products, carts, cart items, and orders. Order items can be filtered by order,
created, and deleted (the operations exposed by the backend API).

## Authentication

Sign in with the email address and password of a user registered in the backend.
The app stores the returned JWT in session storage, sends it as a Bearer token
with API requests, and returns to the login page when the token expires or the
API responds with `401` or `403`.

New and changed passwords are sent over HTTPS as the `password` field. The
backend validates and hashes them before storage; password hashes are never
returned to the admin app.

Order items are listed with the backend's filtered route:
`/api/order-items/order/:order_id`. The backend does not expose an unfiltered
`GET /api/order-items` route.
