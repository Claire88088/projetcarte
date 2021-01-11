class Canvas {

    /**
     * @param {jQuery Object} element Objet jQuery qui représente l'élément du DOM qui est le canvas
     */
    constructor (element) {
        this.canvasObject = element;
        this.prevX = 0;
        this.prevY = 0;
        this.currX = 0;
        this.currY = 0;
        this.drawReady = false; // marqueur pour vérifier si on peut dessiner
        this.drawMade = false; // marqueur pour vérifier si on a déjà dessiner

        const self = this; // self se réfèrera toujours à l'objet courant 

        // Création du contexte du canvas
        this.ctx = canvas.getContext('2d');

        // ajout d'un bouton "Valider"
        $('<button id="validate-button">Valider</button>').insertAfter(this.canvasObject);
        
        // gestion des événements liés à la souris
        this.canvasObject.on('mousemove mousedown mouseup mouseout', function(e) {
            self.drawAsPointer(e);
        });

        
        // gestion des événements liés au toucher
        this.canvasObject.on('touchmove touchend touchleave', function(e) {
            self.drawAsPointer(e);
        });
        
        this.canvasObject.on('touchstart', function(e) {
            e.preventDefault(); // empêche à la fois le défilement de l'écran vers le bas avec le toucher pour pouvoir écrire dans le canvas et la prise en compte des événements "souris"
            self.drawAsPointer(e);
        });
    }

    //===== Méthodes en lien avec les positions =====
    getMousePosition(e) {
        const mousePosition = {};
        mousePosition.x = e.offsetX; // position par rapport à l'élément sur lequel on écoute l'événement (ici le canvas)
        mousePosition.y = e.offsetY;
        
        return mousePosition;   
    }

    getTouchPosition(e) {
        const touchPosition = {};
        touchPosition.x = e.touches[0].pageX - this.getCanvasPosition(e).x;
        touchPosition.y = e.touches[0].pageY - this.getCanvasPosition(e).y;

        return touchPosition
    }

    getCanvasPosition(e) {
        let element = e.target; // initialisation du premier élément (ici, le canvas)
        const canvasPosition = {};
        canvasPosition.x = element.offsetLeft;
        canvasPosition.y = element.offsetTop;

        while (element.offsetParent) { // tant que l'élément a un parent
            element = element.offsetParent;
            canvasPosition.x += element.offsetLeft;
            canvasPosition.y += element.offsetTop;
        } 
        
        return canvasPosition;
    }
    
    /**
     * mise à jour de la position du curseur lors du clic (ou du toucher) ou lors du déplacement du curseur
     * @param {event} e Evenement
     */
    upDatePosition(e) {
        this.prevX = this.currX;
        this.prevY = this.currY;
        
        if ((e.type === 'mousedown') || (e.type === 'mousemove')) {
            this.currX = this.getMousePosition(e).x;
            this.currY = this.getMousePosition(e).y;
        }

        if ((e.type === 'touchstart') || (e.type === 'touchmove')) {
            this.currX = this.getTouchPosition(e).x; 
            this.currY = this.getTouchPosition(e).y;
        }
    }


    //===== Méthodes en lien avec le dessin =====
    drawPoint() {
        this.ctx.beginPath();
        this.ctx.fillRect(this.currX, this.currY, 2, 2);
        this.ctx.closePath();
    }

    drawPath() {
        this.drawMade = true;
        
        this.ctx.beginPath(); 
        this.ctx.moveTo(this.prevX, this.prevY); // aller au point prevX, preY
        this.ctx.lineTo(this.currX, this.currY); // tracer jusqu'au point currX, currY
        this.ctx.lineWidth = 2;
        this.ctx.stroke(); // dessine le contour de la forme créée précédemment
    }

    drawAsPointer(e) {
        this.upDatePosition(e);

        if ((e.type === 'mousedown') || (e.type === 'touchstart')) { 
            this.drawReady = true; // le marqueur passe à true
            this.drawPoint();
        }

        if ((e.type === 'mousemove')|| (e.type === 'touchmove')) {
            if (this.drawReady) { // on vérifie qu'on peut dessiner
                this.drawPath();
            }    
        }

        if ((e.type === 'mouseup') || (e.type === 'touchend') || (e.type === 'mouseout') || (e.type === 'touchleave')) {
            this.drawReady= false;
        }      
    }

    //====== Désactiver le canvas ======
    disableCanvas() {
        this.ctx = null;
    }

}