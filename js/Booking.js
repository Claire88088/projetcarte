class Booking {

    /**
     * @param {string} userName Nom utilisé pour la réservation (nom et prénom de l'utilisateur)
     * @param {string} stationName Nom de la station dans laquelle on réserve le vélo
     * @param {object} bookingCounter Compteur utilisé pour la réservation
     */

    constructor (userName, stationName, timeout) {
        this.userName = userName;
        this.stationName = stationName;
        this.bookingDate = new Date();

        if (typeof timeout === 'undefined') {
            this.timeout = 1200000; // délai de réservation : 20 min = 20*60s*1000ms = 1 200 000 ms     
        } else {
            this.timeout = timeout;
        }
        
        // initialisation du délai de réservation au niveau du compteur
        this.timeoutSec = Math.round(this.timeout / 1000); // on arrondi à la seconde près
        this.initMinutes = Math.floor(this.timeoutSec / 60);
        this.initSecondes = (this.timeoutSec - (this.initMinutes * 60));

        this.bookingCounter = new Counter($('#counter'));
        this.bookingCounter.initCount(this.initMinutes, this.initSecondes); 
        
        this.currentDate;
        this.elapsedTime; // temps déjà écoulé

        this.storeBooking();
        this.displayBookingInfo();
        this.myInterval = setInterval(this.isBookingExpired.bind(this), 1000);
    }
    
    //====== Gestion du stockage des données avec l'API sessionStorage (les données de réservation ne sont plus stockées lors de la fermeture du navigateur) ======
    storeBooking() {
        sessionStorage.setItem('userName', this.userName);
        sessionStorage.setItem('bookingDate', this.bookingDate);
        // remarque : le nom de la station a déjà été enregistré via sessionStorage lors du choix de la station (au moment du clic sur le marqueur)
    }


    //====== Gestion de l'affichage des informations de réservation ======
    displayBookingInfo() {
        $('#booking-station').text(this.stationName);
        $('#booking-name').text(this.userName);
        $('#booking-info').show();
    }

    
    //====== Gestion de l'expiration de la réservation ======
    /**
     * test pour vérifier si la réservation a expiré
     */
    isBookingExpired() {
        this.currentDate = new Date();

        if (this.isTimeoutExpired(this.currentDate)) {
            clearInterval(this.myInterval);  
            this.expireBooking();
        }    
    }

    /**
     * test pour vérifier si le délai de réservation est dépassé
     * @param {objet} currentDate Date actuelle
     */

    isTimeoutExpired(currentDate) {
        this.elapsedTime = (currentDate - this.bookingDate);
        this.newTimeout = this.timeout - this.elapsedTime;
        sessionStorage.setItem('newTimeout', this.newTimeout); // on stocke le temps qu'il reste pour arriver à la fin du délai : délai - temps déjà écoulé
        if ((this.elapsedTime) >= this.timeout) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * suppression des caractéristiques de la réservation
     */
    deleteBookingAttributes() {
        sessionStorage.clear();
        this.bookingCounter.clearCounter();
        delete this.userName;
        delete this.stationName;
        delete this.bookingCounter;
        delete this.bookingDate;
        delete this.currentDate;
        delete this.timeout;
        delete this.myInterval;    
    }

    /**
     * gestion de l'expiration de la réservation
     */
    expireBooking() {
        this.deleteBookingAttributes();
        $('#booking-info').text('Votre réservation a expiré, veuillez recharger la page pour recommencer.').css({color: 'red', fontWeight: '600', background: '#fff'});
    }

    /**
     * gestion de la remise à zéro de la réservation (avant une nouvelle réservation)
     */
    clearBooking() {
        sessionStorage.clear();
        $('#booking-info').hide();     
        this.deleteBookingAttributes();
    }
}