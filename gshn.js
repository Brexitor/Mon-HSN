/* ============================================================
   GSHN - Gestion des Sportifs de Haut Niveau (Niger)
   Application 100% locale - stockage navigateur + sauvegarde JSON
   Ministère de la Jeunesse, des Sports et de la Culture
   Direction du Sport de Haut Niveau (DSHN)
   Développé par la DAID/RP/IN
   assets/js/gshn.js
   ============================================================ */

'use strict';

const STORAGE_KEY = "gshn_niger_data_v1";

let DB = {
  sportifs: [],
  performances: [],
  medical: [],
  financement: [],
  federations: [],
  lastSave: null
};

/* ============================================================
   CHARGEMENT / SAUVEGARDE
   ============================================================ */

function chargerDonnees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      DB = JSON.parse(raw);
      DB.sportifs      = DB.sportifs      || [];
      DB.performances  = DB.performances  || [];
      DB.medical       = DB.medical       || [];
      DB.financement   = DB.financement   || [];
      DB.federations   = DB.federations   || [];
      // Migration : convertir les anciennes fédérations (string) en objets
      DB.federations = DB.federations.map(f =>
        typeof f === 'string' ? { nom: f, discipline: '' } : f
      );
    } else {
      DB.federations = [
        { nom: "Fédération Nigérienne d'Athlétisme",      discipline: "Athlétisme" },
        { nom: "Fédération Nigérienne de Football",        discipline: "Football" },
        { nom: "Fédération Nigérienne de Basketball",     discipline: "Basketball" },
        { nom: "Fédération Nigérienne de Lutte Traditionnelle", discipline: "Lutte Traditionnelle" },
        { nom: "Fédération Nigérienne de Judo",           discipline: "Judo" },
        { nom: "Fédération Nigérienne de Taekwondo",      discipline: "Taekwondo" },
        { nom: "Fédération Nigérienne de Natation",       discipline: "Natation" },
        { nom: "Fédération Nigérienne de Boxe",           discipline: "Boxe" },
        { nom: "Fédération Nigérienne de Cyclisme",       discipline: "Cyclisme" },
        { nom: "Fédération Nigérienne de Handball",       discipline: "Handball" },
        { nom: "Fédération Nigérienne de Volleyball",     discipline: "Volleyball" },
        { nom: "Fédération Nigérienne de Tennis",         discipline: "Tennis" }
      ];
      sauvegarderDonnees();
    }
  } catch (e) {
    console.error("Erreur de chargement des données GSHN :", e);
  }
}

function sauvegarderDonnees() {
  DB.lastSave = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DB));
  } catch (e) {
    alert("Erreur lors de l'enregistrement des données : " + e.message);
  }
  afficherDerniereSauvegarde();
}

/* ============================================================
   UTILITAIRES
   ============================================================ */

function genererId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function genererMatricule() {
  const annee = new Date().getFullYear();
  const num   = (DB.sportifs.length + 1).toString().padStart(4, '0');
  return 'DSHN-' + annee + '-' + num;
}

function nomFederation(f)       { return typeof f === 'object' ? f.nom       : f; }
function disciplineFederation(f){ return typeof f === 'object' ? (f.discipline || '-') : '-'; }

function telechargerFichier(nomFichier, contenu, type) {
  const blob = new Blob([contenu], { type: type || 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = nomFichier;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ============================================================
   NAVIGATION
   ============================================================ */

document.querySelectorAll('.navbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.navbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + btn.dataset.page).style.display = 'block';
    rafraichirTout();
  });
});

/* ============================================================
   MODAL
   ============================================================ */

function ouvrirModal(html) {
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('show');
}

function fermerModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target.id === 'modalOverlay') fermerModal();
});

/* ============================================================
   TABLEAU DE BORD
   ============================================================ */

