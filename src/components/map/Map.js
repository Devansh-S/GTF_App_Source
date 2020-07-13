import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import './site.scss';
import './MapControls';
import MapControls from './MapControls';
import '../map/mapControls.scss';
import { json } from 'd3-request';
import FireB from '../../config/FireBase';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 26.4499,
      lng: 80.3319,
      zoom: 6,
      style: 'mapbox://styles/mapbox/light-v10',
      activeType: 'all',
      Data: 0,
      faunaSpecies: [],
      floraSpecies: [],
      disturbancesTypes: [],

      flora: [],
      fauna: [],
      disturbance: [],
    }
  };

  uniq = (a) => {
    return Array.from(new Set(a.sort()));
  }

  makeObjectsFromArray = (array, code, type) => {
    var newArray = []
    for (var i = 0; i < array.length; i++) {
      newArray.push(
        {
        name: array[i],
        id: code + i.toString(),
        type: type,
        }
    )}
    return newArray
  }
    
  fetchAvaliableSpecies = async () => {
    const db = FireB.firestore();
    const data = await db.collection("MainData").get();
    var edata = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    //this.setState(allDistricts = edata[0])
    //console.log(edata)

    //filtering Fauna and saving all sepcies in state
    const birds = edata[0].Birds
    const mammels = edata[0].Mammals
    const allFauna = this.makeObjectsFromArray(this.uniq(birds.concat(mammels)), 'FNA', 'Fauna')
    this.setState({faunaSpecies: allFauna})
    //console.log(this.state.faunaSpecies)

    //filtering Flora and saving all sepcies in state
    const tree = edata[1].Tree
    const grass = edata[1].Grass
    const shrub = edata[1].Shurb
    const allFlora = this.makeObjectsFromArray(this.uniq(tree.concat(grass,shrub)), "FLA", 'Flora')
    this.setState({floraSpecies: allFlora})
    //console.log(this.state.floraSpecies)

    //filtering Disturbances and saving all its types in state
    const NTFP_collection = edata[2]['NTFP collection']
    const Sand_Mining = edata[2]['Sand Mining']
    const Human = edata[2]['Human']
    const Activity_site = edata[2]['Activity site']
    const livestock = edata[2]['livestock']
    const allDisturbances = this.makeObjectsFromArray(this.uniq(NTFP_collection.concat(Sand_Mining, Human, Activity_site, livestock)), 'DTB', 'Disturbance')
    this.setState({disturbancesTypes: allDisturbances})
    //console.log(allDisturbances)
  };

  fetchData = async () => {
    const db = FireB.firestore();
    const data = await db.collection("userData/9839576859/Data").get();
    const fireData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    this.setState({flora: fireData.filter(records => records.FFType === "Flora")})
    this.setState({fauna: fireData.filter(records => records.FFType === "Fauna")})
    this.setState({disturbances: fireData.filter(records => records.FFType === "Disturbance")})
    console.log(this.state.flora)
    console.log(this.state.fauna)
    console.log(this.state.disturbances)
  };

  getCoordinatesFromObjectArray = () => {
    
  };

  makeCoordinateObjects = () => {
      
  };

  handleInputArray = (selectedItemsArray, selectedItem) => {

    console.log('Input Inbound',selectedItem)

    if (selectedItem.type === 'Flora'){
      var markedFaunaSpecie = []

      var p = this.state.flora.filter(records => records.SpecieName === selectedItem.name)
      //check if there are entries for following species
      console.log(p)
      console.log('fired')
      if (p.length > 0) {
        for (var j =0; j<p.length; j++){
          console.log('inner-fired',j)
          var long = parseFloat(p[j].Location.substring(12,22))
          var lat = parseFloat(p[j].Location.substring(34,44))
          //console.log(p[j])
          var obj = {
            type: p[j].FFType,
            subSpecie: p[j]['Sub-Specie'],
            name: p[j].SpecieName,
            cordinate: [long,lat],
            time: p[j].Time,
            color: 'red',
          }

          if (markedFaunaSpecie.indexOf(selectedItem.name) < 0) {
            markedFaunaSpecie.push(selectedItem.name)
            this.createCustomizationOptions(obj)
          }
          console.log(markedFaunaSpecie)
          this.addMarker(obj)
        }
      }
    }

    if (selectedItem.type === 'Fauna'){
      //console.log('fauna fired')
      var markedFloraSpecie = []
      p = this.state.fauna.filter(records => records.SpecieName === selectedItem.name)
      //check if there are entries for following species
      //console.log(selectedItem.name)
      if (p.length > 0) {
        for ( j =0; j<p.length; j++){
          long = parseFloat(p[j].Location.substring(12,22))
          lat = parseFloat(p[j].Location.substring(34,44))
          //console.log(p[j])
          obj = {
            type: p[j].FFType,
            subSpecie: p[j]['Sub-Specie'],
            name: p[j].SpecieName,
            cordinate: [long,lat],
            time: p[j].Time,
            color: 'red',
          }
          if (markedFloraSpecie.indexOf(selectedItem.name) < 0) {
            markedFloraSpecie.push(selectedItem.name)
            this.createCustomizationOptions(obj)
          }
          this.addMarker(obj)
        }
      }
    }
    if (selectedItem.type === 'l'){
      var p = this.state.flora.filter(records => records.SpecieName === selectedItem.name)
      //check if there are entries for following species
      if (p.length > 0) {
        for (var j =0; j<p.length; j++){
          long = parseFloat(p[j].Location.substring(12,22))
          lat = parseFloat(p[j].Location.substring(34,44))
          //console.log(p[j])
          obj = {
            type: p[j].FFType,
            subSpecie: p[j]['Sub-Specie'],
            name: p[j].SpecieName,
            cordinate: [long,lat],
            time: p[j].Time,
            color: 'red',
          }
          console.log('flora-obj',obj)
          this.createCustomizationOptions(obj)
          this.addMarker(obj)
        }
      }
    }
  }

  
  addMarker = (Object) => {
    var popup = new mapboxgl.Popup({ offset: 5 }).setHTML('<h6>' + Object.name + '</h6><strong>' + Object.subSpecie + '<br>' + Object.type + '</strong><p>' + 'Lat: ' + Object.cordinate[1] + '<br>' + 'Lng: ' + Object.cordinate[0] + '</p>');

    // create DOM element for the marker
    var el = document.createElement('div');
    el.id = 'marker';
    // console.log(Object.cordinate)
    // create the marker
    new mapboxgl.Marker(el)
    .setLngLat(Object.cordinate)
    .setPopup(popup)
    .addTo(this.map);
  }

  createCustomizationOptions = (children) => {  
    console.log(children.name)
    var main_parent = document.getElementById('mySidepanel')
    var name = document.createElement('p')
    name.innerHTML = children.name
    name.className = 'sidePanelElement_SpecieName'
    var element = document.createElement('div')
    element.className = 'sidePanelElement'
    element.appendChild(name)
    main_parent.appendChild(element)
    //ReactDOM.render(element, document.getElementById('mySidepanel'))
  };

  k = (m) => {
    return <div className='sidePanelElement'><p>{m}</p></div>
  }

  componentDidMount() {
    this.fetchData();
    this.fetchAvaliableSpecies();
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
              <MapControls 
                disturbances={this.state.disturbancesTypes} 
                flora={this.state.floraSpecies} 
                fauna={this.state.faunaSpecies} 
                changeStyle={this.handleStyleBtnClick}
                handleInput={this.handleInputArray}
                />
              <div ref={el => this.mapContainer = el} className='mapContainer' />
          </div>
      )
  }
};

export default Map;