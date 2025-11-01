# CENIE Editorial - Quick Start Guide

## 🚀 Your System is Complete and Ready!

This guide will help you start using the CENIE Editorial system immediately.

---

## ✅ Step 1: Publish Your First Book (15 minutes)

### A. Create Contributors

**1. Create an Author:**

```
Dashboard → Contributors → Add Contributor
  Name: Constantin Stanislavski
  Role: Author
  Nationality: Russian
  Birth Year: 1863
  Death Year: 1938
  Bio (ES): Maestro del teatro ruso, creador del método Stanislavski...
  → Save
```

**2. Create a Translator:**

```
Dashboard → Contributors → Add Contributor
  Name: Elena Torres
  Role: Translator
  Specializations: teatro, artes escénicas
  Languages: en-es
  Bio (ES): Traductora especializada en textos teatrales...
  → Save
```

---

### B. Add a Book from Google Books

**1. Search:**

```
Dashboard → Search Books
  Search: "stanislavski actor prepares"
  → Click "Add Book" on result
```

**2. Mark for Translation:**

```
Book Detail Page:
  ✓ Selected for Translation
  Translation Priority: 1
  Marketability Score: 9
  Relevance Score: 10
  → Save Changes
```

---

### C. Prepare for Publication

**1. Access Preparation:**

```
Book Detail Page:
  → Click "Prepare for Publication"
```

**2. Auto-Translate Metadata:**

```
Step 1: Spanish Metadata
  → Click "Auto-translate" next to Title
  Result: "La Preparación del Actor"
  → Edit if needed
  → Click "Auto-translate" next to Description
  → Review and refine
```

**3. Assign Contributors:**

```
Step 2: Assign Contributors
  Original Author: Type "stan" → Select Stanislavski
  Translator: Type "elena" → Select Elena Torres
  ✓ Checklist updates
```

**4. Add Cover:**

```
Step 4: Publication Details
  → Click "Browse Existing" tab
  → Select a cover from your library
  OR
  → Click "Upload New" tab
  → Drag and drop cover file
  → Saves as la-preparacion-del-actor.jpg
```

**5. Add Details:**

```
  Categories: teatro, actuación, método
  Tags: stanislavski, actuación, formación
  ISBN-13: (if available)
  Publication Year: 2024
  → Save Draft
```

**6. Publish:**

```
  → Click "Publish to Catalog"
  → Confirm
  ✓ Volume created as draft!
```

---

### D. Make it Public

**1. Review Draft:**

```
Dashboard → Catalog
  → Find your book (status: Draft)
  → Click "Edit" to review
```

**2. Publish to Public:**

```
  → Click "Publish to Public"
  → Confirm
  ✓ Now live at /catalogo/la-preparacion-del-actor
```

---

## 🌐 Step 2: View Your Public Catalog

**Visit:** `https://editorial.cenie.org/catalogo`

You'll see:

- Your published book in the grid
- If marked as featured → Also in carousel
- Searchable via search box
- Filterable by categories

**Click the book** → See full detail page with:

- Cover and metadata
- Description
- Table of contents (if added)
- Reviews (if added)
- Author and translator bios
- "Acceder" button

---

## 🎯 Step 3: Add More Content

### For Faster Workflow:

**Batch Create Contributors:**

```
Dashboard → Contributors
  → Add 5-10 common authors (Brecht, Brook, Grotowski...)
  → Add 3-5 translators
  → Now autocomplete has a good base
```

**Design Covers in Advance:**

```
Local workflow:
  1. Design covers in Photoshop/Figma
  2. Export to public/images/covers/{slug}.jpg
  3. Commit to git
  4. In dashboard: Browse Existing → Select
  → Fast linking, no upload needed
```

**Use Auto-Translation Heavily:**

```
  → Auto-translate first
  → Then refine manually
  → Glossary ensures consistency
  → Saves hours per book
```

---

## 📚 Step 4: Create an Original Publication

**For CENIE-Authored Books:**

```
Dashboard → Catalog → Create Original Publication
  Type: Original Publication
  Title: Técnicas Contemporáneas de Iluminación Teatral
  Description: Una guía completa sobre...
  Upload Cover: (browse or upload)
  Assign Authors: (CENIE researchers)
  Assign Editors: (if applicable)
  Categories: teatro, iluminación, técnica
  → Create Publication
  → Review draft
  → Publish to Public
```

