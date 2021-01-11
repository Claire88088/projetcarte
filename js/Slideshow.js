class Slideshow {
    /**
     * @param {jQuery Object} element Objet jQuery qui correspond à l'élement du DOM qui sera le diaporama
     */
    constructor(element) {
        this.slideshowObject = element;

        this.scrollingSpeed = 5000; // par défaut vitesse de défilement : 5 secondes
        this.scrollAuto = true;
        this.nav = true;
        this.slidesTotal = 6; // 6 diapos au total dans le carousel
        
        this.currentSlide = 1; // par défaut la première diapo est la diapo 1
        this.slideWidth = 100 / this.slidesTotal; // la largeur de chaque slide (définie par rapport au conteneur) est = à largeur du conteneur / nb de diapo total (soit : 100% / 5)
        this.intervalId = ''; // permet de stocker l'identifiant de setInterval()
        const self = this; // self se réfèrera toujours à l'objet courant 

        // récupération de l'élément "conteneur" et des éléments "slides"
        this.containerObject = $('#slides-container');
        this.slidesElts = document.getElementById('slides-container').children; // on récupère les éléments enfants sous forme de collection d'éléments HTML

        // ajout de la navigation
        if (this.nav) { // par défaut : affichage d'une navigation

        // création des éléments...
        this.navObject = $('<div class="slideshow-nav"></<div>');
        this.pauseObject = $('<button class="button-nav" id="slideshow-pause"></<button>');
        this.playObject = $('<button class="button-nav" id="slideshow-play"></<button>');
        this.nextObject = $('<button class="button-nav" id="slideshow-next"></<button>');
        this.prevObject = $('<button class="button-nav" id="slideshow-prev"></<button>');
        
        // ... et insertion dans le DOM
        this.prevObject.appendTo(this.navObject);
        this.pauseObject.appendTo(this.navObject);
        this.playObject.appendTo(this.navObject);
        this.nextObject.appendTo(this.navObject);
        this.navObject.appendTo(this.slideshowObject);
        }

        // définition de la largeur des éléments
        this.setWidth();
        
        // par défaut : défilement automatique toutes les 5 secondes
        if (this.scrollAuto) {
            this.scroll();
        }


        // gestion du défilement avec les boutons de navigation
        this.pauseObject.on('click', function() {
            self.stopScrolling();
        });

        this.playObject.on('click', function() {
            self.scroll();
        });
        this.nextObject.on('click', this.next.bind(this)); // l'ajout de .bind() permet d'avoir comme contexte pour le this à l'intérieur de la méthode next() le même l'objet que celui sur lequel la méthode next() est appelée
        this.prevObject.on('click', this.prev.bind(this));
        

        // gestion du défilement avec le clavier    
        this.slideshowObject.attr('tabindex', '0'); // permet de mettre le focus de la tabulation sur l'élément diaporama

        this.slideshowObject.on('keyup', function(e) {
            switch (e.key) {
                case ('ArrowLeft'):
                    self.prev(); // utilisation de self pour accéder à la méthode de l'objet sur lequel on écoute l'événement
                    break;
                case ('ArrowRight'):
                    self.next(); 
                    break;
            }
        });
    }
    
    
    /**
     * définition de la largeur des éléments
     */
    setWidth() {
        this.containerObject.width(`${(this.slidesTotal * 100)}%`); // la largeur du conteneur est = à nb de diapo total * largeur du contenant (ici, l'élément slideshow) (soit : 5*100%) 

        for (let slideElt of this.slidesElts) {
            slideElt.style.width = `${this.slideWidth}%`; // la largeur de chaque slide (définie par rapport au conteneur) est = à largeur du conteneur / nb de diapo total (soit : 100% / 5)
        }
    }

    //====== Méthodes liées du défilement en continu ======
    scroll() {
        this.intervalId = setInterval(this.next.bind(this), this.scrollingSpeed); 
    }

    stopScrolling() {
        clearInterval(this.intervalId);
    }

    //====== Méthodes liées au déplacement du diaporama ======
    moveTo(indexSlide) {
        // translation du div "slideshow-container" vers la gauche par rapport au div "slideshow"
        let translationWidth = this.slideWidth * (indexSlide -1); // la distance de la translation est = à la largeur d'une diapo * le nombre de diapo avant la diapo à afficher 
        this.containerObject.css('transform', `translateX(-${translationWidth}%)`);
    }

    next() {
        if (this.currentSlide === this.slidesTotal) { // gestion du diaporama infini 
            this.currentSlide = 0;
        }

        let indexSlide = (this.currentSlide + 1);
        this.moveTo(indexSlide);
        
        this.currentSlide ++;
    }

    prev() {
        if (this.currentSlide === 1) { //  gestion du diaporama infini 
            this.currentSlide = this.slidesTotal +1;
        }

        let indexSlide = (this.currentSlide -1);
        this.moveTo(indexSlide);

        this.currentSlide --;    
    }
}