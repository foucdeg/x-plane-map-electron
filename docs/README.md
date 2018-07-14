# X-Plane-Map by @foucdeg

[Become a Patreon!](https://www.patreon.com/foucauld)

![](./screenshot.png)

## How it Works

X-Plane can be [configured](./XPlaneConfig.md) to send out aircraft location data over the network.
This application listens to those network exchanges and displays your aircraft on a Google Map.

## Multiplayer mode

Flying with friends? The map can handle that. Instructions are detailed in the setup screen.

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
