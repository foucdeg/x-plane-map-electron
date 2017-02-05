const mapConstants = {
  mapOptions: {
    center: { lat: 0,lng: 0},
    zoom: 8
  },
  polyOptions: {
    geodesic: true,
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  },
  markerOptions: {
    icon: {
      path: "M250.2,59.002c11.001,0,20.176,9.165,20.176,20.777v122.24l171.12,95.954v42.779l-171.12-49.501v89.227l40.337," +
      "29.946v35.446l-60.52-20.18-60.502,20.166v-35.45l40.341-29.946v-89.227l-171.14,49.51v-42.779l171.14-95.954v-" +
      "122.24c0-11.612,9.15-20.777,20.16-20.777z",
      scale: 0.1,
      fillOpacity: 1,
      anchor: new google.maps.Point(250,250),
      strokeWeight: 0.5
    }
  },
  colors: [
    "#26764E","#F08526","#9CFF54","#721B49","#A7D8F8",
    "#2AFDBC","#FBE870","#711302","#2572C2","#1C271D",
    "#632E85","#1E5F7A","#D8B2F5","#D307A2","#F391B5",
    "#F180F5","#3A1E2E","#AE7707","#3E3D0E","#6AB06E"
  ]
};

export default mapConstants;
