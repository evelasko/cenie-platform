# Add Contributor Feature - Documentation

## Overview

The Book Detail page now allows users to quickly add book authors as contributors to the database with a single click, using a confirmation modal for a seamless user experience.

## Feature Components

### 1. Modal Component (`src/components/ui/Modal.tsx`)
A reusable modal component for the Editorial app with:
- Backdrop click and ESC key to close
- Prevents body scroll when open
- Customizable sizes (sm, md, lg)
- Header, content, and footer sections
- Accessible with ARIA attributes
- Matches Editorial app design system

### 2. Add Contributor Modal (`src/components/dashboard/AddContributorModal.tsx`)
A specialized modal for adding contributors with:
- Displays author name and role (Author)
- Shows confirmation details
- Cancel and Add Contributor buttons
- Loading state during creation
- Error handling with inline error display
- Auto-generates slug from author name
- Success callback to refresh UI

### 3. Book Detail Page Updates (`src/app/dashboard/books/[id]/page.tsx`)

#### New State Management
```typescript
// Map of author name -> contributor data (id, slug)
const [existingContributors, setExistingContributors] = useState<
  Map<string, { id: string; slug: string }>
>(new Map())
const [showAddContributorModal, setShowAddContributorModal] = useState(false)
const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)
```

#### New Functions

**`checkExistingContributors()`**
- Checks each author against the contributors database
- Uses the `/api/contributors/search` endpoint
- Performs exact name matching (case-insensitive)
- Stores contributor data (id, slug) in a Map for link creation
- Updates the `existingContributors` Map with author name as key

**`handleAddContributor(authorName)`**
- Opens the confirmation modal
- Sets the selected author

**`handleContributorAdded()`**
- Shows success toast
- Refreshes the existing contributors check

## User Experience Flow

### For New Authors (Not in Database)
1. **Author Display**: Author name is displayed as plain text
2. **Plus Button**: A small circular plus button appears next to their name
3. **Click Action**: User clicks the plus button
4. **Confirmation Modal**: A modal opens asking for confirmation with:
   - Author's name
   - Role: Author
   - Cancel and Add Contributor buttons
5. **Creation**: When confirmed:
   - A POST request is sent to `/api/contributors`
   - Slug is auto-generated from the name
   - Success toast appears
   - Author name becomes a clickable link

### For Existing Contributors (Already in Database)
1. **Author Display**: Author name is displayed as a **clickable link** in primary color with underline
2. **Click Action**: Link navigates to `/dashboard/contributors/[id]`
3. **No Plus Button**: Since the author is already registered, no add button is shown

## UI Design

### Author Name Display

**For Registered Contributors (Linked)**
- Primary color text
- Underlined with subtle decoration (30% opacity)
- Hover state: brighter underline (60% opacity)
- Clickable link to contributor detail page
- Smooth transition effects

**For Unregistered Authors (Plain Text)**
- Regular foreground color text
- No underline
- Not clickable

### Plus Button Styling
- Small circular button (16x16px)
- Primary color with 10% opacity background
- Hover state: 20% opacity
- Positioned inline with author name
- Only appears for unregistered authors
- Accessible with proper `aria-label` and `title`

### Modal Styling
- Matches Editorial app design (rounded-none borders)
- Uses app typography system
- Backdrop blur effect
- Fade-in animation
- ESC key and backdrop click to close

## API Integration

### Endpoint Used
- **POST** `/api/contributors`
  - Creates new contributor
  - Requires: `full_name`, `slug`, `primary_role`
  - Returns 409 if contributor already exists
  - Returns 201 on success

- **GET** `/api/contributors/search?q={name}&role=author&limit=1`
  - Searches for existing contributors
  - Used to check if author already exists

### Slug Generation
Automatic slug generation from author name:
```typescript
const slug = authorName
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
  .replace(/[^a-z0-9\s-]/g, '')    // Remove special characters
  .trim()
  .replace(/\s+/g, '-')             // Replace spaces with hyphens
  .replace(/-+/g, '-')              // Replace multiple hyphens
```

## Error Handling

- **Network Errors**: Displayed in modal with error message
- **Duplicate Contributors**: Modal shows "contributor already exists" error
- **API Errors**: Error message shown inline in modal
- **Loading States**: Button shows "Adding..." with spinner during creation

## Example Use Cases

### Scenario 1: New Author
- Book has author "Konstantin Stanislavski"
- Author not in contributors database
- Name shown as plain text with plus button
- Click plus → Modal → Confirm → Author added
- Plus button disappears
- **Name becomes clickable link** to contributor page

### Scenario 2: Existing Author
- Book has author "Peter Brook"
- Author already exists as contributor
- **Name displayed as clickable link** (primary color, underlined)
- No plus button appears
- Click name → Navigate to contributor detail page

### Scenario 3: Multiple Authors
- Book has 3 authors: "Stanislavski" (new), "Brook" (exists), "Chekhov" (new)
- "Brook" shown as clickable link
- "Stanislavski" and "Chekhov" shown with plus buttons
- Click "Brook" → Go to contributor page
- Click plus buttons → Add new contributors
- After adding: All three names become clickable links

## Accessibility

- **Keyboard Navigation**: Modal closable with ESC key
- **ARIA Labels**: Proper labels on all interactive elements
- **Focus Management**: Body scroll prevented when modal open
- **Screen Readers**: Semantic HTML with proper roles

## Future Enhancements

Potential improvements:
1. Bulk add all authors with one click
2. Edit contributor details during creation
3. Link contributor profile page from author name
4. Show contributor count badge
5. Suggest existing similar names before creating

## Related Files

- `/apps/editorial/src/components/ui/Modal.tsx` - Reusable modal component
- `/apps/editorial/src/components/dashboard/AddContributorModal.tsx` - Contributor-specific modal
- `/apps/editorial/src/app/dashboard/books/[id]/page.tsx` - Book detail page
- `/apps/editorial/src/app/api/contributors/route.ts` - Contributors API
- `/apps/editorial/src/app/api/contributors/search/route.ts` - Search API

## Testing Checklist

- [ ] Plus button appears for non-existing authors
- [ ] Plus button hidden for existing authors
- [ ] Modal opens when plus button clicked
- [ ] Modal shows correct author name
- [ ] Cancel button closes modal
- [ ] Add button creates contributor
- [ ] Success toast appears after creation
- [ ] Plus button disappears after successful creation
- [ ] Error handling works for duplicate contributors
- [ ] ESC key closes modal
- [ ] Backdrop click closes modal
- [ ] Multiple authors handled correctly
- [ ] Slug generation works for various name formats

