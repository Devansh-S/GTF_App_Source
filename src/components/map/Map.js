import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import './site.scss';
import './MapControls';
import './SidePanel.scss'
import MapControls from './MapControls';
import '../map/mapControls.scss';
import { json } from 'd3-request';
import FireB from '../../config/FireBase';
import SidePanel from './SidePanel';
import {toJson, Options} from 'really-relaxed-json';


class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 26.4499,
      lng: 80.3319,
      zoom: 6,
      style: 'mapbox://styles/mapbox/light-v10',
      Data: 0,
      faunaSpecies: [],
      floraSpecies: [],
      disturbancesTypes: [],

      flora: [],
      fauna: [],
      disturbance: [],

      markerCount: [],

      markedFlora: [],
      markedFauna: [],

    }
  };

  uniq = (a) => {
    return Array.from(new Set(a.sort()));
  }

  makeObjectsFromArray = (array, code, type) => {
    var newArray = []
    for (var i = 0; i < array.length; i++) {
      newArray.push({
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

  fetchRecord = async (value) => {
    const db = FireB.firestore();
    const data = await db.collection("userData").doc(value).collection("Data").get();
    const fireData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    this.setState({flora: this.state.flora.concat(fireData.filter(records => records.FFType === "Flora"))})
    this.setState({fauna: this.state.fauna.concat(fireData.filter(records => records.FFType === "Fauna"))})
    this.setState({disturbance: this.state.disturbance.concat(fireData.filter(records => records.FFType === "Disturbance"))})
    //console.log(this.state.flora)
    //console.log(this.state.fauna)
    //console.log(this.state.disturbance)
  }

  fetchData = async () => {
    const db = FireB.firestore();
    const cdata = await db.collection("userData").get();
    var usr_records = cdata.docs.map(doc => (doc.id))
    this.setState({usr_rec: usr_records})
    //console.log(this.state.usr_rec)
    this.state.usr_rec.forEach(this.fetchRecord)
  };

  handleInputArray = (selectedItemsArray, selectedItem) => {
    if (selectedItem.type === 'Flora'){
      var markedFloraSpecie = []
      var p = this.state.flora.filter(records => records.SpecieName === selectedItem.name)
      //check if there are entries for following species
      var tempObj = {
        name: selectedItem.name,
        count: p.length
      }
      this.state.markerCount.push(tempObj)
      //console.log(this.state.markerCount)
      if (p.length > 0) {
        for (var j=0; j<p.length; j++){
          var long = p[j].Longitude
          var lat = p[j].Latitude
          //console.log(lat)
          
          var obj = {
            type: p[j].FFType,
            subSpecie: p[j]['Sub-Specie'],
            name: p[j].SpecieName,
            cordinate: [long,lat],
            time: p[j].Time,
          }

          if (markedFloraSpecie.indexOf(selectedItem.name) < 0) {
            markedFloraSpecie.push(selectedItem.name)
            this.createCustomizationOptions(obj)
          }
          this.addMarker(obj,j)
        }
      }
    }

    if (selectedItem.type === 'Fauna'){
      //console.log('fauna fired')
      var markedFaunaSpecie = []
      p = this.state.fauna.filter(records => records.SpecieName === selectedItem.name)
      //console.log(p)
      tempObj = {
        name: selectedItem.name,
        count: p.length
      }
      this.state.markerCount.push(tempObj)
      //console.log(this.state.markerCount)
      //check if there are entries for following species
      //console.log(selectedItem.name)
      if (p.length > 0) {
        for ( j =0; j<p.length; j++){
          var long = p[j].Longitude
          var lat = p[j].Latitude
          //console.log(lat)
          obj = {
            type: p[j].FFType,
            subSpecie: p[j]['Sub-Specie'],
            name: p[j].SpecieName,
            cordinate: [long,lat],
            time: p[j].Time,
          }

          if (markedFaunaSpecie.indexOf(selectedItem.name) < 0) {
            markedFaunaSpecie.push(selectedItem.name)
            this.createCustomizationOptions(obj)
          }
          this.addMarker(obj, j)
        }
      }
    }

    if (selectedItem.type === "Disturbance"){
      var markedDisturbance = []
      p = this.state.disturbance.filter(records => records.SpecieName === selectedItem.name)

      tempObj = {
        name: selectedItem.name,
        count: p.length
      }
      this.state.markerCount.push(tempObj)

      //check if there are entries for following species
      //console.log(p)
      if (p.length > 0) {
        for (j =0; j<p.length; j++){
          var long = p[j].Longitude
          var lat = p[j].Latitude
          //console.log(lat)
          obj = {
            type: p[j].FFType,
            subSpecie: p[j]['Sub-Specie'],
            id: 'DTB' + j.toString(),
            name: p[j].SpecieName,
            cordinate: [long,lat],
            time: p[j].Time,
          }
          if (markedDisturbance.indexOf(selectedItem.name) < 0) {
            markedDisturbance.push(selectedItem.name)
            this.createCustomizationOptions(obj)
          }
          this.addMarker(obj,j)
        }
      }
    }
  }
  
  addMarker = (Object, idNum) => {
    var popup = new mapboxgl.Popup({ offset: 5 }).setHTML(`<h6>${Object.name}</h6><strong>${Object.subSpecie}<br>${Object.type}</strong><p>Lat: ${Object.cordinate[1]}<br>Lng: ${Object.cordinate[0]}<br>Lng: ${Object.Time}</p>`);
  
    // create DOM element for the marker
    var el = document.createElement('div');
    el.id = Object.name +'-marker' + idNum.toString();
    el.style.cssText = "background-size: cover; width: 100px; height: 100px; border-radius: 50%; cursor: pointer; background: radial-gradient(circle 15px, #000000 0%, #00000000 100%)"

    // create the marker
    new mapboxgl.Marker(el)
    .setLngLat(Object.cordinate)
    .setPopup(popup)
    .addTo(this.map);
  }

  handleMarkerColorChange = (e) => {
    for (var i=0 ; i<this.state.markerCount.length ; i++ ) {
      if (this.state.markerCount[i].name === e.target.id) {
        for (var j=0; j<this.state.markerCount[i].count ; j++){
          let element = document.getElementById(e.target.id + '-marker' + j.toString() )
          console.log(element)
          ReactDOM.findDOMNode(element).style.background = 'radial-gradient(circle 15px, ' + e.target.value + ' 0%, #00000000 100%)'  
        }
      }
    }
  }

  removemarker = (e) => {
    var flag = false
    var len = 0
    //console.log(this.state.markerCount)
    //console.log(e.target.id)
    var elem1 = document.getElementById( 'sidePanelElement-' + e.target.id)
        elem1.parentNode.removeChild(elem1)
    for (var i=0 ; i<this.state.markerCount.length ; i++ ) {
      if (this.state.markerCount[i].name === e.target.id) {
        flag = true
        len = this.state.markerCount[i].count
        for (var j=0; j<this.state.markerCount[i].count ; j++){
          let elem2 = document.getElementById(e.target.id + '-marker' + j.toString() )
          elem2.parentNode.removeChild(elem2)
        }
      }
    }
    if (flag){
      var tempObj = {
        name: e.target.id,
        count: len
      }
      this.state.markerCount.pop(tempObj)
    }
  }

  createCustomizationOptions = (children) => {  
    var main_parent = document.getElementById('mySidepanel')
    var close = document.createElement('span')
      close.innerHTML = 'x'
      close.className = 'close-btn-marker'
      close.id = children.name
      close.onclick = this.removemarker
    var name = document.createElement('p')
      name.innerHTML = children.name
      name.className = 'sidePanelElement_SpecieName'
    var color = document.createElement('input')
      color.type = 'color'
      color.id = children.name
      color.onchange = this.handleMarkerColorChange;
    var element = document.createElement('div')
      element.className = 'sidePanelElement'
      element.id = 'sidePanelElement-' + children.name
    element.appendChild(name)
    element.appendChild(color) 
    element.appendChild(close)
    main_parent.appendChild(element)
    //ReactDOM.render(element, document.getElementById('mySidepanel'))
  };

  componentDidMount() {
    this.fetchData();
    this.fetchAvaliableSpecies();
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2NTk2IiwiYSI6ImNrOHJsaHY5cDAzcGQzbHBqc21vaWsxcnMifQ.B5rBbh4fDvTHEqQHrGU_Bg';
    const {lat, lng, zoom, style} = this.state
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
              <div ref={el => this.mapContainer = el} className='mapContainer' /> 
              <div className='controlsWrapper'>
                <MapControls 
                  disturbances={this.state.disturbancesTypes} 
                  flora={this.state.floraSpecies} 
                  fauna={this.state.faunaSpecies} 
                  changeStyle={this.handleStyleBtnClick}
                  handleInput={this.handleInputArray}
                  />
                <SidePanel />
              </div>
          </div>
      )
  }
};

export default Map;