function rafraichirTableauBord() {
  const total  = DB.sportifs.length;
  const elite  = DB.sportifs.filter(s => s.categorie === 'Elite').length;
  const espoir = DB.sportifs.filter(s => s.categorie === 'Espoir').length;
  const releve = DB.sportifs.filter(s => s.categorie === 'Relève').length;
  const actifs = DB.sportifs.filter(s => s.statut    === 'Actif').length;
  const blesses= DB.sportifs.filter(s => s.statut    === 'Blessé').length;
  const totalFin = DB.financement.reduce((acc, f) => acc + (parseFloat(f.montant) || 0), 0);

  document.getElementById('stats-cards').innerHTML = `
    <div class="stat-card"><h3>${total}</h3><p>Sportifs enregistrés</p></div>
    <div class="stat-card" style="border-color:var(--or)"><h3>${elite}</h3><p>Catégorie Elite</p></div>
    <div class="stat-card" style="border-color:var(--orange)"><h3>${espoir}</h3><p>Catégorie Espoir</p></div>
    <div class="stat-card" style="border-color:#0DA651"><h3>${releve}</h3><p>Catégorie Relève</p></div>
    <div class="stat-card"><h3>${actifs}</h3><p>Sportifs actifs</p></div>
    <div class="stat-card" style="border-color:#c0392b"><h3>${blesses}</h3><p>Sportifs blessés</p></div>
    <div class="stat-card"><h3>${DB.performances.length}</h3><p>Performances enregistrées</p></div>
    <div class="stat-card"><h3>${totalFin.toLocaleString('fr-FR')}</h3><p>Total aides/bourses (FCFA)</p></div>
  `;

  const catCount = {};
  DB.sportifs.forEach(s => { catCount[s.categorie] = (catCount[s.categorie] || 0) + 1; });
  document.getElementById('repartition-categorie').innerHTML = Object.keys(catCount).length
    ? Object.entries(catCount).map(([cat, n]) => `
        <div style="margin-bottom:6px;">
          <strong>${cat}</strong> : ${n} sportif(s)
          <div style="background:#eee;border-radius:6px;height:10px;overflow:hidden;margin-top:2px;">
            <div style="background:var(--vert);height:10px;width:${total ? Math.round(n / total * 100) : 0}%;"></div>
          </div>
        </div>`).join('')
    : '<p class="small">Aucune donnée disponible.</p>';

  const fedCount = {};
  DB.sportifs.forEach(s => { fedCount[s.federation] = (fedCount[s.federation] || 0) + 1; });
  document.getElementById('repartition-federation').innerHTML = Object.keys(fedCount).length
    ? Object.entries(fedCount).map(([fed, n]) => `
        <div style="margin-bottom:6px;">
          <strong>${fed || '(non précisée)'}</strong> : ${n} sportif(s)
          <div style="background:#eee;border-radius:6px;height:10px;overflow:hidden;margin-top:2px;">
            <div style="background:var(--orange);height:10px;width:${total ? Math.round(n / total * 100) : 0}%;"></div>
          </div>
        </div>`).join('')
    : '<p class="small">Aucune donnée disponible.</p>';
}

/* ============================================================
   SPORTIFS
   ============================================================ */

function badgeCategorie(cat) {
  const map = { Elite: 'b-elite', Espoir: 'b-espoir', 'Relève': 'b-releve' };
  return `<span class="badge ${map[cat] || ''}">${cat || '-'}</span>`;
}

function badgeStatut(st) {
  const map = { Actif: 'b-actif', Blessé: 'b-blesse', Suspendu: 'b-suspendu', Retraité: 'b-retraite' };
  return `<span class="badge ${map[st] || ''}">${st || '-'}</span>`;
}

function remplirFiltreFederations() {
  const sel     = document.getElementById('filtreFederation');
  const current = sel.value;
  sel.innerHTML = '<option value="">Toutes fédérations</option>' +
    DB.federations.map(f => {
      const n = nomFederation(f);
      return `<option value="${n}">${n}</option>`;
    }).join('');
  sel.value = current;
}

function rafraichirSportifs() {
  remplirFiltreFederations();
  const recherche = (document.getElementById('rechercheSportif').value || '').toLowerCase();
  const fCat    = document.getElementById('filtreCategorie').value;
  const fFed    = document.getElementById('filtreFederation').value;
  const fStatut = document.getElementById('filtreStatut').value;

  let liste = DB.sportifs.filter(s => {
    const texte = `${s.nom} ${s.prenom} ${s.discipline} ${s.matricule}`.toLowerCase();
    if (recherche && !texte.includes(recherche)) return false;
    if (fCat    && s.categorie  !== fCat)    return false;
    if (fFed    && s.federation !== fFed)    return false;
    if (fStatut && s.statut     !== fStatut) return false;
    return true;
  });

  document.getElementById('tableSportifs').innerHTML = liste.map(s => `
    <tr>
      <td>${s.matricule}</td>
      <td>${s.nom} ${s.prenom}</td>
      <td>${s.discipline}</td>
      <td>${s.federation || '-'}</td>
      <td>${badgeCategorie(s.categorie)}</td>
      <td>${badgeStatut(s.statut)}</td>
      <td>${s.dateNaissance || '-'}</td>
      <td>${s.region || '-'}</td>
      <td class="actions-cell">
        <button class="btn btn-secondary" onclick="voirSportif('${s.id}')">Fiche</button>
        <button class="btn btn-gold"      onclick="editerSportif('${s.id}')">Modifier</button>
        <button class="btn btn-danger"    onclick="supprimerSportif('${s.id}')">Suppr.</button>
      </td>
    </tr>
  `).join('');

  document.getElementById('emptySportifs').style.display = liste.length ? 'none' : 'block';
}

