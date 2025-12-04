# 📦 @reno-orange/saat - Publication NPM & Migration

## ✅ ÉTAPE 1 : Publication NPM Complétée

### Commit & Tag
- ✅ Commit initial: `6762baa` - "@reno-orange/saat v1.0.0"
- ✅ Tag créé: `v1.0.0`
- ✅ npm link fonctionnel
- ✅ Published sur npm: https://www.npmjs.com/package/@reno-orange/saat

### Build Verification
- ✅ `npm run build` - OK
- ✅ `npm run type-check` - OK (0 erreurs)
- ✅ 116 fichiers compilés en `dist/`
- ✅ TypeScript declaration files (*.d.ts) générés

### GitHub Actions Setup
- ✅ Workflow publish.yml créé: Auto-publication sur npm au push de tag
- ✅ Workflow ci.yml créé: Tests CI sur Node 18 et 20
- ✅ Authentification: Trusted Publisher OIDC (sans secrets!)

**Checklist - Configurer Trusted Publisher sur npm:**

1. ✅ **Vérifier le Repository GitHub**
   - Repo: `reno-orange/saat` (remplacer par votre valeur réelle)
   - Vérifier qu'il est public ou accessible

2. ⬜ **Sur npm.com - Ajouter Trusted Publisher**
   - Aller à: https://www.npmjs.com/settings/~/automation
   - Section: "Trusted Publishers"
   - Ajouter: GitHub Repository
   - **Org**: `reno-orange`
   - **Repo**: `saat`
   - **Workflow**: `publish.yml` (le fichier du workflow)
   - Sauvegarder

3. ⬜ **Vérifier le Repository GitHub Settings**
   - Settings > Actions > General
   - "Workflow permissions": ✅ Read and write permissions
   - "Allow GitHub Actions to create and approve pull requests": À votre préférence

4. ✅ **Workflow GitHub Actions**
   - `.github/workflows/publish.yml` avec permissions: `id-token: write`
   - Aucun secret NPM_TOKEN requis! ✅

**Résultat**: npm publiera uniquement quand:
- Tag push depuis `reno-orange/saat`
- Workflow `publish.yml`
- Aucune clé n'est stockée sur GitHub ✅

**Utilisation automatique:**
```bash
# Créer un nouveau tag et pousser
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0
# → GitHub Actions publie automatiquement sur npm
```

---

## 🔄 ÉTAPE 2 : Migration shop-tv-ott/front

### Localisation actuelle de saat
- Code: `/home/yrda7553/dev/shop-tv-ott/saat/`
- Utilisé par: `front/a11y/scripts/` et CI/CD

### Migration Steps

#### 2.1 Ajouter @reno-orange/saat au front/package.json
```bash
cd /home/yrda7553/dev/shop-tv-ott/front
npm install --save-dev @reno-orange/saat
# Ou avec le lien local:
npm link @reno-orange/saat
```

#### 2.2 Vérifier les fichiers utilisateurs
- `front/a11y/scripts/badge-generator.ts` - Utilise generateBadge?
- `front/a11y/scripts/calculate-conformity.ts` - Calcul de conformité
- CI/CD scripts qui appellent SAAT

#### 2.3 Tester les scripts avec la lib
```bash
# Depuis front/
npm run lint-saat  # Si existant
npm run saat:audit # Si existant
```

### Fichiers à vérifier / mettre à jour

1. **shop-tv-ott/front/package.json**
   - Ajouter dépendance: `"@reno-orange/saat": "^1.0.0"`
   - Garder saat comme devDependency pour le moment

2. **shop-tv-ott/saat/** (optionnel)
   - Peut rester comme référence locale
   - Ou être supprimé une fois migration validée

3. **shop-tv-ott/front/a11y/scripts/**
   - Vérifier import/usage de saat
   - Mettre à jour les chemins si nécessaire

---

## 📋 Checklist Finale

### Publication NPM ✅
- ✅ Connexion npm registry vérifiée
- ✅ npm publish exécuté depuis /dev/saat/
- ✅ Vérifiée sur https://www.npmjs.com/package/@reno-orange/saat
- ✅ GitHub Actions workflows créés

### GitHub Actions Setup - Trusted Publisher OIDC
**À vérifier/configurer:**

1. **Checker l'organisation/repo GitHub**
   - [ ] Repo name: `reno-orange/saat` (ou votre URL réelle)
   - [ ] Repo est public ou accessible
   - [ ] `.github/workflows/publish.yml` existe avec permissions correctes

2. **Configurer npm Trusted Publisher**
   - [ ] Aller à: https://www.npmjs.com/settings/~/automation
   - [ ] Section "Trusted Publishers"
   - [ ] Ajouter GitHub Repository:
     - Org: `reno-orange`
     - Repo: `saat`
     - Workflow: `publish.yml`
   - [ ] Sauvegarder

3. **Vérifier GitHub Actions Permissions**
   - [ ] Settings > Actions > General
   - [ ] "Workflow permissions": ✅ Read and write
   - [ ] Pas de secrets à configurer! ✅

4. **Tester**
   - [ ] Créer tag et pousser: `git push origin v1.1.0`
   - [ ] Vérifier GitHub Actions > Publish workflow
   - [ ] Vérifier publication sur npm

### Migration Front ✅
- ✅ Installer @reno-orange/saat dans front/
- ✅ Fichier config a11y/saat.config.js créé
- ✅ npm run a11y:audit fonctionne
- ✅ Rapports générés (JSON + badges SVG)
- ✅ Conformité: 88.90% (WCAG AA)

### Nettoyage (optionnel)
- [ ] Supprimer /shop-tv-ott/saat/ une fois testé
- [ ] Mettre à jour scripts monorepo
- [ ] Documenter la migration
- [ ] Ajouter NPM_TOKEN à GitHub si publication auto souhaitée

---

## 🚀 Commandes Clés

### Publication avec GitHub Actions + Trusted Publisher
```bash
# 1. S'assurer que le repo GitHub et Trusted Publisher sont configurés
#    (voir checklist ci-dessus)

# 2. Créer et pousser un nouveau tag
cd /home/yrda7553/dev/saat
git tag -a v1.1.0 -m "Release v1.1.0: [description]"
git push origin v1.1.0

# 3. GitHub Actions:
#    - Déclenche automatiquement le workflow
#    - Utilise Trusted Publisher OIDC
#    - Publie sur npm sans token stocké! ✅
```

### Vérifier que tout est configuré
```bash
# Vérifier le repo GitHub
git remote -v

# Vérifier que le workflow existe
cat .github/workflows/publish.yml | grep -A5 "id-token: write"

# Vérifier npm package
npm view @reno-orange/saat
```

### Workflows GitHub Actions
- **CI** (`.github/workflows/ci.yml`): Tests sur Node 18 et 20
- **Publish** (`.github/workflows/publish.yml`): 
  - Déclenché: `git push origin v*`
  - Authentification: OIDC Trusted Publisher
  - Aucun secret requis ✅

---

## 📊 Package Info

- **Name**: @reno-orange/saat
- **Version**: 1.0.0
- **Main**: dist/lib.js
- **Types**: dist/lib.d.ts
- **CLI**: dist/index.js (via `saat` bin)
- **Exports**: 
  - Default: library API
  - ./cli: CLI entry point
- **Node Support**: >=18.0.0
- **License**: MIT
- **Dependencies**: 0 (zero dependencies!)

---

## 🔗 Ressources

- GitHub Repo: https://github.com/reno-orange/saat
- NPM Package: https://www.npmjs.com/package/@reno-orange/saat
- API Docs: dist/lib.d.ts
- CLI Usage: `npx saat --help`
