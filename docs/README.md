# X-Plane-Map by @foucdeg

![](./screenshot.png)

## How it Works

X-Plane can be configured to send out aircraft location data over the network.
This application listens to those network exchanges and displays your aircraft on a Google Map.

As I have not yet been able to sign the code, you will get a warning about unsafe / unknown app origin. Here is how to get around it:

 - Mac: instead of launching the app the usual way, browse to your Applications folder and right-click its icon. The dialog now allows you to open the app.
 - Windows 10: in the warning window, click the "More Details" link, it should reveal the option to launch it anyway.

## Need help ?

If you cannot get the map to work, email me at foucauld.degeorges@gmail.com.

For any bug reports or feature requests/ideas, leave an [issue on Github](https://github.com/foucdeg/x-plane-map-electron/issues).

## Changelog

### 2.0.0

Version 2.0.0 is a full rewrite of X-Plane Map, using Electron to make it a cross-platform desktop app.
Some added features:

 - New setup page explaining use cases and full configuration
 - Plane icon change
 - Plane trace color varies with altitude
