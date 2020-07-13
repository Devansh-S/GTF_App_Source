import React from 'react';
import mapboxgl from 'mapbox-gl';
import './site.scss';
import './MapControls';
import MapControls from './MapControls';
import '../map/mapControls.scss';
import { json } from 'd3-request';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 26.4499,
            lng: 80.3319,
            zoom: 6,
            style: 'mapbox://styles/mapbox/light-v10',
            activeType: 'all',   
        }
    };

    componentDidMount() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2NTk2IiwiYSI6ImNrOHJsaHY5cDAzcGQzbHBqc21vaWsxcnMifQ.B5rBbh4fDvTHEqQHrGU_Bg';
        const {lat, lng, zoom, style, activeType} = this.state
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: style,
            center: [lng, lat],
            zoom: zoom
            });

        this.map.on('load', async () => {
          this.map.addSource('earthquakes', {  'type': 'geojson',
                                          'data':
                                          'https://raw.githubusercontent.com/Devansh-S/shapefiles/master/state_ut/jj.geojson'
                                      }
                      );
  
          this.map.addLayer({
                          'id': 'earthquakes',
                          'type': 'line',
                          'source': 'earthquakes',
                          'layout': {
                                      'line-join': 'round',
                                      'line-cap': 'round'
                                  },
                          'paint': {
                                      'line-color': 'rgb(255,0,0)',
                                      'line-width': 2
                                  }
                      }
                  )
          });
    }

    swapStyle(styleID) {
      var currentStyle = this.map.getStyle();
      json(`https://api.mapbox.com/styles/v1/mapbox/${styleID}?access_token=${mapboxgl.accessToken}`, (newStyle) => {
        newStyle.sources = Object.assign({}, currentStyle.sources, newStyle.sources); // ensure any sources from the current style are copied across to the new style
        var labelIndex = newStyle.layers.findIndex((el) => { // find the index of where to insert our layers to retain in the new style
          return el.id === 'waterway-label';
        });
        var appLayers = currentStyle.layers.filter((el) => { // app layers are the layers to retain, and these are any layers which have a different source set
          return (el.source && el.source !== "mapbox://mapbox.satellite" && el.source !== "composite");
        });
        appLayers.reverse(); // reverse to retain the correct layer order
        appLayers.forEach((layer) => {
          newStyle.layers.splice(labelIndex, 0, layer); // inset these layers to retain into the new style
        });
        this.map.setStyle(newStyle); // now setStyle
      });
    }

    handleStyleBtnClick = event => {
      let styleID = event.link;
      this.setState({style: styleID})
      this.swapStyle(styleID)
    }

    render() {
        return (
            <div>
                <MapControls Layers={this.state.styles} Types={this.state.types} changeStyle={this.handleStyleBtnClick} changeType={this.handleTypeBtnClick}/>
                <div ref={el => this.mapContainer = el} className='mapContainer' />
            </div>
        )
    }
};

export default Map;