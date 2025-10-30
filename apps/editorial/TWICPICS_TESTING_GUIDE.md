# TwicPics Image Upload Testing Guide

## Overview

This guide provides comprehensive testing procedures for the TwicPics image upload integration implemented in Phase 2. Test all features systematically to ensure everything works correctly.

---

## Prerequisites

Before testing, ensure:

- ✅ You have editor or admin role access to the Editorial app
- ✅ Development server is running (`pnpm dev` in the editorial app)
- ✅ Database is accessible and migrations are applied
- ✅ TwicPics domain is configured: `cenie.twic.pics`
- ✅ Upload directories exist:
  - `apps/editorial/public/images/covers/`
  - `apps/editorial/public/images/contributors/`

---

## Test Scenarios

### 1. Book Cover Upload - Prepare for Publication Page

#### Test 1.1: Upload Cover Image (Happy Path)

**Steps:**

1. Navigate to Dashboard → Books
2. Select a book that has `selected_for_translation = true`
3. Click "Prepare for Publication" or navigate to `/dashboard/books/[id]/prepare`
4. Scroll to **Step 4: Publication Details**
5. Locate the "Cover Image" section
6. Click "Browse Files" or drag and drop an image file

**Expected Results:**

- ✅ Upload area shows drag-and-drop zone
- ✅ File picker opens when clicking "Browse Files"
- ✅ Valid image files are accepted (JPG, PNG, WebP)
- ✅ Image preview appears after upload
- ✅ Preview shows at 2:3 aspect ratio (book cover dimensions)
- ✅ Success toast notification appears: "Cover uploaded successfully!"
- ✅ Image is saved to `public/images/covers/` with timestamp prefix
- ✅ Database field `temp_cover_twicpics_path` is updated in `books` table
- ✅ TwicPics URL is generated correctly: `https://cenie.twic.pics/editorial/covers/[filename]`

**Validation:**

```sql
-- Check database
SELECT id, temp_cover_twicpics_path FROM books WHERE id = '[book_id]';
-- Should show path like: "editorial/covers/1706645123-book-cover.jpg"
```

**File System Check:**

```bash
ls -la apps/editorial/public/images/covers/
# Should show uploaded file with timestamp prefix
```

---

#### Test 1.2: Drag and Drop Upload

**Steps:**

1. Navigate to Prepare for Publication page
2. Drag an image file from your file system over the upload area
3. Release the file

**Expected Results:**

- ✅ Upload area highlights when file is dragged over (border changes color)
- ✅ Upload proceeds automatically on drop
- ✅ Image preview appears
- ✅ Same validation and success flow as file picker

---

#### Test 1.3: File Type Validation

**Steps:**

1. Navigate to Prepare for Publication page
2. Try uploading each of these file types:
   - ✅ Valid: `.jpg`, `.jpeg`, `.png`, `.webp`
   - ❌ Invalid: `.pdf`, `.doc`, `.txt`, `.gif`

**Expected Results:**

- ✅ Valid image types: Upload succeeds
- ✅ Invalid file types: Error toast appears
  - Message: "Invalid file type. Please upload JPG, PNG, or WebP images."
- ✅ Upload does not proceed
- ✅ Preview does not change

---

#### Test 1.4: File Size Validation

**Steps:**

1. Prepare test images:
   - Small image (< 1MB) ✅
   - Medium image (2-3MB) ✅
   - Large image (> 5MB) ❌
2. Try uploading each

**Expected Results:**

- ✅ Small/Medium: Upload succeeds
- ✅ Large (>5MB): Error toast appears
  - Message: "File size exceeds 5MB. Please upload a smaller image."
- ✅ Upload does not proceed

---

#### Test 1.5: Replace Existing Cover

**Steps:**

1. Upload a cover image (Test 1.1)
2. Click "Replace Image" button
3. Select a different image file

**Expected Results:**

- ✅ New image replaces preview
- ✅ Database updates with new `temp_cover_twicpics_path`
- ✅ Old file may remain in filesystem (acceptable for now)
- ✅ New TwicPics URL is generated

---

#### Test 1.6: Remove Cover Image

**Steps:**

