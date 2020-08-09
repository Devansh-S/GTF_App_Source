import React, {Component} from 'react';
import './mapControls.scss';
import fireB from "../../config/FireBase";
import { Multiselect } from 'multiselect-react-dropdown';

class MapControls extends Component {

    constructor(props) {
        super(props)
        this.state={
            styles: [{key: 1, name: 'Dark', link: 'dark-v10'}, 
                    {key: 2, name: 'Satellite', link: 'satellite-streets-v11'},
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

    handleLogout = () => {
        fireB.auth().signOut()
    }

    onSelect = (selectedList, selectedItem) => {
        this.props.handleInput(selectedList, selectedItem)
    }

    render() {
        return (
            <div className='MapControls'>
                <input type="checkbox" id="toggle" />
                <div className='col0'>
                    <div className='controlsInner'>    
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
                                <button className="dropbtn">Disturbances</button>
                                <div className="dropdown-content">
                                    <Multiselect
                                        options={this.props.disturbances} // Options to display in the dropdown
                                        selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                        onSelect={this.onSelect} // Function will trigger on select event
                                        onRemove={this.onRemove} // Function will trigger on remove event
                                        displayValue="name" // Property name to display in the dropdown options
                                    />
                                </div>
                            </div>
                            <div className="dropdown">
                                <button className="dropbtn">Flora</button>
                                <div className="dropdown-content">
                                    <Multiselect
                                        options={this.props.flora} // Options to display in the dropdown
                                        selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                        onSelect={this.onSelect} // Function will trigger on select event
                                        onRemove={this.onRemove} // Function will trigger on remove event
                                        displayValue="name" // Property name to display in the dropdown options
                                    />
                                </div>
                            </div>
                            <div className="dropdown">
                                <button className="dropbtn">Fauna</button>
                                <div className="dropdown-content">
                                    <Multiselect
                                        options={this.props.fauna} // Options to display in the dropdown
                                        selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                        onSelect={this.onSelect} // Function will trigger on select event
                                        onRemove={this.onRemove} // Function will trigger on remove event
                                        displayValue="name" // Property name to display in the dropdown options
                                    />
                                </div>
                            </div>
                            <div className="dropdown">
                                <button className="dropbtn" onClick={this.handleLogout}>Logout</button>
                            </div>
                        </div>
                    </div>

                    <label htmlFor="toggle">
                        <div className='toggleBtn1'>
                            <div className="arrow-right"></div>
                        </div>
                    </label>
                </div>
            </div>
        )
    }
};

export default MapControls;