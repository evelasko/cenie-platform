# Phase 2 Testing Guide

## ✅ What's Been Implemented

### Core Features Complete:

1. **Authentication System** - Fixed and working with Firestore
2. **Contributors Management** - Full CRUD operations
3. **Publishers Management** - Full CRUD operations
4. **Prepare for Publication Workflow** - Initial interface with auto-translation
5. **Auto-Translation API** - Google Cloud Translation with glossary

---

## 🧪 Testing Checklist

### Prerequisites

Before testing, ensure:

- [x] Database migration deployed
- [x] Firebase UID fix migration applied
- [x] You have admin access in Firestore `user_app_access`
- [x] Environment variables set:

  ```
  GOOGLE_API_KEY=<your-key>
  NEXT_PUBLIC_SUPABASE_URL=<your-url>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
  GOOGLE_CLOUD_TRANSLATION_API_KEY=<your-key>
  ```

### Test 1: Authentication ✅

**Steps:**

1. Navigate to <http://localhost:3001/sign-in>
2. Sign in with your email/password
3. Should redirect to dashboard
4. Check browser console for no errors

**Expected:**

- ✅ Successful sign-in
- ✅ Session cookie created
- ✅ Dashboard loads

### Test 2: Books Management ✅

**Steps:**

1. Navigate to `/dashboard/books/search`
2. Search for "stanislavski" or any theater book
3. Click "Add Book" on a result
4. Should add to database and redirect

**Expected:**

- ✅ Search results display
- ✅ Book adds successfully
- ✅ No UUID error (this was fixed!)
- ✅ Redirects to book detail page

### Test 3: Contributors Management ✅

**Step 3A: View Contributors List**

1. Click "Contributors" in dashboard sidebar
2. Should see empty list or existing contributors

**Expected:**

- ✅ Contributors page loads
- ✅ Empty state shows if no contributors
- ✅ "Add Contributor" button visible

**Step 3B: Create New Contributor**

1. Click "Add Contributor"
2. Fill in form:
   - Full Name: "Constantin Stanislavski"
   - Slug: (auto-generated) "constantin-stanislavski"
   - Primary Role: "Author"
   - Bio (Spanish): "Maestro del teatro ruso y creador del método Stanislavski"
   - Nationality: "Russian"
   - Birth Year: 1863
   - Death Year: 1938
3. Click "Create Contributor"

**Expected:**

- ✅ Slug auto-generates from name
- ✅ Contributor creates successfully
- ✅ Redirects to edit page
- ✅ Data saves correctly

**Step 3C: Search Contributors**

1. Go back to contributors list
2. Type "stan" in search box
3. Should see Stanislavski in results

**Expected:**

- ✅ Search filters results
- ✅ Results update as you type

**Step 3D: Edit Contributor**

1. Click "Edit" on a contributor
2. Update biography
3. Click "Save Changes"

**Expected:**

- ✅ Changes save successfully
- ✅ Toast notification shows
- ✅ Updated data displays

**Step 3E: Contributor Autocomplete**

1. Create another contributor (e.g., "Elena Torres" as Translator)
2. This will be used in next test

### Test 4: Auto-Translation ✅

**Step 4A: Select a Book for Translation**

1. Go to any book detail page
2. Check "Selected for Translation"
3. Add a translated title (any Spanish title)
4. Click "Save Changes"

**Expected:**

- ✅ Book updates successfully
- ✅ "Prepare for Publication" button appears

**Step 4B: Access Preparation Workflow**

1. Click "Prepare for Publication" button
2. Should navigate to preparation page

**Expected:**

- ✅ Preparation page loads
- ✅ Shows book title and original metadata
- ✅ Form fields are empty or pre-filled

**Step 4C: Auto-Translate Title**

1. Click "Auto-translate" button next to Spanish Title field
2. Wait for translation

**Expected:**

- ✅ Button shows "Translating..."
- ✅ Spanish title fills in automatically
- ✅ Toast shows success message
- ✅ If glossary terms used, toast shows count

**Step 4D: Manual Refinement**

1. Edit the auto-translated title
2. Make improvements
3. Click "Save Draft"

**Expected:**

- ✅ Draft saves to database
- ✅ Toast shows "Draft saved successfully!"

### Test 5: Contributors Assignment ✅

**In the Prepare for Publication page:**

**Step 5A: Assign Original Author**

1. Scroll to "Step 2: Assign Contributors"
2. In "Original Author(s)" field, start typing "stan"
3. Select "Constantin Stanislavski" from dropdown

**Expected:**

- ✅ Autocomplete shows suggestions
- ✅ Selected author appears as chip/badge
- ✅ Can remove by clicking X

**Step 5B: Assign Translator**

1. In "Translator(s)" field, start typing "elena"
2. Select "Elena Torres" from dropdown

**Expected:**

- ✅ Translator appears in selected list
- ✅ Multiple translators can be added
- ✅ Checklist updates (translator assigned ✓)

**Step 5C: Create New Contributor from Autocomplete**

