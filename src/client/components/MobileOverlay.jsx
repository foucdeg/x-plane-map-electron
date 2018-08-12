/* globals window */

import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import url from 'url';
import CopyToClipboard from 'react-copy-to-clipboard';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import DoneIcon from '@material-ui/icons/Done';
import LinkIcon from '@material-ui/icons/Link';
import { decodeConfig } from '../helpers';

class MobileOverlay extends Component {
  constructor() {
    super();

    const config = decodeConfig();
    this.qrCodeUrl = url.format({
      protocol: 'http',
      hostname: config.localIP,
      port: config.mapServerPort,
      pathname: '/app.html',
      query: {
        mode: 'remote',
        remoteServerIP: config.localIP,
        remoteMapServerPort: config.mapServerPort,
      },
    });
    this.state = {
      wasCopied: false,
    };
    this.handleCopy = this.handleCopy.bind(this);
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

  handleCopy() {
    this.setState({ wasCopied: true });
  }

  render() {
    return (
      <Dialog
        maxWidth="xs"
        open={this.props.visible}
        onClose={this.props.onClose}
      >
        <DialogContent style={{ textAlign: 'center' }}>
          <DialogContentText>
            The below link is an URL to display this map in your Web browser
            or on another device on this network.
          </DialogContentText>
          <div id="qrcode">
            <QRCode value={this.qrCodeUrl} size={250} />
          </div>
          <CopyToClipboard text={this.qrCodeUrl} onCopy={this.handleCopy}>
            {this.state.wasCopied ? (
              <Button size="small" variant="raised" disabled color="primary">
                <DoneIcon />&nbsp;
                Link copied
              </Button>
            ) : (
              <Button size="small" variant="raised" color="primary">
                <LinkIcon />&nbsp;
                Click to copy the link
              </Button>
            )}
          </CopyToClipboard>
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
