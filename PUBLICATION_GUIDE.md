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
- ✅ NPM_TOKEN secret requis dans GitHub Repository Settings

**Pour configurer:**
1. Générer NPM token: https://www.npmjs.com/settings/~/tokens
2. Ajouter à GitHub: Settings > Secrets and variables > Actions > New repository secret
3. Nommer: `NPM_TOKEN`

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

### GitHub Actions Setup
- [ ] Ajouter NPM_TOKEN secret à GitHub
  1. Générer token: https://www.npmjs.com/settings/~/tokens
  2. Settings > Secrets and variables > Actions > New repository secret
  3. Nommer: `NPM_TOKEN`
- [ ] Tester le workflow avec un nouveau tag
- [ ] Vérifier la publication auto sur npm

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

### Publication avec GitHub Actions (recommandé)
```bash
# Créer et pousser un nouveau tag
cd /home/yrda7553/dev/saat
git tag -a v1.1.0 -m "Release v1.1.0: [description]"
git push origin v1.1.0

# → GitHub Actions publie automatiquement sur npm ✅
```

### Publication manuelle (si nécessaire)
```bash
cd /home/yrda7553/dev/saat
npm publish
```

### Tester localement
```bash
cd /home/yrda7553/dev/saat
npm link

cd /home/yrda7553/dev/shop-tv-ott/front
npm link @reno-orange/saat
npm run a11y:audit
```

### Vérifier publication
```bash
npm view @reno-orange/saat versions
npm info @reno-orange/saat
npm view @reno-orange/saat dist-tags
```

### Workflows GitHub Actions
- **CI** (`.github/workflows/ci.yml`): Tests sur Node 18 et 20
- **Publish** (`.github/workflows/publish.yml`): Publication sur npm au push de tag
  - Déclenché: `git push origin v*`
  - Prérequis: `NPM_TOKEN` secret configuré

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
