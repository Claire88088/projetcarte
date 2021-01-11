class Station {

    constructor(stationName, stationLat, stationLng, stationStatus, stationAvailableBikes, stationAvailableBikeStands, stationAddress) {
        this.name = stationName;
        this.lat = stationLat;
        this.lng = stationLng;
        this.status = stationStatus;
        this.availableBikes = stationAvailableBikes;
        this.availableBikeStands = stationAvailableBikeStands;
        this.address = stationAddress;
    }

    displayStation() {
        $('#station-address').text(this.address);
        $('#places-number').text(this.availableBikeStands);
        $('#bikes-number').text(this.availableBikes);
        $('#appli-booking').show();
    }

    storeStationName(chosenStationName) {
        sessionStorage.setItem('stationName', chosenStationName);
    }

    //====== tests ======
    isStationOpen() {
        if (this.status === "OPEN") {
            return true;
        } else {
            return false;
        }
    }

    isBikeAvailable() {
        if (this.availableBikes > 0) {
            return true;
        } else {
            return false;
        }
    }
}