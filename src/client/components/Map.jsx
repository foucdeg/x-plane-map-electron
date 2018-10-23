/* eslint no-underscore-dangle: ["error", { "allow": ["_zoom"] }] */

import React, { Component } from 'react';
import { Map as LeafletMap, LayersControl, TileLayer } from 'react-leaflet';
import PropTypes from 'prop-types';

import { POLYLINE_OPTIONS, BUILT_ICONS } from '../constants';
import { decodeConfig } from '../helpers';
import Trace from './Trace';
import GoogleMapLayer from './GoogleMapLayer';
import GoogleSatelliteLayer from './GoogleSatelliteLayer';
import GoogleTerrainLayer from './GoogleTerrainLayer';
import PlanePopup from './PlanePopup';
import RotatingMarker from './RotatingMarker';

require('leaflet.gridlayer.googlemutant');

const navTiles = 'https://{s}.gis.flightplandatabase.com/tile/nav/{z}/{x}/{y}.png';
const navLayerAttribution = '<a href=“https://flightplandatabase.com”>Flight Plan Database</a>';

class Map extends Component {
  constructor() {
    super();
    this.state = {
      currentPosition: [0, 0],
      zoom: 8,
    };
    this.mapTilesUrl = decodeConfig().mapTilesUrl;
    this.handleZoom = this.handleZoom.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.followedPlane) return;
    const plane = nextProps.planes.find(aPlane => aPlane.ip === nextProps.followedPlane);
    if (!plane) return;
    this.setState({
      currentPosition: plane.position,
    });
  }

  handleZoom(e) {
    this.setState({
      zoom: e.target._zoom,
    });
  }

  render() {
    return (
      <LeafletMap
        center={this.state.currentPosition}
        zoom={this.state.zoom}
        onDragstart={this.props.onPlaneLeave}
        onZoomend={this.handleZoom}
      >
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer name="Roads" checked>
            <GoogleMapLayer />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <GoogleSatelliteLayer />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terrain">
            <GoogleTerrainLayer />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="Navaids">
            <TileLayer url={navTiles} attribution={navLayerAttribution} />
          </LayersControl.Overlay>
        </LayersControl>
        { this.props.planes.map(plane => (
          <React.Fragment key={plane.ip}>
            <RotatingMarker
              position={plane.position}
              icon={BUILT_ICONS[plane.icon]}
              rotationAngle={plane.heading}
              rotationOrigin="initial"
            >
              <PlanePopup plane={plane} />
            </RotatingMarker>
            { plane.isTraceActive && (
              <Trace
                {...POLYLINE_OPTIONS}
                positions={plane.path}
              />
            )}
          </React.Fragment>
        ))}
      </LeafletMap>
    );
  }
}

Map.propTypes = {
  followedPlane: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  planes: PropTypes.arrayOf(PropTypes.any).isRequired,
  onPlaneLeave: PropTypes.func.isRequired,
};

Map.defaultProps = {
  followedPlane: null,
};

export default Map;
