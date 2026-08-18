# Design rationale

The site is a personal birthday keepsake for Aanya from Akhil. Its visual language is therefore affectionate, warm, and celebratory rather than corporate or futuristic. The existing palette already expresses that purpose: cream provides a soft paper-like base, wine provides emotional depth and readable body text, rose carries affection and calls to action, and gold represents birthday light and celebration. The 3D treatment keeps white photograph cards with warm gold rims, rose petals, and gold sparkles so the motion remains anchored to the existing identity.

The refined interaction is deliberately tied to the story: scrolling rotates and advances the memory galaxy through the site, mouse movement adds gentle parallax and a gold particle trail, and desktop dragging lets the visitor explore the orbit. Mobile devices receive fewer cards and particles, lower pixel ratio, lighter materials, deferred image loading, and throttled frames so the experience remains cinematic without overwhelming the device.

Browser verification on the fresh production preview at `http://localhost:4174/` confirms the warm baseline page renders with the original routes, countdown, storybook, confetti, PWA prompt, music control, cream/rose/gold/wine theme, and the `3D Memory Galaxy: scroll to orbit` status indicator.


The fresh preview shows the original warm cream/wine/rose/gold theme, gold-framed revolving photographs, rose petals, gold sparkles, countdown, and glass cards. Scrolling moves from the hero into the archive section while the galaxy continues behind the content, and opening the About card preserves the existing content and route behavior with readable contrast.


The final clean preview at `http://localhost:4176/` confirms that the photographs remain visible over the cream birthday background, while the gold frame fill is now translucent enough to avoid overpowering the central message. The status copy reads `3D Memory Galaxy: scroll to orbit`, making the interaction discoverable without changing the established theme.
