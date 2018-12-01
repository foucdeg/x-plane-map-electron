# Airspaces by @foucdeg

[Become a Patreon!](https://www.patreon.com/foucauld)

Airspaces is an online or self-hosted map for viewing single- or multiplayer X-Plane flight sessions.

![screenshot](./screenshot.png)

## Available Versions

Airspaces comes in three flavours:

 - a [public airspace](https://public.airspaces.app) where anyone can monitor their flight
 - private airspaces: like the above the above but reserved for you. [Contact me](mailto:foucauld.degeorges@gmail.com) for your own private airspace on yourname.airspaces.app
 - local airspaces: download the Electron app using the links below and host a local network-based airspace.

## Source code

You can also self-host, edit and contribute to my apps. Source code is split in three public Github.com repositories:

 - [the client](https://github.com/foucdeg/x-plane-map-client) is the user interface (ReactJS)
 - [the backend](https://github.com/foucdeg/x-plane-map-api) manages data coming from X-Plane and serves it to the client (Node.JS)
 - [the desktop app](https://github.com/foucdeg/x-plane-map-electron) allows users to locally host an airspace (Electron)

## How it Works

X-Plane can be [configured](./XPlaneConfig.md) to send out aircraft location data over the network.
This application listens to those network exchanges and displays your aircraft on an online map.

## FAQ

- `Cannot get /` from mobile device

Your computer's firewall is not allowing your phone to reach the map server on your computer.
The firewall should accept inbound TCP connections to the web server port (port 8080 by default).

- The use of the plugin seems to be slowing down X-Plane

A user experienced X-Plane slowing down while using the map, and their solution was to reduce the UDP rate (in Settings > Data Input and Output > Data Set > bottom right) to 5 or 10 instead of the default 20. Values lower than 5 may cause jitter on the map.

## Want to help?

Thanks for your interest! I gladly accept any help:

- by sending me some feedback or ideas via [email](mailto:foucauld.degeorges@gmail.com) (below) or [Github issue](https://github.com/foucdeg/x-plane-map-electron/issues),
- if you have any coding skills, by contributing with code [on Github](https://github.com/foucdeg/x-plane-map-electron),
- by contributing with any amount of money on [Patreon](https://www.patreon.com/foucauld) to my development costs (mainly developer program certificates to pass security checks).

## Help

If you cannot get the map to work, email me at foucauld.degeorges@gmail.com.

For any bug reports or feature requests/ideas, leave an [issue on Github](https://github.com/foucdeg/x-plane-map-electron/issues).