document.getElementById('rechercheSportif').addEventListener('input',  rafraichirSportifs);
document.getElementById('filtreCategorie').addEventListener('change',  rafraichirSportifs);
document.getElementById('filtreFederation').addEventListener('change', rafraichirSportifs);
document.getElementById('filtreStatut').addEventListener('change',     rafraichirSportifs);

function optionsFederations(selected) {
  return DB.federations.map(f => {
    const n = nomFederation(f);
    return `<option value="${n}" ${n === selected ? 'selected' : ''}>${n}</option>`;
  }).join('');
}

function formulaireSportif(sportif) {
  const s = sportif || {};
  // Option d'ajout rapide de fédération depuis le formulaire sportif
  const optAddFed = `<option value="__nouvelle__">+ Nouvelle fédération…</option>`;
  return `
    <h3>${sportif ? 'Modifier le sportif' : 'Nouveau sportif de haut niveau'}</h3>
    <input type="hidden" id="f_id" value="${s.id || ''}">
    <div class="grid">
      <div class="field"><label>Matricule DSHN</label><input id="f_matricule" value="${s.matricule || genererMatricule()}" ${sportif ? '' : 'readonly'}></div>
      <div class="field"><label>Nom *</label><input id="f_nom" value="${s.nom || ''}"></div>
      <div class="field"><label>Prénom *</label><input id="f_prenom" value="${s.prenom || ''}"></div>
      <div class="field"><label>Date de naissance</label><input type="date" id="f_dateNaissance" value="${s.dateNaissance || ''}"></div>
      <div class="field"><label>Sexe</label>
        <select id="f_sexe">
          <option value="Masculin" ${s.sexe === 'Masculin' ? 'selected' : ''}>Masculin</option>
          <option value="Féminin"  ${s.sexe === 'Féminin'  ? 'selected' : ''}>Féminin</option>
        </select>
      </div>
      <div class="field"><label>Région d'origine</label><input id="f_region" value="${s.region || ''}"></div>
      <div class="field"><label>Discipline sportive *</label><input id="f_discipline" value="${s.discipline || ''}"></div>
      <div class="field"><label>Fédération</label>
        <select id="f_federation" onchange="gererNouvellesFedFormSportif(this)">
          <option value="">-- Sélectionner --</option>
          ${optionsFederations(s.federation)}
          ${optAddFed}
        </select>
      </div>
      <div class="field" id="f_nvFedPanel" style="display:none;">
        <label>Nom de la nouvelle fédération *</label>
        <input id="f_nvFedNom" placeholder="Ex : Fédération Nigérienne de Natation">
        <input id="f_nvFedDisc" placeholder="Discipline (ex : Natation)" style="margin-top:6px;">
        <button class="btn btn-primary" onclick="ajouterFedDepuisFormSportif()" style="margin-top:6px;width:100%;">Créer et sélectionner</button>
      </div>
      <div class="field"><label>Catégorie *</label>
        <select id="f_categorie">
          <option value="Elite"   ${s.categorie === 'Elite'   ? 'selected' : ''}>Elite</option>
          <option value="Espoir"  ${s.categorie === 'Espoir'  ? 'selected' : ''}>Espoir</option>
          <option value="Relève"  ${s.categorie === 'Relève'  ? 'selected' : ''}>Relève</option>
        </select>
      </div>
      <div class="field"><label>Statut</label>
        <select id="f_statut">
          <option value="Actif"     ${s.statut === 'Actif'     ? 'selected' : ''}>Actif</option>
          <option value="Blessé"    ${s.statut === 'Blessé'    ? 'selected' : ''}>Blessé</option>
          <option value="Suspendu"  ${s.statut === 'Suspendu'  ? 'selected' : ''}>Suspendu</option>
          <option value="Retraité"  ${s.statut === 'Retraité'  ? 'selected' : ''}>Retraité</option>
        </select>
      </div>
      <div class="field"><label>Club / Structure</label><input id="f_club" value="${s.club || ''}"></div>
      <div class="field"><label>Encadreur / Entraîneur</label><input id="f_entraineur" value="${s.entraineur || ''}"></div>
      <div class="field"><label>Téléphone</label><input id="f_telephone" value="${s.telephone || ''}"></div>
      <div class="field"><label>N° Carte Nationale d'Identité</label><input id="f_cni" value="${s.cni || ''}"></div>
      <div class="field"><label>Date d'inscription au DSHN</label><input type="date" id="f_dateInscription" value="${s.dateInscription || ''}"></div>
    </div>
    <div class="field"><label>Palmarès / Distinctions</label><textarea id="f_palmares">${s.palmares || ''}</textarea></div>
    <div class="field"><label>Observations</label><textarea id="f_observations">${s.observations || ''}</textarea></div>
    <div style="text-align:right;margin-top:14px;">
      <button class="btn btn-secondary" onclick="fermerModal()">Annuler</button>
      <button class="btn btn-primary"   onclick="enregistrerSportif()">Enregistrer</button>
    </div>
  `;
}

