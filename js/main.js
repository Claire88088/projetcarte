$(document).ready(function() { 
    
    //====== DECLARATION DES VARIABLES =======
    // variables liées aux fonctionnalités générales
    let mySlideshow, myCanvas;

    // variables liées aux données JCD
    let cityName = 'Amiens'; // nom de la ville où créer l'appli de réservation de vélos
    let stationsData; // données globales de l'ensemble des stations de la ville
    let stationName, stationStatus, stationAvailableBikes, stationAvailableBikeStands, stationAddress, stationLat, stationLng;
    let myStation;
    let stationsList = []; // tableau qui stockera l'ensemble des objets "Station"
    
    // variables pour la gestion de la carte
    let myMap, latitudeMapCenter, longitudeMapCenter, myMarker; 

    // variables liées au formulaire
    let formName, formFirstName;

    // variables de réservation
    let chosenStationName;
    let myBooking;
    let userName;
    
    
    //====== INITIALISATION DU FORMULAIRE avec les données stockées en local (si elles existent) ======
    if (localStorage.formName) {
        $('#name').val(localStorage.formName);
        $('#firstName').val(localStorage.formFirstName);
    }

    //====== AFFICHAGE DE LA RESERVATION ELLE A DEJA ETE CREEE (lors du rechargement de la page) ======
    if (sessionStorage.userName) { // si la réservation a déjà été créée : il existe des données de session qui ont été stockées
        myBooking = new Booking(sessionStorage.userName, sessionStorage.stationName, sessionStorage.newTimeout); // on recréé un objet réservation avec les données stockées en session
    }
        

    //====== MISE EN PLACE DES FONCTIONNALITES GENERALES NECESSAIRES AU FONCTIONNEMENT DE l'APPLI ======
    mySlideshow = new Slideshow($('#slideshow'));
    myCanvas = new Canvas($('#canvas'));   
    
    
    //====== RECUPERATION DES DONNEES VIA L'API JC DECAUX ======    Mettre tout le code qui suit dans la fonction ajaxGet de façon à ce que les données soient bien reçues (requête asynchrone !) avant d'exécuter la suite du code
    ajaxGet(`https://api.jcdecaux.com/vls/v1/stations?contract=${cityName}&apiKey=452ee395e6c29199be2674445d87d40018e57fe5`, function (response) {
        stationsData = JSON.parse(response);
        
        //====== CREATION DE LA CARTE ======
        // initialisation des données globales nécessaires pour l'affichage de la carte...
        latitudeMapCenter = stationsData[0].position.lat; 
        longitudeMapCenter = stationsData[0].position.lng;
    

        // ... puis création de la carte avec uniquement le fond de carte
        myMap = new Map('map', latitudeMapCenter, longitudeMapCenter);
        
        // pour chaque station...
        for (let station in stationsData) {
            //... initialisation des données
            stationName = stationsData[station].name;
            stationStatus = stationsData[station].status;
            stationAvailableBikes = stationsData[station].available_bikes;
            stationAvailableBikeStands = stationsData[station].available_bike_stands;
            stationLat = stationsData[station].position.lat;
            stationLng = stationsData[station].position.lng;
            
            if (stationsData[station].address) {
                stationAddress =  stationsData[station].address;
            } else {
                stationAddress = 'information non disponible';
            }

            //... création d'un objet "Station" (regroupe l'ensemble des données d'une station)
            myStation = new Station(stationName, stationLat, stationLng, stationStatus, stationAvailableBikes, stationAvailableBikeStands, stationAddress);
            stationsList.push(myStation);

            //... création d'un marqueur (permet l'affichage sur la carte et la gestion du choix de la station lors du clic sur un marqueur)
            myMarker = myMap.createMarker(stationLat,  stationLng, stationName, stationStatus, stationsList);              
        }
        
        // affichage de la couche des regroupements de marqueurs 
        myMap.addMarkerClusters();

    
        //========================================/
        // Gestion de la soumission du formulaire /
        //========================================/
        $('form').on('submit', function(e) {
            e.preventDefault();

            // récupération des données saisies dans le formulaire...
            formName = ($('#name').val());
            formFirstName = $('#firstName').val();
           
            // ... vérification de la validité de la saisie...
            let regexName = /^[a-zA-Zàâéèêëôöù][a-zA-Z\s-àâéèêëôöù]*[a-zA-Zàâéèêëôöù]$/;
            if ((!regexName.test(formName)) ||(!regexName.test(formFirstName))) { 
                $('#form-help').show();

            } else {
                $('#form-help').hide();
                $('#submit-button').attr('disabled', 'disabled');

                // ... et stockage avec l'API localStorage (nom et prénom sont stockés lorsque navigateur est fermé)
                localStorage.setItem('formName', formName);
                localStorage.setItem('formFirstName', formFirstName);

                // affichage de la fenêtre "signature"
                $('#signature').show();
                        
                
                //===================================================/
                // Gestion de la validation finale de la réservation /
                //===================================================/
                $('#validate-button').on('click', function() {
                    // on vérifie que l'utilisateur a bien signé   
                    if (!myCanvas.drawMade) {          
                        $('#signature-help').show();
                        
                    } else {
                        $('#signature-help').hide();
                        $('#validate-button').attr('disabled', 'disabled');
                        myCanvas.disableCanvas();
                        
                        //====== CREATION D'UNE NOUVELLE RESERVATION ======
                        userName = localStorage.getItem('formName') + ' ' + localStorage.getItem('formFirstName');
                        chosenStationName = sessionStorage.stationName;
                        
                        if (myBooking) {
                            // s'il y a déjà une réservation : on efface les attributs de l'objet Booking et on créé un nouvel objet à la place
                            // Remarque : les boutons de validation sont désactivés pour empêcher de faire une nouvelle réservation
                            myBooking.clearBooking();
                            myBooking = new Booking(userName, chosenStationName);
                            
                        } else {
                            myBooking = new Booking(userName, chosenStationName);
                        }
                    }
                });
            }           
        }); 
    });      
});
