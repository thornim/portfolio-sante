window.onload = function () {
    initialiserProjetSante();
};

function initialiserProjetSante() {
    var registerForm = document.getElementById("registerForm");
    var loginForm = document.getElementById("loginForm");
    var zoneProjet = document.getElementById("zoneProjet");
    var messageConnexion = document.getElementById("messageConnexion");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var varUtilisateur = document.getElementById("registerNom").value.trim();
            var varMotDePasse = document.getElementById("registerPassword").value.trim();

            if (varUtilisateur === "" || varMotDePasse === "") {
                messageConnexion.innerHTML = "Veuillez remplir tous les champs de création de compte.";
                messageConnexion.style.color = "red";
            } else {
                localStorage.setItem("compteNom", varUtilisateur);
                localStorage.setItem("compteMotDePasse", varMotDePasse);

                messageConnexion.innerHTML = "Compte créé avec succès. Vous pouvez maintenant vous connecter.";
                messageConnexion.style.color = "green";
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var varLoginNom = document.getElementById("loginNom").value.trim();
            var varLoginPassword = document.getElementById("loginPassword").value.trim();

            var varUtilisateurSauvegarde = localStorage.getItem("compteNom");
            var varMotDePasseSauvegarde = localStorage.getItem("compteMotDePasse");

            if (varLoginNom === varUtilisateurSauvegarde && varLoginPassword === varMotDePasseSauvegarde) {
                messageConnexion.innerHTML = "Connexion réussie.";
                messageConnexion.style.color = "green";
                zoneProjet.classList.remove("hidden");
            } else {
                messageConnexion.innerHTML = "Identifiants incorrects.";
                messageConnexion.style.color = "red";
            }
        });
    }
}