1. Upload a cover image
2. Click the "X" button on the preview

**Expected Results:**

- ✅ Preview is removed
- ✅ Upload area returns to initial state
- ✅ Database field `temp_cover_twicpics_path` is set to `null`
- ✅ Success toast appears (or silent update - check implementation)

---

#### Test 1.7: Cover Persistence After Save Draft

**Steps:**

1. Upload a cover image
2. Click "Save Draft" button
3. Refresh the page
4. Navigate away and return

**Expected Results:**

- ✅ Cover image persists in preview
- ✅ Cover path remains in database
- ✅ Preview loads from `temp_cover_twicpics_path` on page load
- ✅ TwicPics URL displays correctly

---

#### Test 1.8: Cover Display URL Generation

**Steps:**

1. Upload a cover image
2. Check the generated TwicPics URL

**Expected Results:**

- ✅ URL format: `https://cenie.twic.pics/editorial/covers/[filename]?twic=v1/cover=400x600`
- ✅ URL includes:
  - Correct domain: `cenie.twic.pics`
  - Correct path: `editorial/covers/`
  - Transformations: `cover=400x600` (medium size)
  - Aspect ratio preserved: 2:3 ratio

---

### 2. Contributor Photo Upload - Contributors Edit Page

#### Test 2.1: Upload Contributor Photo (Happy Path)

**Note:** The user has reverted this integration, so this test should verify the UI shows properly without upload functionality. If upload is re-implemented, follow these steps:

**Steps:**

1. Navigate to Dashboard → Contributors
2. Click "Edit" on any contributor or navigate to `/dashboard/contributors/[id]`
3. Locate "Contributor Photo" section
4. Upload an image using file picker or drag-and-drop

**Expected Results:**

- ✅ Upload area is visible
- ✅ Circular preview appears after upload
- ✅ Preview shows at 200x200 pixels (square)
- ✅ Success toast: "Photo uploaded successfully!"
- ✅ Image saved to `public/images/contributors/` with timestamp
- ✅ Database fields updated:
  - `photo_twicpics_path`: Path like `editorial/contributors/[filename]`
  - `photo_url`: Generated TwicPics URL
- ✅ Photo persists after saving contributor

**Validation:**

```sql
SELECT id, photo_twicpics_path, photo_url FROM contributors WHERE id = '[contributor_id]';
```

---

#### Test 2.2: Circular Photo Display

**Steps:**

1. Upload a contributor photo
2. Check the preview

**Expected Results:**

- ✅ Preview is displayed in a circular container (`rounded-full` class)
- ✅ Photo is cropped to square (1:1 aspect ratio)
- ✅ TwicPics URL includes face detection: `focus=faces`
- ✅ URL format: `https://cenie.twic.pics/editorial/contributors/[filename]?twic=v1/cover=200x200/focus=faces`

---

#### Test 2.3: Photo Persistence in Contributor Edit

**Steps:**

1. Upload a photo for a contributor
2. Save contributor changes
3. Navigate away and return to edit page

**Expected Results:**

- ✅ Photo appears in preview on return
- ✅ Photo path loaded from database on page mount
- ✅ TwicPics URL generated from `photo_twicpics_path`

---

### 3. Display Components - Catalog & Lists

#### Test 3.1: Contributors List Display

**Steps:**

1. Navigate to Dashboard → Contributors
2. View the contributors table

**Expected Results:**

- ✅ Contributors with `photo_twicpics_path` display TwicPics URL
- ✅ Contributors with only `photo_url` display that URL (backward compatibility)
- ✅ Contributors without photos show placeholder icon
- ✅ Photos display as circular (200x200px)
- ✅ Photos are optimized and load quickly

**Validation:**

- Check browser Network tab for image requests
- URLs should be: `https://cenie.twic.pics/editorial/contributors/[filename]?twic=v1/...`
- Images should load from TwicPics CDN (fast delivery)

---

#### Test 3.2: Contributor Autocomplete Display

**Steps:**

1. Navigate to Prepare for Publication page
2. In Step 2: Assign Contributors
3. Click in "Original Author(s)" or "Translator(s)" search field
4. Type a contributor name
5. View suggestions dropdown

**Expected Results:**

