$(document).ready(function () {
    $.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function (data) {
        console.log(data);
        if (document.body.classList.contains("portada")) {
            data.features.forEach(function (temblor, i) {
                var articuloTipo;
                if (temblor.properties.place.includes("Indonesia")) {
                    articuloTipo = '<article class="local">';
                } else {
                    articuloTipo = '<article class="global">';
                }
                d = new Date(temblor.properties.time)
                $("section").append(articuloTipo + 
                    "<h2>" + temblor.properties.mag + 
                    "</h2><p>" + temblor.properties.place +
                    "<p>" + d.toUTCString() + 
                    "</p><p><a href='page.html?temblor=" + 
                    i + "'>ver mapa</a></p></article>");
            });
            var valor;
            $('#opciones').change(function(){
                valor = $("input[name='paises']:checked").val();
                if(valor == "indonesia"){
                    $(".local").fadeTo("fast",1);
                    $(".global").fadeTo("fast",0.1);
                } else {
                    $(".local").fadeTo("fast",1);
                    $(".global").fadeTo("fast",1);
                }
            }); 
        } else {
            var t = new URLSearchParams(window.location.search).get("temblor");
            if (t !== null) {
                var nombre = data.features[t].properties.title;
                var longitud = data.features[t].geometry.coordinates[0];
                var latitud = data.features[t].geometry.coordinates[1];
                var more = data.features[t].properties.url;
                var elmapa = L.map("mapa").setView([latitud, longitud], 3);
                L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {
                    maxZoom: 18,
                    id: "mapbox/outdoors-v11",
                    tileSize: 512,
                    zoomOffset: -1,
                }).addTo(elmapa);
                var person = L.icon({
                    iconUrl: 'person.png',
                    iconSize:     [20, 60], // size of the icon
                    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


                marker = L.marker([latitud, longitud], {icon: person})
                    .addTo(elmapa)
                    .on("click", vinculo);
                function vinculo() {
                    window.open(more, "_blank", "noopener");
                }
                $("header h2").append(" — " + nombre);
            } else {
                $("h2").append(" — Algo salió mal &#128557;");
            } // cierro un else
        } // cierro otro else
    }); // cierro $.getJSON({})
}); //cierro ready(function(){})