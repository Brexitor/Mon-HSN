# Guide d'utilisation — GSHN

**Logiciel de Gestion et de Suivi des Sportifs de Haut Niveau**  
Direction du Sport de Haut Niveau (DSHN) — MJSC — République du Niger

---

## 1. Premier lancement

Au premier lancement, le logiciel est pré-chargé avec les **12 fédérations sportives nationales** les plus importantes. Aucune configuration préalable n'est nécessaire.

---

## 2. Enregistrer un sportif

1. Cliquer sur l'onglet **Sportifs**
2. Cliquer sur **+ Nouveau sportif**
3. Renseigner au minimum : **Nom**, **Prénom**, **Discipline**
4. Le **Matricule DSHN** est généré automatiquement (format `DSHN-AAAA-XXXX`)
5. Sélectionner une fédération dans la liste déroulante
   - Si la fédération n'existe pas encore, choisir **« + Nouvelle fédération… »** pour la créer sans quitter le formulaire
6. Cliquer sur **Enregistrer**

---

## 3. Gérer les fédérations

### Depuis l'onglet Fédérations

1. Cliquer sur l'onglet **Fédérations**
2. Saisir le nom de la fédération dans le champ **« Nom de la nouvelle fédération »**
3. Saisir la **discipline principale** (facultatif)
4. Cliquer sur **+ Ajouter la fédération**

### Depuis le formulaire d'un sportif

1. Ouvrir le formulaire d'ajout ou de modification d'un sportif
2. Dans le champ **Fédération**, choisir **« + Nouvelle fédération… »**
3. Saisir le nom et la discipline
4. Cliquer sur **Créer et sélectionner** — la fédération est créée et automatiquement sélectionnée

---

## 4. Sauvegarder les données

> ⚠️ Les données sont stockées dans le navigateur. Si vous videz le cache ou changez de navigateur, les données seront perdues sans sauvegarde.

1. Aller dans **Sauvegarde / Restauration**
2. Cliquer sur **Télécharger la sauvegarde**
3. Un fichier `GSHN_backup_AAAA-MM-JJ.json` est téléchargé sur votre ordinateur
4. Conserver ce fichier dans un dossier sécurisé

**Fréquence recommandée** : sauvegarde quotidienne ou après toute saisie importante.

---

## 5. Restaurer une sauvegarde

1. Aller dans **Sauvegarde / Restauration**
2. Cliquer sur **Choisir un fichier** et sélectionner le fichier `.json`
3. Cliquer sur **Restaurer**
4. Confirmer le remplacement des données actuelles

---

## 6. Exporter la liste des sportifs (CSV)

1. Aller dans l'onglet **Sportifs**
2. Appliquer les filtres souhaités (catégorie, fédération, statut…)
3. Cliquer sur **Exporter (CSV)**
4. Le fichier `GSHN_liste_sportifs.csv` est téléchargé (compatible Excel, LibreOffice Calc)

---

## 7. Imprimer une fiche sportif

1. Cliquer sur **Fiche** en face du sportif dans le tableau
2. Cliquer sur **Imprimer** dans la fenêtre de fiche

---

## 8. Réinitialiser les données

> ⚠️ Opération **irréversible**. Faites impérativement une sauvegarde avant.

1. Aller dans **Sauvegarde / Restauration**
2. Cliquer sur **Réinitialiser toutes les données**
3. Confirmer deux fois

---

## 9. Catégories et statuts

### Catégories
| Catégorie | Description |
|---|---|
| **Elite** | Sportif de niveau international confirmé |
| **Espoir** | Sportif à fort potentiel, en développement |
| **Relève** | Jeune sportif en phase de détection |

### Statuts
| Statut | Description |
|---|---|
| **Actif** | En activité sportive régulière |
| **Blessé** | Arrêt temporaire sur blessure |
| **Suspendu** | Suspension disciplinaire ou antidopage |
| **Retraité** | Fin de carrière |

---

## 10. Assistance

Pour toute question relative à l'utilisation du logiciel, contacter :

**Direction des Archives, de la Documentation, des Relations Publiques,  
de l'Informatique et de la Numérisation (DAID/RP/IN)**  
Ministère de la Jeunesse, des Sports et de la Culture  
République du Niger — Niamey
