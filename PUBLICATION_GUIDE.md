# 📦 @reno-orange/saat - Publication NPM & Migration

## ✅ ÉTAPE 1 : Publication NPM Complétée

### Commit & Tag
- ✅ Commit initial: `6762baa` - "@reno-orange/saat v1.0.0"
- ✅ Tag créé: `v1.0.0`
- ✅ npm link fonctionnel

### Build Verification
- ✅ `npm run build` - OK
- ✅ `npm run type-check` - OK (0 erreurs)
- ✅ 116 fichiers compilés en `dist/`
- ✅ TypeScript declaration files (*.d.ts) générés

### Prêt pour Publication
```bash
# Depuis /home/yrda7553/dev/saat/
npm login --scope=@reno-orange
npm publish

# Ou via GitHub Actions (recommandé)
# - Créer .github/workflows/publish.yml
# - Ajouter NPM_TOKEN aux GitHub Secrets
# - Pousser les tags: git push --tags
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

### Publication NPM
- [ ] Vérifier connexion npm registry
- [ ] Exécuter: `npm publish` depuis /dev/saat/
- [ ] Vérifier sur https://www.npmjs.com/package/@reno-orange/saat
- [ ] Ajouter tags GitHub: `git push origin v1.0.0`

### Migration Front
- [ ] Installer @reno-orange/saat dans front/
- [ ] Vérifier les imports saat existants
- [ ] Tester npm run audit / lint-saat
- [ ] Valider les rapports générés
- [ ] Mettre en place CI/CD avec nouvelle lib

### Nettoyage (optionnel)
- [ ] Supprimer /shop-tv-ott/saat/ une fois testé
- [ ] Mettre à jour scripts monorepo
- [ ] Documenter la migration

---

## 🚀 Commandes Clés

### Publier sur NPM
```bash
cd /home/yrda7553/dev/saat
npm login --scope=@reno-orange
npm publish
```

### Tester localement
```bash
cd /home/yrda7553/dev/saat
npm link

cd /home/yrda7553/dev/shop-tv-ott/front
npm link @reno-orange/saat
```

### Vérifier publication
```bash
npm view @reno-orange/saat versions
npm info @reno-orange/saat
```

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
