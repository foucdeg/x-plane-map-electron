# X-Plane Map

## User instructions

https://github.com/foucdeg/x-plane-map-electron/blob/master/docs/README.md

## Info for developers

This is an Electron desktop app for Linux which displays simulated aircraft in X-Plane in real time.

It uses :
 - X-Plane's UDP data output for plane location
 - Leaflet for maps
 
It has multiplayer capabilities, where one computer receives all UDP packets from X-Plane and serves the aircraft position data to everybody over HTTP.
 
On top of being a desktop app, it can also serve the client over HTTP to mobile devices.

## Continuous delivery

CI/CD is set up : if you have an Appveyor and Travis.org account, you can make these platforms build the application and upload it to a draft Github release.  They will do so under the following conditions:

- a draft release is open
- the version number for this draft release (e.g. v2.0.1) matches the version number in `package.json` in the pushed code (e.g. 2.0.1). 

See https://www.electron.build/configuration/publish

