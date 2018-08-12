/* global window, Event */
/* eslint no-underscore-dangle: ["error", { "allow": ["_map"] }] */

import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer/Drawer';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PlanesMap from '../containers/PlanesMap';
import PlanesPanel from '../containers/PlanesPanel';
import MobileOverlay from './MobileOverlay';
import '../stylesheets/map.less';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      isPanelOpen: false,
      isMobileOverlayVisible: false,
    };

    this.togglePanel = this.togglePanel.bind(this);
    this.handleMapLoad = this.handleMapLoad.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeys.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('keydown');
  }

  handleMapLoad(map) {
    if (!map) return;
    this._map = map.getWrappedInstance();
  }

  togglePanel() {
    this.setState({
      isPanelOpen: !this.state.isPanelOpen,
    });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }

  handleKeys(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      this.togglePanel();
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id="map-canvas-wrapper" className={this.state.isPanelOpen ? 'shrinked' : ''}>
          <PlanesMap
            ref={this.handleMapLoad}
            containerElement={<div style={{ height: '100%' }} />}
            mapElement={<div style={{ height: '100%' }} />}
          />
          <div className="buttons">
            <Tooltip title="Open map elsewhere">
              <Button
                size="small"
                variant="raised"
                onClick={() => this.setState({ isMobileOverlayVisible: true })}
              >
                <OpenInNewIcon />
              </Button>
            </Tooltip>
            <Tooltip title={this.state.isPanelOpen ? 'Hide panel' : 'Show panel'}>
              <Button size="small" variant="raised" color="primary" onClick={this.togglePanel}>
                <MenuIcon />
              </Button>
            </Tooltip>
          </div>
        </div>
        <Drawer variant="persistent" anchor="right" open={this.state.isPanelOpen}>
          <PlanesPanel />
        </Drawer>
        <MobileOverlay
          visible={this.state.isMobileOverlayVisible}
          onClose={() => this.setState({ isMobileOverlayVisible: false })}
        />
      </React.Fragment>
    );
  }
}
