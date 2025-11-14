-- Insert testimonials from customer conversations
-- Note: Update image_url paths after uploading the actual images

INSERT INTO testimonials (title, description, image_url, display_order, active) VALUES
(
  'Dosage Guidance & Effectiveness',
  'Customer receives personalized dosage instructions (25 units, then up to 50 units if needed) and reports fast effectiveness with appetite suppression.',
  '/testimonials/dosage-1.jpg',
  1,
  true
),
(
  'Weight Tracking & Progress Update',
  'Customer shares their weight tracking journey (69.4 kg baseline) and discusses positive changes in appetite and clothing size, with ongoing support and encouragement.',
  '/testimonials/progress-1.jpg',
  2,
  true
),
(
  'Product Delivery Confirmation',
  'Customer confirms receipt of product delivery with photo of the "my peptide journey" box, showing reliable delivery service.',
  '/testimonials/delivery-1.jpg',
  3,
  true
),
(
  'Rider Pickup & Delivery Confirmation',
  'Delivery rider confirms pickup with photo of product box, and customer confirms receipt with appreciation for the service.',
  '/testimonials/delivery-2.jpg',
  4,
  true
),
(
  'Appetite Suppression & Fast Results',
  'Customer reports significant appetite suppression and fast effectiveness, noting they used to have a big appetite but now have no desire to eat. Discussion about proper hydration and protein intake.',
  '/testimonials/appetite-1.jpg',
  5,
  true
);

