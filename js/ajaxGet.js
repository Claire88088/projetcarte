/**
 * envoi d'une requête ajax 
 * @param {string} url URL cible
 * @param callback fonction qui sera passée en 2nd paramètre
 */

function ajaxGet (url, callback) { 

    let req = new XMLHttpRequest(); // création d'une nouvelle requête
    req.open('GET', url); // préparation d'une requête asynchrone
    
    // gestion des erreurs
    req.addEventListener('load', function() { 
        if (req.status >= 200 && req.status < 400) { // traitement de la requete par le serveur réussi
            callback(req.responseText); // la fonction callback passée en 2nd paramètre de la fonction ajaxGet prend comme paramètre la réponse du serveur sous forme de texte
        } else {
            console.error(`Erreur au niveau du serveur : ${req.status} : ${req.statusText}`);
        }
    });
    req.addEventListener('error', function() { 
        console.error(`Erreur réseau : la requête n\'a pas atteint le serveur : url : ${url}`);
    });

    req.send(null); // envoi de la requête
}