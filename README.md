# Repository archived

This repository holds the desktop app for [airspaces.app](https://airspaces.app).

The repository for the online version of Airspaces is located at [foucdeg/airspaces](https://github.com/foucdeg/airspaces). The desktop app is here, but no longer in active development. This is why this repositoryu is archived.

For any questions, you are welcome to either post an issue on [foucdeg/airspaces](https://github.com/foucdeg/airspaces) or send me an email at foucauld.degeorges@gmail.com .

# Airspaces desktop app

## User instructions

See [the website](https://airspaces.app) and [its source files](/docs).

## Info for developers

This is an Electron desktop app for Windows, Mac and Linux which displays simulated aircraft in X-Plane in real time.
It runs with X-Plane 9 through 11.

It uses :
 - X-Plane's UDP data output for plane location
 - Leaflet for maps

It has multiplayer capabilities: provided that one computer receives the UDP packets from every pilot's X-Plane instance, it can serve the aircraft position data to everybody over HTTP.

On top of being a desktop app, it can also serve the client over HTTP to mobile devices.

## Running locally

You need NodeJS v8 and Yarn latest.

```
git clone git@github.com:foucdeg/x-plane-map-electron.git # or your fork
cd x-plane-map-electron
yarn
# then in three distinct terminals:
yarn start # run Electron
yarn watch # rebuild js files on change
yarn fake # optional: simulates a plane flying over France at a rather high airspeed
```

## Continuous delivery

CI/CD is set up : if you have an Appveyor and Travis.org account, you can make these platforms build the application and upload it to a draft Github release.  They will do so under the following conditions:

- a draft release is open
- the version number for this draft release (e.g. v2.0.1) matches the version number in `package.json` in the pushed code (e.g. 2.0.1).

See https://www.electron.build/configuration/publish for more.

