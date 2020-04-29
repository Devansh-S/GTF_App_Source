import React, {Component} from 'react';
import './mapControls.scss';

class MapControls extends Component {

    constructor(props) {
        super(props)
        this.state={
            styles: [
                    {key: 1, name: 'Dark', link: 'dark-v10'}, 
                    {key: 2, name: 'Satellite', link: 'satellite-v9'},
                    {key: 3, name: 'Outdoors',link: 'outdoors-v11'},
                    {key: 4, name: 'Light', link: 'light-v10'},
                    {key: 5, name: 'Streets', link: 'streets-v11'}],
    
            types: [{name: 'all', link: 'mapbox://styles/mapbox/all'},
                    {name: 'Flora', link: 'mapbox://styles/mapbox/Flora'}, 
                    {name: 'Fauna', link: 'mapbox://styles/mapbox/Fauna'},
                    {name: 'Disturbances',link: 'mapbox://styles/mapbox/Disturbances'}],  
        }
    }  

    handleStyleClick = (event) => {
        this.props.changeStyle(event)
    }

    handleTypeClick = (event) => {
    }

    render() {
        return (
            <div>
                <div className="dropdown">
                    <button className="dropbtn">Styles</button>
                    <div className="dropdown-content">
                        {this.state.styles.map( (layer, key, idx) => {
                            return <p key={key} name={layer.link} onClick={ () => this.handleStyleClick(layer) }>{layer.name}</p>
                        })}
                    </div>
                </div>

                <div className="dropdown">
                    <button className="dropbtn">Type</button>
                    <div className="dropdown-content">
                        {this.state.types.map( (type, key, idx) => {
                            return <p key={key} name={type.link} onClick={ () => this.handleTypeClick(type) }>{type.name}</p>
                        })}
                    </div>
                </div>
            </div>
        )
    }
};

export default MapControls;