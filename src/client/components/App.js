import React, { Component } from 'react';
import PlanesMap from '../containers/PlanesMap';
import PlanesPanel from '../containers/PlanesPanel';
import '../stylesheets/map.less';
import { COLORS, MARKER_OPTIONS } from '../constants';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      isPanelOpen: false,
      isNavOverlayVisible: false,
    }
  }

  handleMapLoad(map) {
    if (!map) return;
    this._map = map.getWrappedInstance();
  }

  togglePanel() {
    this.setState({
      isPanelOpen: !this.state.isPanelOpen
    });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }

  toggleNavOverlay() {
    this.setState({
      isNavOverlayVisible: !this.state.isNavOverlayVisible
    });
  }

  handleKeys(e) {
    if(e.key === 'Tab') {
      e.preventDefault();
      this.togglePanel();
    }
    if(e.key === 'n' && e.target.tagName !== 'input') {
      e.preventDefault();
      this.toggleNavOverlay();
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeys.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('keydown');
  }

  render() {
    return (
      <div>
        <div id="map-canvas-wrapper" className={ this.state.isPanelOpen ? 'shrinked' : ''}>
          <PlanesMap
            ref={ this.handleMapLoad.bind(this) }
            containerElement={
              <div style={{ height: `100%` }} />
            }
            mapElement={
              <div style={{ height: `100%` }} />
            }
          />
          <div id="panel-button" onClick={this.togglePanel.bind(this)}>
            { this.state.isPanelOpen ? 'Hide Panel (Tab)' : 'Show Panel (Tab)' }
          </div>
          <div id="navaids-button" onClick={this.toggleNavOverlay.bind(this)}>
            { this.state.isNavOverlayVisible ? 'Hide Navaids (N)' : 'Show Navaids (N)' }
          </div>
        </div>
        <PlanesPanel />
        <div id="errorBox"></div>
      </div>
    );
  }
}
