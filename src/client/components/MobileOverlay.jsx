/* globals document, window */

import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogContentText } from 'material-ui';
import { decodeConfig } from '../helpers';

class MobileOverlay extends Component {
  constructor() {
    super();

    const config = decodeConfig();
    this.qrCodeUrl = `http://${config.localIP}:${config.mapServerPort}/index.html${document.location.search}`;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeys.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('keydown');
  }

  handleKeys(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.props.onClose();
    }
  }

  render() {
    return (
      <Dialog
        maxWidth="xs"
        open={this.props.visible}
        onClose={this.props.onClose}
      >
        <DialogTitle>Mobile version</DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          <QRCode value={this.qrCodeUrl} size={250} />
          <DialogContentText>
            Scan this code from a mobile device connected to the same network.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }
}

MobileOverlay.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MobileOverlay;