- ✅ Suggested contributors show photos if available
- ✅ Photos use TwicPics URLs when `photo_twicpics_path` exists
- ✅ Fallback to `photo_url` if no TwicPics path
- ✅ Photos display circular in autocomplete
- ✅ Photos are the correct size for the dropdown

---

#### Test 3.3: Selected Contributor Display

**Steps:**

1. In ContributorAutocomplete, select a contributor
2. View the selected contributor card/pill

**Expected Results:**

- ✅ Selected contributor displays photo if available
- ✅ Photo uses correct TwicPics URL
- ✅ Photo appears in circular format
- ✅ Photo size is appropriate for selected badge

---

### 4. Error Handling & Edge Cases

#### Test 4.1: Network Error During Upload

**Steps:**

1. Open browser DevTools → Network tab
2. Set to "Offline" or throttle to "Offline"
3. Try uploading an image

**Expected Results:**

- ✅ Error toast appears: "Failed to upload image" (or specific error message)
- ✅ Preview reverts to previous state (if there was one)
- ✅ Database is not updated
- ✅ User can retry upload

---

#### Test 4.2: Invalid Image File

**Steps:**

1. Create a file with `.jpg` extension but corrupted content
2. Try uploading it

**Expected Results:**

- ✅ Upload may succeed to filesystem, but:
- ✅ Browser preview may fail to display
- ✅ Image should still be usable for TwicPics processing
- ✅ If truly invalid, error should be caught

---

#### Test 4.3: Concurrent Uploads

**Steps:**

1. Quickly upload multiple images in succession
2. Check database state

**Expected Results:**

- ✅ Each upload should queue properly
- ✅ No race conditions
- ✅ All uploads complete successfully
- ✅ Database reflects final state correctly

---

#### Test 4.4: Very Long Filenames

**Steps:**

1. Rename an image file to have a very long name (200+ characters)
2. Upload it

**Expected Results:**

- ✅ Filename is sanitized (special chars replaced with hyphens)
- ✅ Timestamp prefix ensures uniqueness
- ✅ Upload succeeds
- ✅ Display URL works correctly

---

#### Test 4.5: Non-Editor Role Attempt

**Steps:**

1. Log in as a user with "viewer" role only
2. Try to access upload endpoints directly:
   - `POST /api/upload/cover`
   - `POST /api/upload/photo`

**Expected Results:**

- ✅ API returns 403 Forbidden
- ✅ Error message: "This action requires editor role or higher"
- ✅ Upload does not proceed

---

### 5. Integration & Workflow Tests

#### Test 5.1: Complete Publication Workflow with Cover

**Steps:**

1. Select a book for translation
2. Navigate to Prepare for Publication
3. Complete Step 1: Spanish Metadata
4. Complete Step 2: Assign Contributors
5. Complete Step 3: Content & Preview
6. **Complete Step 4:** Upload cover image
7. Fill ISBN, publication year, etc.
8. Click "Publish to Catalog"

**Expected Results:**

- ✅ Cover image is included in preparation
- ✅ Cover path is saved in `temp_cover_twicpics_path`
- ✅ When promoted to catalog, cover should be copied/transferred
- ✅ Publication workflow completes successfully

---

#### Test 5.2: Contributor Creation with Photo

**Steps:**

1. Navigate to Dashboard → Contributors → Add Contributor
2. Fill required fields (name, slug, role)
3. Upload photo (if implemented)
4. Save contributor

**Expected Results:**

- ✅ Photo upload works during creation
- ✅ Photo path saved correctly
- ✅ Photo displays in contributor list immediately
- ✅ Photo available in autocomplete searches

---

#### Test 5.3: Multiple Contributors with Photos

**Steps:**

1. Upload photos for multiple contributors
2. View contributors list
3. View contributor autocomplete with multiple results

**Expected Results:**

- ✅ All photos display correctly
- ✅ Photos load efficiently (TwicPics CDN)
- ✅ No layout shifts or broken images
- ✅ Performance is acceptable (no lag)

---

### 6. TwicPics URL Generation & Transformation

#### Test 6.1: Cover URL Transformations

**Steps:**

