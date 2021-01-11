class Map {
    
    /**
     * @param {string} elementId Identifiant de l'élément qui sera la carte
     * @param {number} latitureMapCenter 
     * @param {number} longitudeMapCenter 
     */
    constructor(elementId, latitudeMapCenter, longitudeMapCenter) {
        this.elementId = elementId;
        this.latitudeMapCenter = latitudeMapCenter;
        this.longitudeMapCenter = longitudeMapCenter;

        this.icon;

        // création des icônes
        this.greenIcon = L.icon({ 
            iconUrl: 'images/app/map-marker-bike-green.png',       
            iconSize:     [38, 48], 
            iconAnchor:   [22, 94], 
            popupAnchor:  [-3, -76] 
        });

        this.redIcon =  L.icon({
            iconUrl: 'images/app/map-marker-red.png',
            iconSize:     [38, 48], 
            iconAnchor:   [22, 94], 
            popupAnchor:  [-3, -76] 
        });

        this.markerClusters = L.markerClusterGroup(); // création d'une couche qui permettra l'affichage des marqueurs sous forme de regroupements de marqueurs si les marqueurs sont trop proches

        // création de la carte...
        this.map = new L.map(this.elementId).setView([this.latitudeMapCenter, this.longitudeMapCenter], 11);

        // ... et affichage de la couche du fond de carte "openstreetmap"
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
        }).addTo(this.map);    
    }

    /**
     * création d'un marqueur qui est ajouté à la couche regroupement de marqueurs 
     * @param {number} markerLatitude 
     * @param {number} markerLongitude 
     * @param {string} stationName 
     * @param {string} stationStatus 
     */
    createMarker(markerLatitude, markerLongitude, stationName, stationStatus, stationsList) {
        // choix de l'icone du marqueur en fonction du statut de la station
        if (stationStatus === 'OPEN') {
            this.icon = this.greenIcon;
            
        } else {
            this.icon = this.redIcon;
        }

        this.marker = new L.marker([markerLatitude, markerLongitude], {icon: this.icon, title: `Station : ${stationName}`, alt:`marqueur de station de location de vélos`}); 
        this.marker.bindPopup('Station choisie').openPopup();
        this.marker.addTo(this.markerClusters); // ajout du marqueur créé à la couche "regroupement de marqueurs"


        //================================/
        // Gestion du choix de la station /
        //================================/
        this.marker.addEventListener('click', function(e) {
                
            for (let station of stationsList) {
                               
                // on retrouve dans la liste des stations celle qui correspond au marqueur cliqué
                if ((e.target._latlng.lat === station.lat) && (e.target._latlng.lng === station.lng)) { 
                    
                    // on vérifie que la station est ouverte et qu'il reste au moins un vélo
                    if ((station.isStationOpen()) && (station.isBikeAvailable())) {

                        $('#booking-help').hide(); // on enlève les informations d'aide si elles ont été affichées précédemment
                        station.displayStation(); // on affiche la fenêtre "Détails de la station" avec les données de la station choisie
                        station.storeStationName(station.name); // on stocke la valeur du nom de la station choisie pour l'afficher ensuite dans les infos de réservation
                        break; // permet d'arrêter la boucle for-of

                    } else {
                        $('#booking-help').show();
                    }
                }
            }
        });
    }

    /**
     *  affichage de la couche des regroupements de marqueurs sur la carte
     */
    addMarkerClusters() { 
        this.markerClusters.addTo(this.map); 
    }           
}