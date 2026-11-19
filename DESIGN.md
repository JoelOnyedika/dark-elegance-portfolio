# Design notes

**Concept (anchor: RAG / vector search).** The site is an embedding space. Scrolling is a query: the camera flies through a cloud of points, each chapter "retrieves" its cluster (points contract, light up, nearest neighbours connect), and the projects are 3D nodes you arrive at one by one.

- **Signature:** the scroll-driven flight through the cloud (`src/components/Scene.tsx`). One driver value, `s`, drives camera, cluster weights and node highlights.
- **Motion verb:** snap into place (short, decisive eases; underline draws; fill floods).
- **Palette:** ground `#0a0b0e`, ink `#ebe8e1`, muted `#8d9199`, line `rgba(235,232,225,.14)`, accent `#ff6b35` (used only for retrieved/active things), curtain `#050607`.
- **Type:** Geist (display and text), Geist Mono (retrieval metadata, labels).
- **Idle state:** points drift, nodes rotate, cloud turns slowly.
- **Reduced motion / no WebGL:** no smooth scroll, no GL, content fully visible, project list stacked.
- **Pages:** home, a case page per project, a 404. Route changes use a curtain.
- **Placeholders to replace:** the "Life simulation game" copy, and a second in-progress project once named.
