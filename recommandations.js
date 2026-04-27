document.addEventListener("DOMContentLoaded", function () {
  var bouton = document.getElementById("btnRecherche");
  var message = document.getElementById("message");
  var zoneResultats = document.getElementById("resultats");

  bouton.addEventListener("click", function () {
    rechercherRecommandations();
  });

  async function rechercherRecommandations() {
    var categorie = document.getElementById("categorie").value;
    var sousCategorie = document.getElementById("sousCategorie").value;
    var publicCible = document.getElementById("public").value;

    var url = "https://portfolio-sante.onrender.com/";
    var params = [];

    if (categorie !== "") {
      params.push("categorie=" + encodeURIComponent(categorie));
    }

    if (sousCategorie !== "") {
      params.push("sousCategorie=" + encodeURIComponent(sousCategorie));
    }

    if (publicCible !== "") {
      params.push("public=" + encodeURIComponent(publicCible));
    }

    if (params.length > 0) {
      url = url + "?" + params.join("&");
    }

    message.textContent = "Chargement des recommandations...";
    message.style.color = "#0f3d5e";
    zoneResultats.innerHTML = "";

    try {
      var response = await fetch(url);
      var data = await response.json();

      if (data.length === 0) {
        message.textContent = "Aucune recommandation trouvée.";
        message.style.color = "#b91c1c";
        return;
      }

      message.textContent = data.length + " recommandation(s) trouvée(s).";
      message.style.color = "green";

      for (var i = 0; i < data.length; i++) {
        var recommandation = data[i];

        var carte = document.createElement("article");
        carte.className = "recommandation-card";

        carte.innerHTML =
          "<h3>" + recommandation.titre + "</h3>" +
          "<p><strong>Catégorie :</strong> " + recommandation.categorie + "</p>" +
          "<p><strong>Sous-catégorie :</strong> " + recommandation.sousCategorie + "</p>" +
          "<p><strong>Public :</strong> " + recommandation.public + "</p>" +
          "<p><strong>Recommandation :</strong> " + recommandation.recommandation + "</p>" +
          "<p><strong>Source :</strong> " + recommandation.source + "</p>";

        zoneResultats.appendChild(carte);
      }
    } catch (erreur) {
      message.textContent = "Erreur : vérifiez que l'API FastAPI est bien lancée sur le port 8000.";
      message.style.color = "#b91c1c";
    }
  }
});
