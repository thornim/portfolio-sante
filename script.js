document.addEventListener("DOMContentLoaded", initialiserProjetSante);

function initialiserProjetSante() {
    var registerForm = document.getElementById("registerForm");
    var loginForm = document.getElementById("loginForm");
    var journalForm = document.getElementById("journalForm");

    var zoneProjet = document.getElementById("zoneProjet");
    var messageConnexion = document.getElementById("messageConnexion");
    var messageJournal = document.getElementById("messageJournal");

    var listeJournal = document.getElementById("listeJournal");
    var etatVide = document.getElementById("etatVide");
    var resumeJournal = document.getElementById("resumeJournal");

    var totalEntrees = document.getElementById("totalEntrees");
    var totalHeures = document.getElementById("totalHeures");
    var serviceFavori = document.getElementById("serviceFavori");

    var journal = JSON.parse(localStorage.getItem("journalStage")) || [];

    function afficherMessage(element, texte, couleur) {
        if (element) {
            element.innerHTML = texte;
            element.style.color = couleur;
        }
    }

    function formaterDate(dateTexte) {
        if (dateTexte === "") {
            return "";
        }

        var morceaux = dateTexte.split("-");

        if (morceaux.length !== 3) {
            return dateTexte;
        }

        return morceaux[2] + "/" + morceaux[1] + "/" + morceaux[0];
    }

    function sauvegarderJournal() {
        localStorage.setItem("journalStage", JSON.stringify(journal));
    }

    function creerParagraphe(texte) {
        var p = document.createElement("p");
        var texteNode = document.createTextNode(texte);
        p.appendChild(texteNode);
        return p;
    }

    function creerTitre(niveau, texte) {
        var titre = document.createElement(niveau);
        var texteNode = document.createTextNode(texte);
        titre.appendChild(texteNode);
        return titre;
    }

    function viderElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function mettreAJourStatistiques() {
        var sommeHeures = 0;
        var compteurServices = {};
        var topService = "-";
        var maximum = 0;
        var i;
        var service;

        for (i = 0; i < journal.length; i++) {
            sommeHeures = sommeHeures + parseFloat(journal[i].heures);

            service = journal[i].service;

            if (compteurServices[service]) {
                compteurServices[service] = compteurServices[service] + 1;
            } else {
                compteurServices[service] = 1;
            }
        }

        for (service in compteurServices) {
            if (compteurServices[service] > maximum) {
                maximum = compteurServices[service];
                topService = service;
            }
        }

        if (totalEntrees) {
            totalEntrees.innerHTML = journal.length;
        }

        if (totalHeures) {
            totalHeures.innerHTML = sommeHeures;
        }

        if (serviceFavori) {
            serviceFavori.innerHTML = topService;
        }

        if (resumeJournal) {
            if (journal.length === 0) {
                resumeJournal.innerHTML = "Aucune entrée n’a encore été enregistrée.";
            } else {
                var derniereEntree = journal[journal.length - 1];
                resumeJournal.innerHTML =
                    "Vous avez enregistré " + journal.length +
                    " entrée(s) de stage pour un total de " + sommeHeures +
                    " heure(s). Le service le plus fréquent est " + topService +
                    ". Dernière entrée : " + derniereEntree.service +
                    " le " + formaterDate(derniereEntree.date) + ".";
            }
        }
    }

    function supprimerEntree(index) {
        journal.splice(index, 1);
        sauvegarderJournal();
        afficherJournal();
    }

    function afficherJournal() {
        var i;
        var entree;
        var carte;
        var meta;
        var badge;
        var infoDate;
        var infoHeures;
        var infoNiveau;
        var boutonSupprimer;

        if (!listeJournal) {
            return;
        }

        viderElement(listeJournal);

        if (journal.length === 0) {
            if (etatVide) {
                etatVide.classList.remove("hidden");
            }
            mettreAJourStatistiques();
            return;
        }

        if (etatVide) {
            etatVide.classList.add("hidden");
        }

        for (i = 0; i < journal.length; i++) {
            entree = journal[i];

            carte = document.createElement("article");
            carte.className = "entry-card";

            meta = document.createElement("div");
            meta.className = "entry-meta";

            badge = document.createElement("span");
            badge.className = "badge";
            badge.appendChild(document.createTextNode(entree.service));

            infoDate = document.createElement("span");
            infoDate.className = "meta-text";
            infoDate.appendChild(document.createTextNode("Date : " + formaterDate(entree.date)));

            infoHeures = document.createElement("span");
            infoHeures.className = "meta-text";
            infoHeures.appendChild(document.createTextNode("Heures : " + entree.heures));

            infoNiveau = document.createElement("span");
            infoNiveau.className = "meta-text";
            infoNiveau.appendChild(document.createTextNode("Difficulté : " + entree.niveau));

            meta.appendChild(badge);
            meta.appendChild(infoDate);
            meta.appendChild(infoHeures);
            meta.appendChild(infoNiveau);

            carte.appendChild(meta);

            carte.appendChild(creerTitre("h3", "Observation clinique"));
            carte.appendChild(creerParagraphe(entree.observation));

            carte.appendChild(creerTitre("h3", "Commentaire personnel"));
            carte.appendChild(creerParagraphe(entree.commentaire));

            carte.appendChild(creerTitre("h3", "Objectif d’apprentissage"));

            if (entree.objectif !== "") {
                carte.appendChild(creerParagraphe(entree.objectif));
            } else {
                carte.appendChild(creerParagraphe("Non renseigné"));
            }

            boutonSupprimer = document.createElement("button");
            boutonSupprimer.type = "button";
            boutonSupprimer.className = "btn btn-danger";
            boutonSupprimer.setAttribute("data-index", i);
            boutonSupprimer.appendChild(document.createTextNode("Supprimer"));

            boutonSupprimer.addEventListener("click", function () {
                var index = parseInt(this.getAttribute("data-index"));
                supprimerEntree(index);
            });

            carte.appendChild(boutonSupprimer);
            listeJournal.appendChild(carte);
        }

        mettreAJourStatistiques();
    }

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var utilisateur = document.getElementById("registerNom").value.trim();
            var motDePasse = document.getElementById("registerPassword").value.trim();

            if (utilisateur === "" || motDePasse === "") {
                afficherMessage(
                    messageConnexion,
                    "Veuillez remplir tous les champs de création de compte.",
                    "red"
                );
            } else if (motDePasse.length < 4) {
                afficherMessage(
                    messageConnexion,
                    "Le mot de passe doit contenir au moins 4 caractères.",
                    "red"
                );
            } else {
                localStorage.setItem("compteNom", utilisateur);
                localStorage.setItem("compteMotDePasse", motDePasse);

                afficherMessage(
                    messageConnexion,
                    "Compte créé avec succès. Vous pouvez maintenant vous connecter.",
                    "green"
                );

                registerForm.reset();
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var loginNom = document.getElementById("loginNom").value.trim();
            var loginPassword = document.getElementById("loginPassword").value.trim();

            var utilisateurSauvegarde = localStorage.getItem("compteNom");
            var motDePasseSauvegarde = localStorage.getItem("compteMotDePasse");

            if (loginNom === "" || loginPassword === "") {
                afficherMessage(
                    messageConnexion,
                    "Veuillez remplir les champs de connexion.",
                    "red"
                );
            } else if (
                loginNom === utilisateurSauvegarde &&
                loginPassword === motDePasseSauvegarde
            ) {
                afficherMessage(messageConnexion, "Connexion réussie.", "green");

                if (zoneProjet) {
                    zoneProjet.classList.remove("hidden");
                }

                afficherJournal();
            } else {
                afficherMessage(messageConnexion, "Identifiants incorrects.", "red");
            }
        });
    }

    if (journalForm) {
        journalForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var dateStage = document.getElementById("dateStage").value;
            var serviceStage = document.getElementById("serviceStage").value.trim();
            var heuresStage = document.getElementById("heuresStage").value;
            var niveauStage = document.getElementById("niveauStage").value;
            var observationStage = document.getElementById("observationStage").value.trim();
            var commentaireStage = document.getElementById("commentaireStage").value.trim();
            var objectifStage = document.getElementById("objectifStage").value.trim();

            if (
                dateStage === "" ||
                serviceStage === "" ||
                heuresStage === "" ||
                niveauStage === "" ||
                observationStage === "" ||
                commentaireStage === ""
            ) {
                afficherMessage(
                    messageJournal,
                    "Veuillez remplir tous les champs obligatoires du journal.",
                    "red"
                );
                return;
            }

            var nouvelleEntree = {
                date: dateStage,
                service: serviceStage,
                heures: heuresStage,
                niveau: niveauStage,
                observation: observationStage,
                commentaire: commentaireStage,
                objectif: objectifStage
            };

            journal.push(nouvelleEntree);
            sauvegarderJournal();

            afficherMessage(messageJournal, "Entrée enregistrée avec succès.", "green");

            journalForm.reset();
            afficherJournal();
        });
    }

    mettreAJourStatistiques();
    afficherJournal();
}