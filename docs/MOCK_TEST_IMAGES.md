# Mock Test Image Support

## Overview

The mock test system now supports images at three levels:
- **Problem Context Images**: Shared diagrams/illustrations for all sub-questions in a problem
- **Question Images**: Specific diagrams/charts for individual questions
- **Option Images**: Visual answer choices (graphs, diagrams, etc.)

## Database Schema

Three new nullable columns have been added:

```sql
-- Problem context images
ALTER TABLE mock_test_problems ADD COLUMN image_url TEXT NULL;

-- Question images
ALTER TABLE mock_test_questions ADD COLUMN image_url TEXT NULL;

-- Option images (for visual answer choices)
ALTER TABLE mock_test_options ADD COLUMN image_url TEXT NULL;
```

## Storage Configuration

- **Bucket**: `mock-test-images` (public)
- **File Size Limit**: 5MB per image
- **Allowed MIME Types**: JPEG, PNG, GIF, WebP, SVG
- **Public URL Format**: `https://[project].supabase.co/storage/v1/object/public/mock-test-images/[path]`

### Storage Organization

Recommended folder structure:
```
mock-test-images/
├── problems/
│   └── problem-123.png
├── questions/
│   └── question-456.jpg
└── options/
    └── option-789.png
```

## Usage

### 1. Upload Images to Supabase Storage

**Via Supabase Dashboard:**
1. Go to Storage → mock-test-images bucket
2. Upload images following the folder structure above
3. Copy the file path (e.g., `problems/problem-123.png`)

**Via Code:**
```typescript
import { uploadMockTestImage } from "@/lib/storage/mock-test-image";

const imageUrl = await uploadMockTestImage(
  file, // File object from input
  "problems/problem-123.png" // Storage path
);
```

### 2. Insert Image URLs into Database

**Example: Problem with context image**
```sql
UPDATE mock_test_problems
SET image_url = 'problems/geometry-diagram.png'
WHERE id = 'problem-uuid';
```

**Example: Question with diagram**
```sql
UPDATE mock_test_questions
SET image_url = 'questions/parabola-graph.png'
WHERE id = 'question-uuid';
```

**Example: Image-based options**
```sql
-- Option A: Graph showing linear function
UPDATE mock_test_options
SET image_url = 'options/graph-linear.png'
WHERE id = 'option-a-uuid';

-- Option B: Graph showing quadratic function
UPDATE mock_test_options
SET image_url = 'options/graph-quadratic.png'
WHERE id = 'option-b-uuid';
```

## Testing Guide

### Sample Test Data with Images

Here's a complete example of a physics problem with images:

```sql
-- 1. Create a problem with context image
INSERT INTO mock_test_problems (id, section_id, problem_number, context, image_url, order_index)
VALUES (
  'prob-physics-1',
  'section-physics-uuid',
  1,
  'Дараах зургийг харна уу. Блок нь налуу хавтгай дээр байрлаж байна.',
  'problems/physics-inclined-plane.png', -- Context diagram
  1
);

-- 2. Add a question to this problem
INSERT INTO mock_test_questions (id, problem_id, question_number, question_text, explanation, points, order_index)
VALUES (
  'q-physics-1a',
  'prob-physics-1',
  'a',
  'Блокийн хурдатгалыг ол.',
  'F = ma ашиглан бодно. a = g sin(θ)',
  10,
  1
);

-- 3. Add text-based options (no images)
INSERT INTO mock_test_options (id, question_id, option_text, is_correct, order_index)
VALUES
  ('opt-1', 'q-physics-1a', 'a = 5 m/s²', true, 1),
  ('opt-2', 'q-physics-1a', 'a = 7 m/s²', false, 2),
  ('opt-3', 'q-physics-1a', 'a = 9.8 m/s²', false, 3),
  ('opt-4', 'q-physics-1a', 'a = 10 m/s²', false, 4);

-- 4. Add another question with image-based options
INSERT INTO mock_test_questions (id, problem_id, question_number, question_text, explanation, points, order_index)
VALUES (
  'q-physics-1b',
  'prob-physics-1',
  'b',
  'Блокийн хурдны график аль нь вэ?',
  'Хурдатгал тогтмол байгаа тул хурд шугаман өсөх ёстой.',
  10,
  2
);

-- 5. Add image-based options (graphs)
INSERT INTO mock_test_options (id, question_id, option_text, image_url, is_correct, order_index)
VALUES
  ('opt-5', 'q-physics-1b', 'График A', 'options/velocity-linear.png', true, 1),
  ('opt-6', 'q-physics-1b', 'График B', 'options/velocity-constant.png', false, 2),
  ('opt-7', 'q-physics-1b', 'График C', 'options/velocity-parabolic.png', false, 3),
  ('opt-8', 'q-physics-1b', 'График D', 'options/velocity-exponential.png', false, 4);
```