1. Upload a book cover
2. Inspect the generated TwicPics URL

**Expected Results:**

- ✅ Base URL: `https://cenie.twic.pics/editorial/covers/[filename]`
- ✅ Transformation: `?twic=v1/cover=400x600`
- ✅ Aspect ratio: 2:3 maintained
- ✅ Quality: Auto-optimized by TwicPics

**Test Different Sizes:**

- Thumbnail (200x300): `cover=200x300`
- Medium (400x600): `cover=400x600`
- Large (800x1200): `cover=800x1200`

---

#### Test 6.2: Contributor Photo URL Transformations

**Steps:**

1. Upload a contributor photo
2. Inspect the generated TwicPics URL

**Expected Results:**

- ✅ Base URL: `https://cenie.twic.pics/editorial/contributors/[filename]`
- ✅ Transformation: `?twic=v1/cover=200x200/focus=faces`
- ✅ Square crop: 1:1 aspect ratio
- ✅ Face detection: `focus=faces` parameter

---

#### Test 6.3: URL Generation for Existing Images

**Steps:**

1. Query database for existing `cover_twicpics_path` or `photo_twicpics_path`
2. Use helper functions to generate URLs:
   - `getBookCoverUrl(path, 'medium')`
   - `getContributorPhotoUrl(path, 200)`

**Expected Results:**

- ✅ Helper functions generate correct URLs
- ✅ URLs include proper transformations
- ✅ URLs can be used directly in `<img src="">` tags

---

### 7. Performance & Optimization

#### Test 7.1: Image Loading Speed

**Steps:**

1. Upload several images
2. View pages that display multiple images
3. Check browser Network tab

**Expected Results:**

- ✅ Images load from TwicPics CDN (fast)
- ✅ Appropriate formats served (WebP for modern browsers)
- ✅ No blocking on image loading
- ✅ Acceptable load times (< 1-2 seconds per image)

---

#### Test 7.2: Large Page with Many Images

**Steps:**

1. Create/upload photos for 20+ contributors
2. Navigate to contributors list page
3. Monitor page performance

**Expected Results:**

- ✅ Page loads reasonably fast
- ✅ Images lazy-load if implemented
- ✅ No memory issues
- ✅ Smooth scrolling

---

### 8. Database & Data Integrity

#### Test 8.1: Database Field Updates

**Steps:**

1. Upload images
2. Check database directly

**Expected Results:**

- ✅ `books.temp_cover_twicpics_path` updated correctly
- ✅ `contributors.photo_twicpics_path` updated correctly
- ✅ `contributors.photo_url` updated correctly
- ✅ Null values handled properly when removing images

**SQL Queries:**

```sql
-- Check books with covers
SELECT id, title, temp_cover_twicpics_path
FROM books
WHERE temp_cover_twicpics_path IS NOT NULL;

-- Check contributors with photos
SELECT id, full_name, photo_twicpics_path, photo_url
FROM contributors
WHERE photo_twicpics_path IS NOT NULL;
```

---

#### Test 8.2: Backward Compatibility

**Steps:**

1. Find contributors with only `photo_url` (legacy data)
2. View contributors list and autocomplete

**Expected Results:**

- ✅ Components gracefully fall back to `photo_url`
- ✅ No errors thrown
- ✅ Photos display correctly
- ✅ Missing `photo_twicpics_path` doesn't break UI

---

### 9. UI/UX Validation

#### Test 9.1: Upload Component Accessibility

**Steps:**

1. Test upload component with keyboard navigation
2. Check screen reader compatibility
3. Test with high contrast mode

**Expected Results:**

- ✅ Keyboard accessible (Tab, Enter)
- ✅ Screen reader announces upload area
- ✅ Clear labels and instructions
- ✅ Error messages are accessible

---

#### Test 9.2: Visual Feedback

**Steps:**

1. Upload images
2. Observe loading states

**Expected Results:**

- ✅ Upload progress indicator visible
- ✅ Preview updates smoothly
- ✅ Success/error toasts appear
- ✅ Hover states work correctly
- ✅ Drag-and-drop visual feedback clear

---

### 10. Security & Permissions

#### Test 10.1: Role-Based Access

**Steps:**

