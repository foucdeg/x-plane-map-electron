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

  handleKeys(e) {
    if(e.key === 'Tab') {
      e.preventDefault();
      this.togglePanel();
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
          <div className="buttons">
            <div className="panel-button" onClick={this.togglePanel.bind(this)}>
              { this.state.isPanelOpen ? 'Hide Panel (Tab)' : 'Show Panel (Tab)' }
            </div>
          </div>
        </div>
        <PlanesPanel />
        <div id="errorBox"></div>
      </div>
    );
  }
}