### Quick Test Checklist

- [ ] Upload test images to Supabase Storage (`mock-test-images` bucket)
- [ ] Run migrations 062 and 063 to add schema changes
- [ ] Insert test data with `image_url` values pointing to uploaded files
- [ ] Navigate to mock test page and verify images display correctly
- [ ] Test responsive sizing on mobile and desktop
- [ ] Complete a test and verify images appear in detailed results
- [ ] Verify images don't break when `image_url` is NULL (backward compatibility)

## Image Best Practices

### Image Dimensions

- **Problem context images**: 800-1200px wide (diagrams, illustrations)
- **Question images**: 600-800px wide (charts, graphs)
- **Option images**: 300-400px wide (small diagrams, graphs)

### File Size

- Optimize images before uploading (use WebP format for smaller sizes)
- Keep images under 500KB for fast loading
- Use SVG for diagrams when possible (infinitely scalable)

### Accessibility

- Always include descriptive text in `option_text` or `question_text` even when using images
- Images should supplement text, not replace it entirely (except for pure visual tests)
- The system automatically generates alt text from question/option text

## TypeScript Types

The updated types support optional image URLs:

```typescript
export type MockTestProblem = {
  id: string;
  problem_number: number;
  title: string | null;
  context: string | null;
  image_url?: string | null; // NEW: Problem context image
  order_index: number;
  questions: MockTestQuestion[];
};

export type MockTestQuestion = {
  id: string;
  question_number: string;
  question_text: string;
  image_url?: string | null; // NEW: Question image
  explanation: string;
  points: number;
  order_index: number;
  options: MockTestOption[];
};

export type MockTestOption = {
  id: string;
  option_text: string;
  image_url?: string | null; // NEW: Option image
  is_correct?: boolean;
  order_index: number;
};
```

## Backward Compatibility

- All `image_url` fields are **nullable** - existing text-only questions work without modification
- Components conditionally render images only when `image_url` is present
- No breaking changes to existing APIs or data structures

## API Reference

### Storage Helper Functions

```typescript
// Get public URL for an image
import { getMockTestImageUrl } from "@/lib/storage/mock-test-image";
const url = getMockTestImageUrl("problems/diagram.png");

// Upload an image
import { uploadMockTestImage } from "@/lib/storage/mock-test-image";
const publicUrl = await uploadMockTestImage(file, "path/to/image.png");

// Delete an image
import { deleteMockTestImage } from "@/lib/storage/mock-test-image";
const success = await deleteMockTestImage("path/to/image.png");
```

## Troubleshooting

### Images not displaying

1. **Check Next.js image domains**: Verify `next.config.ts` includes Supabase Storage domain
2. **Verify storage path**: Ensure `image_url` uses relative path, not full URL
3. **Check bucket permissions**: Verify RLS policies allow public read access
4. **Browser console**: Check for CORS or 404 errors

### Slow image loading

1. **Optimize images**: Compress images before uploading (use WebP format)
2. **Use appropriate dimensions**: Don't upload unnecessarily large images
3. **Consider CDN**: Supabase Storage includes CDN by default

### Image format errors

1. **Check MIME type**: Only JPEG, PNG, GIF, WebP, SVG allowed
2. **File size**: Must be under 5MB limit
3. **File extension**: Ensure file has correct extension matching its format

## Migration Checklist

To deploy this feature to production:

1. **Apply database migrations**
   ```bash
   # Migrations are in supabase/migrations/
   # 062_add_image_support_to_mock_tests.sql
   # 063_create_mock_test_images_storage.sql
   ```

2. **Verify storage bucket**
   - Bucket `mock-test-images` created
   - RLS policies active
   - Public access enabled

3. **Test image upload/display**
   - Upload test images
   - Verify display in both test player and results
   - Test on mobile and desktop

4. **Update documentation**
   - Inform content creators about image support
   - Provide image dimension guidelines
   - Share storage folder structure

## Future Enhancements

Potential improvements for the image system:

- [ ] Image upload UI in admin panel
- [ ] Automatic image optimization/compression
- [ ] Support for LaTeX math rendering
- [ ] Image zoom/lightbox on click
- [ ] Drag-and-drop image upload
- [ ] Bulk image upload utility
- [ ] Image versioning and management
