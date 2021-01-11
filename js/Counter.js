class Counter {
    
    /**
     * @param {jQuery Object} element objet jQuery représentant l'élément du DOM qui sera le compteur
     */
    constructor(element) {
        this.counterObject = element;

        this.minutes; 
        this.secondes; 
        this.idInterval;
    }

    //====== Gestion de l'affichage ======
    /**
     * Insère les données à afficher dans l'élément counter
     * @param {number} minutes 
     * @param {number} secondes 
     */
    displayCounter(minutes, secondes) {
        if (secondes < 10) {
            this.counterObject.text(`${minutes} min 0${secondes} s`);
        } else {
            this.counterObject.text(`${minutes} min ${secondes} s`);
        }
    }


    //====== Gestion du décompte ======
    initCount(initMinutes, initSecondes) {
        this.minutes = initMinutes;
        this.secondes = initSecondes;
        this.displayCounter(this.minutes, this.secondes); // initialisation de l'affichage du décompte
        this.idInterval = setInterval(this.count.bind(this), 1000);
    }
    
    count() {
        this.secondes --;
        if (this.secondes < 0) {
            this.secondes = 59;
            this.minutes --;
        }
        //this.storeCounter(this.minutes, this.secondes);
        this.displayCounter(this.minutes, this.secondes);
    }

    stopCount() {
        clearInterval(this.idInterval);
    }
    

    //====== Gestion de la suppression des caractéristiques du compteur ======
    clearCounter() {
        this.stopCount();
        delete this.minutes; 
        delete this.secondes;
        delete this.idInterval;
    }
}