**Time:** ~15 minutes  
**Result:** Original CENIE book in catalog

---

## 🔍 Common Tasks Reference

### **Search for a Book:**

```
Dashboard → Search Books
  → Type query
  → Browse results
  → Add to workspace
```

### **Edit a Volume:**

```
Dashboard → Catalog
  → Find volume
  → Click "Edit"
  → Update metadata
  → Save Changes
```

### **Feature a Book:**

```
Dashboard → Catalog → Edit Volume
  ✓ Featured Volume
  → Save
  → Now appears in carousel on /catalogo
```

### **Update a Cover:**

```
Option A (Upload new):
  Edit Volume → Upload New → Drag file

Option B (Select existing):
  Edit Volume → Browse Existing → Select thumbnail
```

### **Add Reviews/Praise:**

```
(Currently via database - UI coming in Phase 4)

Or prepare in advance and add during preparation:
  Reviews field in catalog edit page
```

---

## 💡 Pro Tips

### **Workflow Optimization:**

1. **Create contributors library first** - Speeds up book preparation
2. **Design covers in batch** - Export all to public folder, commit once
3. **Use glossary** - Auto-translate first, then refine
4. **Save drafts often** - Don't lose work
5. **Review before publishing** - Check in catalog management

### **Data Quality:**

1. **Consistent author names** - Use autocomplete, avoid creating duplicates
2. **Complete bios** - Richer public catalog
3. **Good descriptions** - Better SEO and engagement
4. **Accurate ISBNs** - Professional metadata
5. **Meaningful categories** - Better filtering

### **Cover Management:**

1. **Export with slug names** - Easy to find: `stanislavski-actor.jpg`
2. **High resolution** - 1200px+ width, TwicPics will optimize
3. **Consistent style** - CENIE branding
4. **Commit to git** - Version controlled

---

## 🐛 Troubleshooting

### **"Book not showing in public catalog"**

→ Check publication_status = 'published' in Dashboard → Catalog

### **"Auto-translate not working"**

→ Verify `GOOGLE_CLOUD_TRANSLATION_API_KEY` is set

### **"Cover not displaying"**

→ Check file exists in `public/images/covers/`  
→ Check TwicPics domain configured  
→ Check path in database matches filename

### **"Search returns no results"**

→ Make sure volumes have content in searchable fields  
→ Check publication_status = 'published'

### **"Related volumes not showing"**

→ Volume needs categories set  
→ Related volumes must share at least one category

---

## 📖 Documentation Reference

### **Getting Started:**

- `QUICK_START_GUIDE.md` (this file)
- `WHAT_YOU_CAN_DO_NOW.md`
- `PROJECT_COMPLETE.md`

### **Phase Summaries:**

- `PHASE_1_COMPLETE.md` - Database
- `PHASE_2_COMPLETE.md` - Editorial tools
- `PHASE_3_COMPLETE.md` - Public catalog

### **Testing:**

- `PHASE_2_TESTING_GUIDE.md`
- `TWICPICS_TESTING_GUIDE.md`

### **Technical:**

- `packages/supabase/migrations/README.md`
- `packages/supabase/DATA_MODEL.md`
- `FILE_BROWSER_IMPLEMENTATION.md`

---

## 🎯 Next Steps

### **This Week:**

1. Publish 3-5 test books
2. Add 10-15 contributors
3. Upload 5-10 covers
4. Test public catalog thoroughly
5. Share with colleagues for feedback

### **Next Month:**

1. Publish real content (10-20 books)
2. Optimize SEO descriptions
3. Add reviews and praise
4. Feature best books
5. Monitor analytics

### **Future (Phase 4):**

1. Author portfolio pages
2. Advanced search features
3. Analytics dashboard
4. User reviews
5. Publishers UI pages

---

## 🎊 You're Ready to Launch!

**Everything is built, tested, and production-ready.**

Start with a few test books, then scale up to your full catalog.

The system will handle hundreds of books efficiently, and the workflow will save you hours every week.

**Enjoy your new editorial system!** 📚✨

---

**Last Updated:** January 31, 2025  
**System Version:** 1.0 - Complete  
**Status:** Production Ready 🚀
