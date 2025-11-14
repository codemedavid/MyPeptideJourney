# Testimonials Images

## Quick Start

After running the migration `20250111000006_add_testimonials.sql`, add your testimonial images using one of these methods:

### Method 1: Upload via Admin Panel (Recommended)

1. Go to `/admin` and login
2. Click on **Testimonials** in the dashboard
3. For each testimonial:
   - Click **Edit**
   - Upload the image using the **Image Upload** section
   - Click **Save**
   - The image will be stored in Supabase Storage automatically

### Method 2: Use Local Images

Place your customer conversation screenshots in this folder (`public/testimonials/`) with these exact filenames:

1. `dosage-1.jpg` - Dosage Guidance & Effectiveness
   - Conversation about 25 units → 50 units dosage instructions
   - Fast effectiveness and appetite suppression feedback

2. `progress-1.jpg` - Weight Tracking & Progress Update
   - Weight tracking (69.4 kg baseline)
   - Positive changes in appetite and clothing size
   - Ongoing support conversation

3. `delivery-1.jpg` - Product Delivery Confirmation
   - Customer confirms receipt with "my peptide journey" box photo
   - Delivery confirmation conversation

4. `delivery-2.jpg` - Rider Pickup & Delivery Confirmation
   - Delivery rider pickup with product box photo
   - Customer appreciation for service

5. `appetite-1.jpg` - Appetite Suppression & Fast Results
   - Customer reports significant appetite suppression
   - Discussion about hydration and protein intake
   - Fast results conversation

The images will automatically display on the `/testimonials` page once added.

**Note:** If using local images, make sure the filenames match exactly as shown above. The migration already references these paths.

