import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import '../map/site.scss';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2NTk2IiwiYSI6ImNrOHJsaHY5cDAzcGQzbHBqc21vaWsxcnMifQ.B5rBbh4fDvTHEqQHrGU_Bg';


class MapControls extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            };
        }
    
    componentDidMount() {
        var map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [80.3319, 26.4499],
            zoom: 6
            });
        
        map.on('load', () => {
        // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.

            map.addSource('earthquakes', {
                'type': 'geojson',
                'data':
                'https://raw.githubusercontent.com/Devansh-S/shapefiles/master/state_ut/jj.geojson'
                });
        
            map.addLayer({
                        'id': 'earthquakes',
                        'type': 'line',
                        'source': 'earthquakes',
                        'layout': {
                                    'line-join': 'round',
                                    'line-cap': 'round'
                                },
                        'paint': {
                                    'line-color': 'rgb(255,128,0)',
                                    'line-width': 10
                                }
                        }
                    );
                

            }
        );
    }

    render() {
        return (
            <div>
                <div className='sidebarStyle'>
                </div>
                <div ref={el => this.mapContainer = el} className='mapContainer' />
            </div>
        )
    }
};

export default MapControls;