/* Affiche/cache le panneau "nouvelle fédération" dans le formulaire sportif */
function gererNouvellesFedFormSportif(sel) {
  const panel = document.getElementById('f_nvFedPanel');
  if (sel.value === '__nouvelle__') {
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}

/* Crée la fédération et la sélectionne directement dans le select */
function ajouterFedDepuisFormSportif() {
  const nomInput  = document.getElementById('f_nvFedNom');
  const discInput = document.getElementById('f_nvFedDisc');
  const val       = nomInput.value.trim();
  const disc      = discInput.value.trim();
  if (!val) { alert("Veuillez saisir le nom de la fédération."); nomInput.focus(); return; }
  const exists = DB.federations.some(f => nomFederation(f).toLowerCase() === val.toLowerCase());
  if (exists) { alert("Cette fédération existe déjà."); return; }
  DB.federations.push({ nom: val, discipline: disc });
  sauvegarderDonnees();
  // Mettre à jour le select dans le formulaire
  const sel = document.getElementById('f_federation');
  const opt = document.createElement('option');
  opt.value = val; opt.text = val; opt.selected = true;
  // Insérer avant l'option "+ Nouvelle fédération..."
  const nvOpt = sel.querySelector('option[value="__nouvelle__"]');
  sel.insertBefore(opt, nvOpt);
  // Cacher le panneau
  document.getElementById('f_nvFedPanel').style.display = 'none';
  nomInput.value = ''; discInput.value = '';
  rafraichirFederations();
}

document.getElementById('btnNouveauSportif').addEventListener('click', () => {
  ouvrirModal(formulaireSportif(null));
});

function enregistrerSportif() {
  const id         = document.getElementById('f_id').value;
  const nom        = document.getElementById('f_nom').value.trim();
  const prenom     = document.getElementById('f_prenom').value.trim();
  const discipline = document.getElementById('f_discipline').value.trim();
  const federation = document.getElementById('f_federation').value;
  if (!nom || !prenom || !discipline) {
    alert("Veuillez renseigner au minimum le nom, le prénom et la discipline.");
    return;
  }
  if (federation === '__nouvelle__') {
    alert("Veuillez créer la fédération ou en sélectionner une existante avant d'enregistrer.");
    return;
  }
  const data = {
    id:            id || genererId(),
    matricule:     document.getElementById('f_matricule').value,
    nom, prenom,
    dateNaissance: document.getElementById('f_dateNaissance').value,
    sexe:          document.getElementById('f_sexe').value,
    region:        document.getElementById('f_region').value,
    discipline,
    federation,
    categorie:     document.getElementById('f_categorie').value,
    statut:        document.getElementById('f_statut').value,
    club:          document.getElementById('f_club').value,
    entraineur:    document.getElementById('f_entraineur').value,
    telephone:     document.getElementById('f_telephone').value,
    cni:           document.getElementById('f_cni').value,
    dateInscription: document.getElementById('f_dateInscription').value,
    palmares:      document.getElementById('f_palmares').value,
    observations:  document.getElementById('f_observations').value
  };
  if (id) {
    const idx = DB.sportifs.findIndex(s => s.id === id);
    DB.sportifs[idx] = data;
  } else {
    DB.sportifs.push(data);
  }
  sauvegarderDonnees();
  fermerModal();
  rafraichirTout();
}

function editerSportif(id) {
  const s = DB.sportifs.find(x => x.id === id);
  ouvrirModal(formulaireSportif(s));
}

function supprimerSportif(id) {
  if (!confirm("Supprimer ce sportif ? Toutes ses données (performances, médical, financements) seront conservées mais dissociées.")) return;
  DB.sportifs = DB.sportifs.filter(s => s.id !== id);
  sauvegarderDonnees();
  rafraichirTout();
}

function voirSportif(id) {
  const s     = DB.sportifs.find(x => x.id === id);
  const perfs = DB.performances.filter(p => p.sportifId === id);
  const meds  = DB.medical.filter(m => m.sportifId === id);
  const fins  = DB.financement.filter(f => f.sportifId === id);
  ouvrirModal(`
    <h3>Fiche sportif — ${s.nom} ${s.prenom}</h3>
    <div class="grid">
      <p><strong>Matricule :</strong> ${s.matricule}</p>
      <p><strong>Date de naissance :</strong> ${s.dateNaissance || '-'}</p>
      <p><strong>Sexe :</strong> ${s.sexe || '-'}</p>
      <p><strong>Région :</strong> ${s.region || '-'}</p>
      <p><strong>Discipline :</strong> ${s.discipline}</p>
      <p><strong>Fédération :</strong> ${s.federation || '-'}</p>
      <p><strong>Catégorie :</strong> ${badgeCategorie(s.categorie)}</p>
      <p><strong>Statut :</strong> ${badgeStatut(s.statut)}</p>
      <p><strong>Club :</strong> ${s.club || '-'}</p>
      <p><strong>Entraîneur :</strong> ${s.entraineur || '-'}</p>
      <p><strong>Téléphone :</strong> ${s.telephone || '-'}</p>
      <p><strong>CNI :</strong> ${s.cni || '-'}</p>
      <p><strong>Date d'inscription DSHN :</strong> ${s.dateInscription || '-'}</p>
    </div>
    <p><strong>Palmarès :</strong><br>${s.palmares || '-'}</p>
    <p><strong>Observations :</strong><br>${s.observations || '-'}</p>
    <hr>
    <p><strong>Performances enregistrées :</strong> ${perfs.length}</p>
    <p><strong>Fiches médicales :</strong> ${meds.length}</p>
    <p><strong>Aides financières :</strong> ${fins.length} (Total: ${fins.reduce((a, f) => a + (parseFloat(f.montant) || 0), 0).toLocaleString('fr-FR')} FCFA)</p>
    <div style="text-align:right;margin-top:14px;">
      <button class="btn btn-gold"      onclick="window.print()">Imprimer</button>
      <button class="btn btn-secondary" onclick="fermerModal()">Fermer</button>
    </div>
  `);
}

document.getElementById('btnExportListeCSV').addEventListener('click', () => {
  let csv = "Matricule;Nom;Prenom;Discipline;Federation;Categorie;Statut;DateNaissance;Sexe;Region;Club;Entraineur;Telephone\n";
  DB.sportifs.forEach(s => {
    csv += [s.matricule, s.nom, s.prenom, s.discipline, s.federation, s.categorie, s.statut,
            s.dateNaissance, s.sexe, s.region, s.club, s.entraineur, s.telephone]
      .map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(';') + "\n";
  });
  telechargerFichier("GSHN_liste_sportifs.csv", csv, "text/csv;charset=utf-8;");
});

/* ============================================================
   PERFORMANCES
   ============================================================ */

function remplirSelectSportifs(selectId) {
  const sel     = document.getElementById(selectId);
  const current = sel.value;
  sel.innerHTML = '<option value="">-- Sélectionner un sportif --</option>' +
    DB.sportifs.map(s => `<option value="${s.id}">${s.matricule} - ${s.nom} ${s.prenom} (${s.discipline})</option>`).join('');
  sel.value = current;
}

function rafraichirPerformances() {
  remplirSelectSportifs('selectSportifPerf');
  const sportifId = document.getElementById('selectSportifPerf').value;
  let liste = DB.performances;
  if (sportifId) liste = liste.filter(p => p.sportifId === sportifId);
  liste = [...liste].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  document.getElementById('tablePerformances').innerHTML = liste.map(p => {
    const s = DB.sportifs.find(x => x.id === p.sportifId);
    return `<tr>
      <td>${p.date || '-'}</td>
      <td>${s ? (s.nom + ' ' + s.prenom) : '(supprimé)'}</td>
      <td>${p.competition  || '-'}</td>
      <td>${p.niveau       || '-'}</td>
      <td>${p.resultat     || '-'}</td>
      <td>${p.record ? 'Oui' : 'Non'}</td>
      <td>${p.observations || '-'}</td>
      <td class="actions-cell"><button class="btn btn-danger" onclick="supprimerPerf('${p.id}')">Suppr.</button></td>
    </tr>`;
  }).join('');
  document.getElementById('emptyPerf').style.display = liste.length ? 'none' : 'block';
}

document.getElementById('selectSportifPerf').addEventListener('change', rafraichirPerformances);

document.getElementById('btnAjouterPerf').addEventListener('click', () => {
  if (DB.sportifs.length === 0) { alert("Veuillez d'abord enregistrer au moins un sportif."); return; }
  ouvrirModal(`
    <h3>Nouvelle performance</h3>
    <div class="field"><label>Sportif *</label>
      <select id="p_sportif">${DB.sportifs.map(s => `<option value="${s.id}">${s.nom} ${s.prenom} (${s.discipline})</option>`).join('')}</select>
    </div>
    <div class="grid">
      <div class="field"><label>Date *</label><input type="date" id="p_date" value="${new Date().toISOString().slice(0, 10)}"></div>
      <div class="field"><label>Compétition</label><input id="p_competition"></div>
      <div class="field"><label>Niveau</label>
        <select id="p_niveau">
          <option>National</option><option>Régional (Afrique)</option>
          <option>International</option><option>Olympique</option>
        </select>
      </div>
      <div class="field"><label>Résultat (temps, score, classement...)</label><input id="p_resultat"></div>
      <div class="field"><label>Nouveau record ?</label>
        <select id="p_record"><option value="0">Non</option><option value="1">Oui</option></select>
      </div>
    </div>
    <div class="field"><label>Observations</label><textarea id="p_observations"></textarea></div>
    <div style="text-align:right;margin-top:14px;">
      <button class="btn btn-secondary" onclick="fermerModal()">Annuler</button>
      <button class="btn btn-primary"   onclick="enregistrerPerf()">Enregistrer</button>
    </div>
  `);
});

function enregistrerPerf() {
  DB.performances.push({
    id:          genererId(),
    sportifId:   document.getElementById('p_sportif').value,
    date:        document.getElementById('p_date').value,
    competition: document.getElementById('p_competition').value,
    niveau:      document.getElementById('p_niveau').value,
    resultat:    document.getElementById('p_resultat').value,
    record:      document.getElementById('p_record').value === '1',
    observations:document.getElementById('p_observations').value
  });
  sauvegarderDonnees();
  fermerModal();
  rafraichirTout();
}

function supprimerPerf(id) {
  if (!confirm("Supprimer cette performance ?")) return;
  DB.performances = DB.performances.filter(p => p.id !== id);
  sauvegarderDonnees();
  rafraichirTout();
}

/* ============================================================
   MEDICAL
   ============================================================ */

function rafraichirMedical() {
  remplirSelectSportifs('selectSportifMed');
  const sportifId = document.getElementById('selectSportifMed').value;
  let liste = DB.medical;
  if (sportifId) liste = liste.filter(m => m.sportifId === sportifId);
  liste = [...liste].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  document.getElementById('tableMedical').innerHTML = liste.map(m => {
    const s = DB.sportifs.find(x => x.id === m.sportifId);
    return `<tr>
      <td>${m.date     || '-'}</td>
      <td>${s ? (s.nom + ' ' + s.prenom) : '(supprimé)'}</td>
      <td>${m.type     || '-'}</td>
      <td>${m.medecin  || '-'}</td>
      <td>${m.aptitude || '-'}</td>
      <td>${m.observations || '-'}</td>
      <td class="actions-cell"><button class="btn btn-danger" onclick="supprimerMed('${m.id}')">Suppr.</button></td>
    </tr>`;
  }).join('');
  document.getElementById('emptyMed').style.display = liste.length ? 'none' : 'block';
}

document.getElementById('selectSportifMed').addEventListener('change', rafraichirMedical);

document.getElementById('btnAjouterMed').addEventListener('click', () => {
  if (DB.sportifs.length === 0) { alert("Veuillez d'abord enregistrer au moins un sportif."); return; }
  ouvrirModal(`
    <h3>Nouvelle fiche médicale</h3>
    <div class="field"><label>Sportif *</label>
      <select id="m_sportif">${DB.sportifs.map(s => `<option value="${s.id}">${s.nom} ${s.prenom}</option>`).join('')}</select>
    </div>
    <div class="grid">
      <div class="field"><label>Date *</label><input type="date" id="m_date" value="${new Date().toISOString().slice(0, 10)}"></div>
      <div class="field"><label>Type d'examen</label>
        <select id="m_type">
          <option>Visite médicale d'aptitude</option>
          <option>Contrôle antidopage</option>
          <option>Bilan physique / VMA</option>
          <option>Suivi de blessure</option>
          <option>Autre</option>
        </select>
      </div>
      <div class="field"><label>Médecin / Centre médical</label><input id="m_medecin"></div>
      <div class="field"><label>Conclusion / Aptitude</label>
        <select id="m_aptitude">
          <option>Apte</option><option>Apte avec réserve</option>
          <option>Inapte temporaire</option><option>Inapte</option>
        </select>
      </div>
    </div>
    <div class="field"><label>Observations</label><textarea id="m_observations"></textarea></div>
    <div style="text-align:right;margin-top:14px;">
      <button class="btn btn-secondary" onclick="fermerModal()">Annuler</button>
      <button class="btn btn-primary"   onclick="enregistrerMed()">Enregistrer</button>
    </div>
  `);
});

function enregistrerMed() {
  DB.medical.push({
    id:           genererId(),
    sportifId:    document.getElementById('m_sportif').value,
    date:         document.getElementById('m_date').value,
    type:         document.getElementById('m_type').value,
    medecin:      document.getElementById('m_medecin').value,
    aptitude:     document.getElementById('m_aptitude').value,
    observations: document.getElementById('m_observations').value
  });
  sauvegarderDonnees();
  fermerModal();
  rafraichirTout();
}

function supprimerMed(id) {
  if (!confirm("Supprimer cette fiche médicale ?")) return;
  DB.medical = DB.medical.filter(m => m.id !== id);
  sauvegarderDonnees();
  rafraichirTout();
}

/* ============================================================
   FINANCEMENT
   ============================================================ */

function rafraichirFinancement() {
  remplirSelectSportifs('selectSportifFin');
  const sportifId = document.getElementById('selectSportifFin').value;
  let liste = DB.financement;
  if (sportifId) liste = liste.filter(f => f.sportifId === sportifId);
  liste = [...liste].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  document.getElementById('tableFinancement').innerHTML = liste.map(f => {
    const s = DB.sportifs.find(x => x.id === f.sportifId);
    return `<tr>
      <td>${f.date    || '-'}</td>
      <td>${s ? (s.nom + ' ' + s.prenom) : '(supprimé)'}</td>
      <td>${f.type    || '-'}</td>
      <td>${(parseFloat(f.montant) || 0).toLocaleString('fr-FR')}</td>
      <td>${f.source  || '-'}</td>
      <td>${f.statut  || '-'}</td>
      <td>${f.observations || '-'}</td>
      <td class="actions-cell"><button class="btn btn-danger" onclick="supprimerFin('${f.id}')">Suppr.</button></td>
    </tr>`;
  }).join('');
  document.getElementById('emptyFin').style.display = liste.length ? 'none' : 'block';
  const total = liste.reduce((a, f) => a + (parseFloat(f.montant) || 0), 0);
  document.getElementById('totalFinancement').textContent = `Total affiché : ${total.toLocaleString('fr-FR')} FCFA`;
}

document.getElementById('selectSportifFin').addEventListener('change', rafraichirFinancement);

document.getElementById('btnAjouterFin').addEventListener('click', () => {
  if (DB.sportifs.length === 0) { alert("Veuillez d'abord enregistrer au moins un sportif."); return; }
  ouvrirModal(`
    <h3>Nouvelle aide financière / bourse / prime</h3>
    <div class="field"><label>Sportif *</label>
      <select id="fi_sportif">${DB.sportifs.map(s => `<option value="${s.id}">${s.nom} ${s.prenom}</option>`).join('')}</select>
    </div>
    <div class="grid">
      <div class="field"><label>Date *</label><input type="date" id="fi_date" value="${new Date().toISOString().slice(0, 10)}"></div>
      <div class="field"><label>Type</label>
        <select id="fi_type">
          <option>Bourse mensuelle de sportif de haut niveau</option>
          <option>Prime de performance</option>
          <option>Aide à la préparation</option>
          <option>Prise en charge médicale</option>
          <option>Autre</option>
        </select>
      </div>
      <div class="field"><label>Montant (FCFA) *</label><input type="number" id="fi_montant" min="0" step="1"></div>
      <div class="field"><label>Source de financement</label>
        <select id="fi_source">
          <option>Ministère de la Jeunesse, des Sports et de la Culture</option>
          <option>DSHN</option>
          <option>Fédération</option>
          <option>Partenaire / Sponsor</option>
          <option>Autre</option>
        </select>
      </div>
      <div class="field"><label>Statut</label>
        <select id="fi_statut">
          <option>Programmé</option><option>Payé</option>
          <option>En attente</option><option>Annulé</option>
        </select>
      </div>
    </div>
    <div class="field"><label>Observations</label><textarea id="fi_observations"></textarea></div>
    <div style="text-align:right;margin-top:14px;">
      <button class="btn btn-secondary" onclick="fermerModal()">Annuler</button>
      <button class="btn btn-primary"   onclick="enregistrerFin()">Enregistrer</button>
    </div>
  `);
});

function enregistrerFin() {
  DB.financement.push({
    id:           genererId(),
    sportifId:    document.getElementById('fi_sportif').value,
    date:         document.getElementById('fi_date').value,
    type:         document.getElementById('fi_type').value,
    montant:      document.getElementById('fi_montant').value,
    source:       document.getElementById('fi_source').value,
    statut:       document.getElementById('fi_statut').value,
    observations: document.getElementById('fi_observations').value
  });
  sauvegarderDonnees();
  fermerModal();
  rafraichirTout();
}

function supprimerFin(id) {
  if (!confirm("Supprimer cette aide financière ?")) return;
  DB.financement = DB.financement.filter(f => f.id !== id);
  sauvegarderDonnees();
  rafraichirTout();
}

/* ============================================================
   FÉDÉRATIONS
   ============================================================ */

function rafraichirFederations() {
  document.getElementById('tableFederations').innerHTML = DB.federations.map((f, i) => {
    const nom  = nomFederation(f);
    const disc = disciplineFederation(f);
    const n    = DB.sportifs.filter(s => s.federation === nom).length;
    const escapedNom = nom.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `<tr>
      <td>${i + 1}</td>
      <td><strong>${nom}</strong></td>
      <td>${disc}</td>
      <td><span class="badge b-actif">${n}</span></td>
      <td class="actions-cell">
        <button class="btn btn-danger" onclick="supprimerFederation('${escapedNom}')">Supprimer</button>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="5" class="empty">Aucune fédération enregistrée.</td></tr>';
}

document.getElementById('btnAjouterFederation').addEventListener('click', () => {
  const input     = document.getElementById('nouvelleFederation');
  const inputDisc = document.getElementById('nouvelleFedDiscipline');
  const val       = input.value.trim();
  const disc      = inputDisc.value.trim();
  if (!val) { alert("Veuillez saisir le nom de la fédération."); input.focus(); return; }
  const exists = DB.federations.some(f => nomFederation(f).toLowerCase() === val.toLowerCase());
  if (exists) { alert("Cette fédération existe déjà dans la liste."); return; }
  DB.federations = DB.federations.map(f => typeof f === 'string' ? { nom: f, discipline: '' } : f);
  DB.federations.push({ nom: val, discipline: disc });
  input.value = ''; inputDisc.value = '';
  sauvegarderDonnees();
  rafraichirTout();
  input.focus();
});

function supprimerFederation(nom) {
  if (!confirm("Supprimer cette fédération ? (Les sportifs associés ne seront pas supprimés)")) return;
  DB.federations = DB.federations.filter(f => nomFederation(f) !== nom);
  sauvegarderDonnees();
  rafraichirTout();
}

/* ============================================================
   SAUVEGARDE / RESTAURATION
   ============================================================ */

document.getElementById('btnBackup').addEventListener('click', () => {
  const data = JSON.stringify(DB, null, 2);
  const date = new Date().toISOString().slice(0, 10);
  telechargerFichier(`GSHN_backup_${date}.json`, data, 'application/json');
});

document.getElementById('btnRestore').addEventListener('click', () => {
  const fileInput = document.getElementById('inputRestore');
  const file      = fileInput.files[0];
  if (!file) { alert("Veuillez sélectionner un fichier de sauvegarde (.json)."); return; }
  if (!confirm("La restauration remplacera toutes les données actuelles par celles du fichier sélectionné. Continuer ?")) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.sportifs) throw new Error("Format de fichier invalide.");
      DB                = data;
      DB.sportifs       = DB.sportifs       || [];
      DB.performances   = DB.performances   || [];
      DB.medical        = DB.medical        || [];
      DB.financement    = DB.financement    || [];
      DB.federations    = DB.federations    || [];
      // Migration
      DB.federations = DB.federations.map(f => typeof f === 'string' ? { nom: f, discipline: '' } : f);
      sauvegarderDonnees();
      rafraichirTout();
      alert("Restauration effectuée avec succès.");
    } catch (err) {
      alert("Erreur : fichier de sauvegarde invalide. " + err.message);
    }
  };
  reader.readAsText(file);
});

document.getElementById('btnReset').addEventListener('click', () => {
  if (!confirm("ATTENTION : cette action supprimera DÉFINITIVEMENT toutes les données enregistrées sur cet ordinateur. Avez-vous fait une sauvegarde ?")) return;
  if (!confirm("Confirmez-vous une seconde fois la réinitialisation complète des données ?")) return;
  localStorage.removeItem(STORAGE_KEY);
  DB = { sportifs: [], performances: [], medical: [], financement: [], federations: [], lastSave: null };
  chargerDonnees();
  sauvegarderDonnees();
  rafraichirTout();
  alert("Les données ont été réinitialisées.");
});

function afficherDerniereSauvegarde() {
  const el = document.getElementById('lastSave');
  if (!el) return;
  if (DB.lastSave) {
    const d = new Date(DB.lastSave);
    el.textContent = "Dernier enregistrement automatique sur ce poste : " + d.toLocaleString('fr-FR');
  } else {
    el.textContent = "Aucune donnée enregistrée pour le moment.";
  }
}

/* ============================================================
   RAFRAÎCHISSEMENT GLOBAL
   ============================================================ */

function rafraichirTout() {
  rafraichirTableauBord();
  rafraichirSportifs();
  rafraichirPerformances();
  rafraichirMedical();
  rafraichirFinancement();
  rafraichirFederations();
  afficherDerniereSauvegarde();
}

/* ============================================================
   DATE EN-TÊTE
   ============================================================ */

document.getElementById('dateAujourdhui').textContent = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

/* ============================================================
   INITIALISATION
   ============================================================ */

chargerDonnees();
rafraichirTout();
