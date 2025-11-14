# How to Add Testimonial Images

## Option 1: Upload via Admin Dashboard (Recommended)

1. **Apply the migration first:**
   - Go to Supabase Dashboard → SQL Editor
   - Run the migration: `20250111000006_add_testimonials.sql`
   - This creates the testimonial entries in the database

2. **Upload images via Admin Panel:**
   - Go to `/admin` and login
   - Navigate to **Testimonials** section
   - For each testimonial:
     - Click **Edit** on the testimonial
     - Use the **Image Upload** section to upload the screenshot
     - The image will be stored in Supabase Storage automatically
     - Click **Save**

## Option 2: Add Local Images

If you prefer to use local images in the `public/testimonials/` folder:

1. **Save your screenshot images** with these exact filenames:
   - `dosage-1.jpg` - Dosage guidance conversation
   - `progress-1.jpg` - Weight tracking conversation
   - `delivery-1.jpg` - Product delivery confirmation
   - `delivery-2.jpg` - Rider pickup confirmation
   - `appetite-1.jpg` - Appetite suppression conversation

2. **Place them in:** `public/testimonials/` folder

3. **The migration already references these paths**, so they will work automatically!

## Image Descriptions (for reference)

### 1. dosage-1.jpg
- **Content:** Conversation about dosage instructions (25 units, then 50 units if needed)
- **Key points:** Fast effectiveness, appetite suppression feedback

### 2. progress-1.jpg
- **Content:** Weight tracking update (69.4 kg baseline)
- **Key points:** Positive changes in appetite and clothing size, ongoing support

### 3. delivery-1.jpg
- **Content:** Customer confirms receipt with photo of "my peptide journey" box
- **Key points:** Reliable delivery service confirmation

### 4. delivery-2.jpg
- **Content:** Delivery rider pickup confirmation with product box photo
- **Key points:** Customer appreciation for service

### 5. appetite-1.jpg
- **Content:** Customer reports significant appetite suppression
- **Key points:** Fast results, discussion about hydration and protein intake

---

**Note:** After adding images via Admin Panel, the image URLs will be automatically updated in the database. If using local images, make sure the filenames match exactly as shown above.

