# Word Connect privacy site

This Node.js service serves the public privacy policy at `/` and a JSON health
check at `/health`. The policy includes the Word Connect app icon and identifies
the developer as Akarshan (`akarshan817@gmail.com`).

## Run locally

From this directory, run `npm start` and open `http://localhost:3000`.

## Deploy to Render

The repository-root `render.yaml` defines the Render web service. Push this
repository to GitHub, then in Render choose **New → Blueprint** and select the
repository containing that file. Render will build and deploy the web service.
Its public page URL will be shown in the Render dashboard, usually
`https://word-connect-privacy.onrender.com/` if that service name is available.

## Two-minute health-check process

`keep-alive.js` is a separate Node process that requests the configured
`KEEPALIVE_URL` immediately and then every two minutes. Set it to the deployed
service's `/health` URL, for example
`https://word-connect-privacy.onrender.com/health`, and run `npm run keepalive`
on an always-on host.

This pinger must run independently of the web service it checks. A pinger
running inside the same Render service stops when that service sleeps, and
periodic requests should not be treated as a guarantee that a free Render web
service stays awake. Use an always-on Render instance or another external
always-on host if uninterrupted availability is required.