1. Test with different roles:
   - Admin ✅
   - Editor ✅
   - Viewer ❌

**Expected Results:**

- ✅ Admin and Editor can upload
- ✅ Viewer cannot upload (403 error)
- ✅ Error messages are clear
- ✅ UI hides upload components for viewers

---

#### Test 10.2: File Type Restrictions

**Steps:**

1. Try various upload methods with restricted files
2. Check server-side validation

**Expected Results:**

- ✅ Client-side validation prevents bad files
- ✅ Server-side validation as backup
- ✅ Malicious files rejected
- ✅ Error messages informative

---

## Test Checklist

Use this checklist to track testing progress:

### Book Covers

- [ ] Upload cover via file picker
- [ ] Upload cover via drag-and-drop
- [ ] Replace existing cover
- [ ] Remove cover
- [ ] File type validation (valid)
- [ ] File type validation (invalid)
- [ ] File size validation (< 5MB)
- [ ] File size validation (> 5MB)
- [ ] Cover persistence after save
- [ ] TwicPics URL generation correct
- [ ] Display in preview component

### Contributor Photos

- [ ] Upload photo via file picker
- [ ] Upload photo via drag-and-drop
- [ ] Replace existing photo
- [ ] Remove photo
- [ ] Circular display correct
- [ ] Photo persistence after save
- [ ] TwicPics URL generation correct
- [ ] Face detection parameter included

### Display Components

- [ ] Contributors list displays photos
- [ ] Contributor autocomplete shows photos
- [ ] Selected contributor shows photo
- [ ] Fallback to legacy `photo_url` works
- [ ] Missing photos show placeholder

### Error Handling

- [ ] Network errors handled
- [ ] Invalid files rejected
- [ ] Large files rejected
- [ ] Concurrent uploads work
- [ ] Role-based restrictions work

### Integration

- [ ] Complete publication workflow
- [ ] Contributor creation workflow
- [ ] Database integrity maintained
- [ ] Backward compatibility preserved

### Performance

- [ ] Images load quickly
- [ ] No layout shifts
- [ ] Multiple images perform well
- [ ] CDN delivery working

---

## Troubleshooting

### Issue: Images not uploading

**Check:**

1. File size (should be < 5MB)
2. File type (JPG, PNG, WebP only)
3. User role (must be editor+)
4. Network connection
5. Upload directory exists and is writable
6. Browser console for errors

---

### Issue: Images not displaying

**Check:**

1. Database has correct `twicpics_path`
2. TwicPics URL format is correct
3. Image file exists in public folder
4. TwicPics domain is accessible
5. Browser console for 404/403 errors

---

### Issue: Database not updating

**Check:**

1. API endpoint is accessible
2. Authentication cookies are sent
3. Network request succeeds (200 status)
4. Database permissions allow updates
5. Server logs for errors

---

## Success Criteria

All features are working correctly when:

✅ **Uploads work:**

- File picker and drag-and-drop function
- Valid files upload successfully
- Invalid files are rejected with clear errors
- Preview appears immediately

✅ **Storage works:**

- Files saved to correct directories
- Database paths stored correctly
- TwicPics URLs generated properly

✅ **Display works:**

- Images show in all components
- TwicPics URLs load correctly
- Fallbacks work for legacy data
- Performance is acceptable

✅ **Security works:**

- Role-based access enforced
- File validation on client and server
- No unauthorized uploads possible

✅ **Persistence works:**

- Images persist after page refresh
- Database updates correctly
- State management works smoothly

---

## Notes

- TwicPics URLs are generated on-demand (not stored)
- Original files are stored locally in `public/images/`
- TwicPics fetches from source URL: `https://editorial.cenie.org/images/[type]/[filename]`
- Images are transformed on-the-fly by TwicPics CDN
- WebP format is auto-selected for modern browsers
- Quality is optimized automatically by TwicPics

---

## Reporting Issues

When reporting issues, include:

1. **Steps to reproduce**
2. **Expected vs actual behavior**
3. **Browser/OS information**
4. **Console errors (if any)**
5. **Network request details**
6. **Database state**
7. **File system state**

---

**Happy Testing! 🧪**
