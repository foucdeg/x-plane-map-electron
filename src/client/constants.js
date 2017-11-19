/* eslint new-cap: "off" */
import Leaflet from 'leaflet';

export const PERIOD = 1000;

export const POLYLINE_OPTIONS = {
  outlineWidth: 0,
  weight: 3,
  palette: {
    0: '#62FDED',
    1: '#2F006B',
  },
  min: 0,
  max: 50000,
};

export const ICONS = {
  airliner: 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDUxMCA1MTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMCA1MTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iZmxpZ2h0cyI+CgkJPHBhdGggZD0iTTUxMCwyNTVjMC0yMC40LTE3Ljg1LTM4LjI1LTM4LjI1LTM4LjI1SDMzMS41TDIwNCwxMi43NWgtNTFsNjMuNzUsMjA0SDc2LjVsLTM4LjI1LTUxSDBMMjUuNSwyNTVMMCwzNDQuMjVoMzguMjUgICAgbDM4LjI1LTUxaDE0MC4yNWwtNjMuNzUsMjA0aDUxbDEyNy41LTIwNGgxNDAuMjVDNDkyLjE1LDI5My4yNSw1MTAsMjc1LjQsNTEwLDI1NXoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K',
  fighter: 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDU0OC4xNzkgNTQ4LjE3OSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTQ4LjE3OSA1NDguMTc5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTU0Ny44ODgsMjczLjIzN2MtNC45NDgtNi42NjEtMzIuMjY0LTE1LjUxMy04MS45NC0yNi41NTFsLTEwMC41MDItOS4xMzVsLTYzLjk1My0xOC4yNzNoLTE4LjI2OEwxOTkuNTY4LDExOC43OGgxOS42OTggICBjNC45NTIsMCw5LjIzNC0wLjQyOCwxMi44NS0xLjI4N2MzLjYxNy0wLjg1OSw1LjQyNC0xLjk1Miw1LjQyNC0zLjI4NGMwLTEuMzMxLTEuODA3LTIuNDI0LTUuNDI0LTMuMjg0ICAgYy0zLjYxNi0wLjg1NS03Ljg5OC0xLjI4NS0xMi44NS0xLjI4NUgxOTEuODZoLTQ1LjY3OWgtMTguMjc0djkuMTM1aDE4LjI3NHYxMTguNzcxaC00NS42ODNsLTU0LjgxOC02My45NTRIMTguMjc0bC05LjEzNiw5LjEzNiAgIHY1NC44MThoOS4xMzZ2OS4xMzVoMzYuNTQ3djIuMjg0TDAsMjU1LjgxOHYzNi41NDZsNTQuODIxLDYuODUxdjIuMjgzSDE4LjI3NHY5LjEzSDkuMTM5djU0LjgyM2w5LjEzNiw5LjEzNGgyNy40MDZsNTQuODE4LTYzLjk1NCAgIGg0NS42ODN2MTE4Ljc3N2gtMTguMjc0djkuMTNoMTguMjc0aDQ1LjY3OWgyNy40MDdjNC45NTIsMCw5LjIzNC0wLjQyNSwxMi44NS0xLjI4YzMuNjE3LTAuODYyLDUuNDI0LTEuOTU0LDUuNDI0LTMuMjg4ICAgYzAtMS4zMzEtMS44MDctMi40MjctNS40MjQtMy4yODljLTMuNjE2LTAuODU1LTcuODk4LTEuMjgtMTIuODUtMS4yOGgtMTkuNjk4bDgzLjY1Ni0xMDAuNTAyaDE4LjI2OGw2My45NTMtMTguMjczbDEwMC41MDYtOS4xMzEgICBjNTQuNjI1LTEyLjE4Myw4Mi4wMzYtMjEuMzIsODIuMjI4LTI3LjQwOEw1NDcuODg4LDI3My4yMzd6IiBmaWxsPSIjMDAwMDAwIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==',
  helicopter: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABj1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/mIOgAAAAhHRSTlMAAQIEBwgJCw0ODxARExUWGBkaHSAhJygsLS4vMDE4OT1BREZHTE9QVFVWV1haW11eYWJkZWZoaW5xc3R1dnh5ent8fX5/gIGHi46QkZSVl5mdn6Ooq6yusLGztLa5uru8vcXIysvP0NHS1Nrf4eTm6Onq6+zt7vDx8vT19/j5+vv8/f6MgG1qAAAB20lEQVR4Ae3W57PSQBQF8Pss+iw+fBaw94KoKBbEAooUey8iiqhYREWBEIuigpw/3LkTZzBkc13Y9zG/T9nsPWdChswsBQJq8xaTtmnyWtn4nCI96+s/jpNHHEBGL28BzxRP1QJwVjOPQ6qNtlbDBs4XiCkbzunk80STNmzsOHmpIfu/fI6Y3CDlzxOJDcLIJiGv08D54eMdTib3+TfkVHnb9YpvAtg9TsNm2/03iQyAj8v9G/Jinj0GcIc0GxZusz2fyg4A2Cs0FIiF0zfKryyw79f2LKF/1AE0V4gNodRLuPSeZ4c/O8F37pLQ8KIHr0/pReRY0OR1VGpQ+xAjR55X7RlSmirD1+8DzsxMl1f3SekSBL92OUO3wColhQpE32aJZTCxY6YFD00LbNOCqmnBGWLXwV7XFN5A9DPM+aVf+foJKd2DYHCQ2Cm+/rKalLZAcJrY/AZfHxn7U4B11JmJ8eKRkL9a6sOrd2UZOWr8bc765zNEq7Lv4fb2YoT+2srruJRnUzsv3H76rguGTmrtyGt+IOeHQuu2j95c0weskJwXb18GEJXz8sbJYvGEnNffkof0G+QRedt8wPwRzV+SnNcZm27JeXfDfpOjLjdUDQ/b3cScHPcDgT//cBAFb0tnVwAAAABJRU5ErkJggg=='
};

export const BUILT_ICONS = Object.assign(
  {},
  ...Object.keys(ICONS).map(iconName => ({
    [iconName]: new Leaflet.icon({
      iconUrl: ICONS[iconName],
      iconSize: [30, 30],
    }),
  })),
);

export const COLORS = [
  '#26764E', '#F08526', '#9CFF54', '#721B49', '#A7D8F8',
  '#2AFDBC', '#FBE870', '#711302', '#2572C2', '#1C271D',
  '#632E85', '#1E5F7A', '#D8B2F5', '#D307A2', '#F391B5',
  '#F180F5', '#3A1E2E', '#AE7707', '#3E3D0E', '#6AB06E',
];

export const NAV_OVERLAY_OPTIONS = {
  minZoom: 6,
  maxZoom: 12,
};
