# X-Plane-Map by @foucdeg

![](./screenshot.png)

## How it Works

X-Plane can be configured to send out aircraft location data over the network.
This application listens to those network exchanges and displays your aircraft on a Google Map.

## Multiplayer mode

Flying with friends? The map can handle that. Instructions are detailed in the setup screen.

## FAQ

- `Javascript Error: Port 8080 or 49003 already in use`

Dismiss the error, then navigate to the setup screen, Advanced Setup tab, and change that port's value.

- `Cannot get /` from mobile version

Your computer's firewall is not allowing your phone to reach the map server on your computer.
The firewall should accept inbound TCP connections to the web server port (port 8080).

If you cannot get the map to work, email me at foucauld.degeorges@gmail.com.

For any bug reports or feature requests/ideas, leave an [issue on Github](https://github.com/foucdeg/x-plane-map-electron/issues).

## Changelog

### 2.1.1

Emergency config bugfixes

### 2.1.0

- Updated UI to use Material Design
- Added a fourth plane icon representing a general aviation plane
- Icons now have white outline for better visibility against dark backgrounds

### 2.0.3

Added code signing for Mac

### 2.0.2

Automatic builds and Linux version successful this time!

Still need someone to try the Linux version though.

### 2.0.1

Failed attempt at setting up automatic release build and Linux version.

### 2.0.0

Version 2.0.0 is a full rewrite of X-Plane Map, using Electron to make it a cross-platform desktop app.
Some added features:

 - New setup page explaining use cases and full configuration
 - Plane icon change
 - Plane trace color varies with altitude