1. In author field, type "New Author Name"
2. Click "Create new contributor" link
3. Opens in new tab → create contributor → return

**Expected:**

- ✅ Link to create new contributor appears
- ✅ Can create and return to assign

### Test 6: Validation & Checklist ✅

**In Prepare for Publication page:**

**Verify checklist updates:**

- [ ] Spanish title provided (when titleEs has value)
- [ ] Spanish description provided (when descriptionEs has value)
- [ ] Translator(s) assigned (when translators.length > 0)
- [ ] Original author(s) assigned (when authors.length > 0)

**Expected:**

- ✅ Checkboxes auto-update based on form state
- ✅ Visual feedback on what's required vs optional

### Test 7: Publishers (Simple Test) ✅

**Note:** No UI pages yet, test via API only

**Using browser console or API tool:**

```javascript
// Create CENIE Editorial publisher
fetch('/api/publishers', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'CENIE Editorial',
    slug: 'cenie-editorial',
    country: 'España',
    website_url: 'https://editorial.cenie.org',
  }),
})

// List publishers
fetch('/api/publishers', { credentials: 'include' })
  .then((r) => r.json())
  .then(console.log)
```

**Expected:**

- ✅ Publisher creates successfully
- ✅ List returns created publisher

---

## 🐛 Known Limitations (To Be Implemented)

1. **Cover Upload** - Placeholder shown, TwicPics integration coming next
2. **Publish to Catalog** - Button shows "coming soon" message
3. **Publishers UI** - No dashboard pages yet (API works)
4. **Photo Upload** - Contributors photos show placeholder
5. **Table of Contents** - JSON editor only (no visual builder yet)

---

## 🎯 What Works Right Now

### Fully Functional:

✅ Sign in / Sign out  
✅ Dashboard navigation  
✅ Books list, search, add, edit  
✅ Translation investigation (existing feature)  
✅ Contributors list, create, edit, search  
✅ Contributor autocomplete  
✅ Publishers API (list, create, edit)  
✅ Auto-translation with glossary  
✅ Prepare for publication interface (partial)

### Partially Implemented:

⏳ Prepare for publication (missing cover upload, catalog promotion)  
⏳ Publishers (no UI pages yet)

### Not Yet Implemented:

❌ Cover upload to TwicPics  
❌ Promote to catalog functionality  
❌ Catalog management dashboard  
❌ Public catalog pages

---

## 🔍 Common Issues & Solutions

### Issue: "Invalid UUID" Error When Adding Book

**Solution:** Apply the Firebase UID fix migration (should be done already)

### Issue: "Authentication required" on API calls

**Solution:**

1. Check you're signed in
2. Verify session cookie exists (browser DevTools → Application → Cookies)
3. Check Firestore has your `user_app_access` entry

### Issue: "Insufficient permissions"

**Solution:**

1. Check your role in Firestore `user_app_access`
2. Ensure `isActive = true` and `appName = 'editorial'`
3. Refresh session (sign out and sign in again)

### Issue: Auto-translate fails

**Solution:**

1. Check `GOOGLE_CLOUD_TRANSLATION_API_KEY` is set in `.env`
2. Verify API is enabled in Google Cloud Console
3. Check browser console for error details

### Issue: Contributors autocomplete doesn't show suggestions

**Solution:**

1. Type at least 2 characters
2. Check `/api/contributors/search` returns data
3. Ensure contributors exist in database

---

## 📊 Test Data Suggestions

### Create Test Contributors:

**1. Author:**

- Name: Constantin Stanislavski
- Role: Author
- Nationality: Russian
- Years: 1863-1938

**2. Translator:**

- Name: Elena Torres
- Role: Translator
- Specializations: theater, performing arts
- Languages: en-es

**3. Editor:**

- Name: María García
- Role: Editor
- Nationality: Spanish

### Create Test Book:

- Search: "acting technique stanislavski"
- Add to database
- Mark as "Selected for Translation"
- Use for testing preparation workflow

---

## ✅ Success Criteria

Phase 2.1 is successful if:

- [x] Contributors can be created, edited, listed, searched
- [x] Auto-translation works with glossary integration
- [x] Autocomplete finds and selects contributors
- [x] Preparation interface loads and saves drafts
- [x] All API routes protected with proper authentication
- [x] No linting errors
- [x] TypeScript compiles without errors

---

## 🚀 Next Steps

After testing Phase 2.1:

1. **Implement Cover Upload (TwicPics)**
   - Upload API endpoint
   - TwicPics integration
   - Cover preview component

2. **Implement Promote to Catalog**
   - API endpoint using `promote_book_to_catalog()` function
   - Link contributors via `volume_contributors`
   - Generate display fields

3. **Build Catalog Management Dashboard**
   - List catalog volumes
   - Edit volumes
   - Create original publications

4. **Publishers UI Pages**
   - List page
   - Create/edit pages

---

**Test this thoroughly and report any issues before I proceed with remaining Phase 2 features!**
