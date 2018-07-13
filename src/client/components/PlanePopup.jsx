import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'react-leaflet';
import { formatLatLon } from '../helpers';

const PlanePopup = ({ plane }) => (
  <Popup>
    <div className="info-window">
      <strong>{plane.name}</strong><br />
      {plane.altitude.toLocaleString('en-us', { maximumFractionDigits: 0 })} ft &middot; &nbsp;
      {plane.heading.toLocaleString('en-us', { maximumFractionDigits: 0 })} &deg; <br />
      GS {plane.speed.toLocaleString('en-us', { maximumFractionDigits: 0 })} kts <br />
      {formatLatLon(plane.position)}
    </div>
  </Popup>
);

PlanePopup.propTypes = {
  plane: PropTypes.shape({
  }).isRequired,
};

export default PlanePopup;
