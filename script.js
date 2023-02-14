// This token connects my map to my Mapbox account and gives access to the Mapbox API
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhuZWUiLCJhIjoiY2xkdnp0dmExMDJreDNwcXd6ajY1cHp1cSJ9.JkrzcmpJLmS8dzQwqlCcRg';

/* 
    Creates new constant variable called map, which is connected to the map container in the html file
    Style of the map is based on the style made in Mapbo
    Map is automatically centered to Toronto, with a zoom of 9
*/
const map = new mapboxgl.Map({
    container:'map',
    style:'mapbox://styles/stephnee/cldw19hpq000001qdec8pey8a',
    center: [-79.347015, 43.651070],
    zoom: 9,
});

// This function loads the data layers of the map from the specified sources
map.on('load',() => {
    
    map.resize();   // This allowed me to change the size of the map
    
    map.addSource('mymappeddata',{
        type:'geojson',
        data: 'https://neesteph.github.io/Lab1/mymappeddata.geojson' // This adds the GeoJSON file as a source called mymappeddata
    });

    // This adds the "Name" layer from the GeoJSON file so that each point feature is labelled by the venue name
    map.addLayer({
        'id': 'name',
        'type': 'symbol',
        'source': 'mymappeddata',
        'layout': {
            'text-field': ['get', 'Name'],
            'text-variable-anchor': ['bottom'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto',
            'text-allow-overlap': true
        }
    });

    // This changes the sybmols to a wedding ring icon, given by the image link below
    map.loadImage('https://uxwing.com/wp-content/themes/uxwing/download/relationship-love/wedding-rings-icon.png',
    (error, image) => {
        if (error) throw error;
        map.addImage('rings-icon', image, { 'sdf': true }); 
            /*
                Icon image ID as "rings-icon"
                SDF boolean enables SDF, which helps maintain the quality of the image/icon
            */

        // This adds the venue types layer from the GeoJSON file
        map.addLayer({
            'id':'wedding-venues',
            'type':'symbol',
            'source': {
                'type':'geojson',
                'data': 'https://neesteph.github.io/Lab1/mymappeddata.geojson'
            },
            'layout': {
                'icon-image': 'rings-icon',
                'icon-size': 0.1,
                'icon-allow-overlap': true
            },
            'paint':{       // This categorizes the colours of the icons by venue type
                'icon-color': [
                    'match',
                    ['get', 'Venue Type'],
                    'Hotel',
                    '#9F7EEC',
                    'Warehouse',
                    '#F7A240',
                    'Historical',
                    '#F8C8DC',
                    'Outdoor',
                    '#38AD3A',
                    'Restaurant',
                    '#FF4242',
                    'Golf Club',
                    '#72C5EE',
                    'Banquet Hall',
                    '#F9EA4E',
                    'Art Gallery and Museum',
                    '#16E9D1',
                    'Mansion',
                    '#2E2AF8',
                    '#000000'
                ]
            }
        });
    });

    // The next two functions adds a census tract layer GeoJSON file from Mapbox
    map.addSource('torontoct', {
        'type': 'vector',
        'url': 'mapbox://stephnee.8twvqlwx'
    });

    map.addLayer({
        'id': 'ct',
        'type': 'fill',
        'source': 'torontoct',
        'paint': {
            'fill-color': '#888888',
            'fill-opacity': 0.4,
            'fill-outline-color': 'black',
        },
        'source-layer': 'torontoct-30zg4i'
    });

});

// This function creates a navigation feature that appears in the top left of the map
map.addControl(
    new MapboxDirections({
    accessToken: mapboxgl.accessToken
    }),
    'top-left'
    );