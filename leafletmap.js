export function load_map(raw) {
    console.log(JSON.parse(String(raw)));
    let map = L.map('map').setView({ lat: 52.263467, lon: 6.17359 }, 16);
    let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    var geojson_layer = L.geoJSON().addTo(map);
    var geojson_data = JSON.parse(String(raw));
    for (var geojson_item of geojson_data) {
        geojson_layer.addData(geojson_item);
        var marker = new L.marker(
            [geojson_item.geometry.coordinates[1],
            geojson_item.geometry.coordinates[0]],
            { opacity: 0.01 }
        );
        marker.bindTooltip(geojson_item.properties.name,
            {
                permanent: true,
                className: "my-label",
                offset: [0, 0]
            }
        );
        marker.addTo(map);
    }
    //
    // Data
    //
    var popup = L.popup();
    //
    //  Handle mouse events.
    //
    function onMapClick(e) {
        console.log("Mouse:" + e.latlng.toString());
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }
    map.on('click', onMapClick);


    var polygon = L.polygon([
        [52.2509, 6.08],
        [52.2303, 6.06],
        [52.251, 6.047]
    ]).addTo(map);

    // FeatureGroup is to store editable layers
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);
    // Create an empty GeoJSON collection
    var collection = {
        "type": "FeatureCollection",
        "features": []
    };

    // Add Draw Event Listeners.
    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        var geojson = layer.toGeoJSON();
        var geo = geojson.geometry;
        console.log("test4 " + geo.type + ":" + geo.coordinates);
        drawnItems.addLayer(layer);
    });

    // Add layer control 

    let gogl = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', { attribution: 'google' });
    let abc = L.control.layers({
        'osm': osm,
        'google': gogl
    },  { 'drawlayer': drawnItems }, { position: 'topleft', collapsed: true }).addTo(map);

    // Add Save button.

    L.Control.Watermark = L.Control.extend({
        onAdd: function (map) {
            var btn = L.DomUtil.create("button");
            btn.style.width = '60px';
            btn.style.height = '20px';

            return btn;
        },

        onRemove: function (map) {
            // Nothing to do here
        }
    });

    L.control.watermark = function (opts) {
        return new L.Control.Watermark(opts);
    }

    L.control.watermark({ position: 'topleft' }).addTo(map);
    return "";
}