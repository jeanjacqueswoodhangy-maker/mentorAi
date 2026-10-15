# MENTOR AI

## Arborescence proposee

- `/` : landing page publique, avec slogan, valeur, domaines, personnalites, confiance et CTA.
- `/demo` : futur parcours MVP avec inscription courte, questionnaire, objectifs, plan 7 jours, mission du jour, chat, progression et parametres.
- `/i18n` : textes FR et HT, aucun texte visible code en dur.
- `/core` : futurs modules de donnees, stockage local, consentement, rappels et API IA isolee.
- `/sw.js` : cache PWA, fonctionnement hors ligne partiel.

## Parcours utilisateur MVP

1. Arrivee sur la landing page.
2. Choix de langue visible a tout moment.
3. Clic sur Commencer.
4. Inscription courte : prenom, age, langue, donnees partagees.
5. Questionnaire une question par ecran, avec option passer.
6. Choix d'un objectif ou conversation "Je ne sais pas par ou commencer".
7. Plan de 7 jours modifiable.
8. Mission du jour, points, badge et prochaine etape.
9. Retour regulier via rappels choisis et tableau de progression.

## Direction visuelle

Mobile-first, sobre et chaleureux : bleu profond pour la confiance, corail pour l'action, fond clair pour la lisibilite, mode sombre disponible. Les cartes ont un rayon de 8px, les boutons sont grands pour le tactile, et les illustrations restent legeres via CSS pour proteger la performance.

## Etapes suivantes

- Construire `/demo` avec stockage local complet et donnees simulees.
- Isoler les appels IA dans un module remplacable par un backend.
- Ajouter notifications push apres consentement.
- Brancher le mode vocal apres permission micro explicite.
- Faire relire le creole haitien par un locuteur natif avant diffusion.
