from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI(title="API Recommandations de santé")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://thornim.github.io/portfolio-sante"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("recommandations.json", "r", encoding="utf-8") as f:
    recommandations = json.load(f)

@app.get("/")
def accueil():
    return {"message": "Bienvenue sur l'API Recommandations de santé"}

@app.get("/api/recommandations")
def lire_recommandations(categorie: str = None, sousCategorie: str = None, public: str = None):
    resultats = recommandations

    if categorie:
        resultats = [r for r in resultats if r["categorie"].lower() == categorie.lower()]
    if sousCategorie:
        resultats = [r for r in resultats if r["sousCategorie"].lower() == sousCategorie.lower()]
    if public:
        resultats = [r for r in resultats if r["public"].lower() == public.lower()]

    return resultats

@app.get("/api/recommandations/{id}")
def lire_recommandation(id: int):
    for recommandation in recommandations:
        if recommandation["id"] == id:
            return recommandation
    return {"erreur": "Recommandation non trouvée"}
