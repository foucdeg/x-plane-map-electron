import React, { Component } from 'react';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline
} from 'react-google-maps';
import { POLYLINE_OPTIONS, NAV_OVERLAY_OPTIONS, getTileUrlFunction } from '../constants';
import { decodeConfig } from '../helpers';

class Map extends Component {
  constructor() {
    super()
    this.state = {
      openedInfoWindows: {}
    }
    this.mapTilesUrl = decodeConfig().mapTilesUrl;

    this._navOverlay = null;
  }

  toggleInfoWindow(plane) {
    this.setState({
      openedInfoWindows: {
        ...this.state.openedInfoWindows,
        [plane.ip]: !this.state.openedInfoWindows[plane.ip]
      }
    });
  }

  closeInfoWindow(plane) {
    this.setState({
      openedInfoWindows: {
        ...this.state.openedInfoWindows,
        [plane.ip]: false
      }
    });
  }

  onMapLoad(map) {
    if (!map) return;
    this._map = map;

    if (this._navOverlay) return;

    const navOverlayOptions = {
      ...NAV_OVERLAY_OPTIONS,
      tileSize: new google.maps.Size(250, 250),
      getTileUrl: getTileUrlFunction(this._map, google, this.mapTilesUrl)
    };
    this._navOverlay = new google.maps.ImageMapType(navOverlayOptions);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.followedPlane) return;
    let plane = nextProps.planes.find(plane => plane.ip === nextProps.followedPlane);
    if (!plane) return;
    this._map.panTo(plane.position);
  }

  render() {
    return (
      <GoogleMap
        ref={this.onMapLoad.bind(this)}
        defaultZoom={8}
        defaultCenter={{ lat: 0, lng: 0 }}
        onDragStart={this.props.onPlaneLeave}
        overlayMapTypes={[ this._navOverlay ]}
        options={{
          fullscreenControl: false,
          streetViewControl: false
        }}
      >
        { this.props.planes.map(plane => (
          <Marker
            key={plane.ip}
            position={plane.position}
            icon={{
              ...plane.icon,
              fillColor: plane.color,
              rotation: plane.heading
            }}
            onClick={ this.toggleInfoWindow.bind(this, plane) }
          >
            { this.state.openedInfoWindows[plane.ip] && (
              <InfoWindow onCloseClick={ this.closeInfoWindow.bind(this, plane) }>
                <div className="infoWindow">
                  <strong>{ plane.name }</strong><br />
                  { plane.altitude.toFixed() } ft MSL &middot; { plane.heading.toFixed() } &deg; <br />
                  GS { plane.speed.toFixed()} kts
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
        { this.props.planes
          .filter(plane => { return plane.isTraceActive; })
          .map(plane => (
            <Polyline
              key={plane.ip}
              { ...plane.trace}
            />
          ))
        }
      </GoogleMap>
    )
  }
};

export default withGoogleMap(Map);
