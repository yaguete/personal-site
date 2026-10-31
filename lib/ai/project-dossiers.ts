import 'server-only'

/**
 * Long-form product dossiers for the Selected Projects cards.
 * Public-facing facts only: no employer names, no internal status, no people.
 * The model answers in the user's language; the source text stays in English.
 */

const WANDERPLANNER_DOSSIER = `## WanderPlanner (wanderplanner.ai)

**What it is:** An independent, free travel-planning product designed and built by Yago (side project, MVP completed in August 2026, live at wanderplanner.ai).

**One-liner:** The trips that inspire you, turned into your itinerary. Paste the URL of a travel blog you love and WanderPlanner converts it into an editable, day-by-day plan — instead of rebuilding everything from scratch.

**The problem it solves:** People find inspiring routes in travel blogs but can't turn them into a concrete plan adapted to their dates and pace. Planning a 10-day trip takes 8–15 hours of fragmented work. The usual alternatives are copying by hand into Notion or spreadsheets, or asking a generic chatbot for an itinerary with no real-world basis.

**"It doesn't make it up — it has read it."** The core promise: every recommendation links back to the original source and can be verified in one click. The plan is grounded in real travelers' experiences and official sources, not generated from thin air. Each place keeps the signature of who recommended it, with their chronicle always visible — and the blog's affiliate links arrive intact, so bloggers keep their commissions.

**How it works:** The user pastes a blog URL → the system extracts the content and converts it into editable cards organized by day. More URLs can be added (multi-source planning). The user deletes, reorders and adds their own cards. Trips can be saved as a guest (no account) or persisted with a free account.

**"The plan of an agency — without the agency":**
- Itinerary organized in views: route, activities, accommodation, transport, essentials — as list, map or calendar.
- Task and cost management for the trip.
- AI assistant with persistent conversations that knows the trip's content and answers with citations: it checks official country sheets for visas, health and safety (e.g. "yes, 90-day e-visa, per the foreign ministry"), and practical questions like weather and what to pack.
- Flight search integration (Skyscanner affiliate).

**Differentiation:** The value is not the AI — it is starting from real blogger content as the source of truth, plus a distribution model where travel blogs themselves are the channel (B2B2C): blogs monetize their content better, travelers get a plan based on a route they already liked.

**Who it's for:** Independent travelers (roughly 25–55) planning trips from a long weekend to three weeks — and travel bloggers who want their content to convert better.

**Stack (for technical questions):** Next.js frontend on Vercel, FastAPI backend on Fly.io, Supabase (Auth + Postgres + RLS), Cloudflare bot protection, Tavily web search, Mapbox.

**Yago's role:** Solo founder — product, design, and most of the engineering.`

const DRAWINGHUB_DOSSIER = `## DrawingHub (drawinghub.build)

**What it is:** The first construction project management platform built natively on AI. It connects the whole project lifecycle — from initial design to construction — centralizing technical documentation, drawings, teams, permit processes and regulatory requirements in a single intelligent environment. Yago leads it on the product and design side, working with a small product team. Live at drawinghub.build.

**One-liner:** From the architecture studio to the reality of the construction site — without friction.

**The problem it solves:** Construction projects consume between 5% and 15% of their budget dealing with the consequences of inefficient information management. For a ~€10M project that means hundreds of thousands of euros in avoidable rework born from documentation errors, drawing versioning mistakes and poor coordination, plus delays and compliance/consulting costs that add no direct value to the building itself.

**What it does — four product pillars:**

1. **AI for Design & visualization.** Turn an idea, a natural-language description or a rough sketch into renders and ready-to-work drawings. It also converts PDF drawings into editable CAD (DXF) using AI — and for projects where precision is critical, users can request review and refinement by specialized human draftsmen, combining AI efficiency with human validation.

2. **Project & Drawing Management.** The platform automatically analyzes every drawing and document added to a project, detecting whether it is a new version of an existing drawing or completely new documentation — keeping versions organized and related, avoiding duplicates, and guaranteeing everyone works on the latest information. Full change history, and a visual comparator that automatically highlights elements added, modified or removed between drawings. Each drawing is also a collaboration space: architects, engineers, builders and contractors share comments, annotations, issues or photos pinned directly to the affected area of a plan.

3. **On-site execution & validation.** Every drawing managed in DrawingHub carries a unique QR code. Scanning it with any phone camera — no app, no registration — verifies in seconds whether the printed drawing on site is still the latest approved version, and opens the updated document immediately. This kills one of the main causes of errors and rework: building from obsolete plans.

4. **Compliance & decision support.** It monitors tender opportunities across Europe and uses construction-specialized AI to analyze tender documents — extracting key requirements, award criteria, risks, deadlines and critical aspects so teams can decide without hours of reading. Archimind, an assistant specialized in architecture and construction, analyzes drawings, technical documentation, project location and regulatory context to surface applicable requirements and restrictions from day one. Permit management capabilities identify the licenses and documentation needed based on each project's location and characteristics.

**Who it's for:** Architecture studios, engineering firms, builders, contractors and site teams — anyone coordinating drawings, versions and compliance across the full life of a construction project.

**Your drawings, now conversational.** Beyond the four pillars, the platform answers questions directly in the context of the drawings: what changed between versions and how it impacts scope, quantities and execution; what is missing, clashing or unclear before it turns into RFIs or rework; first-pass estimates of quantities, materials and effort straight from drawings; and whether a drawing meets the applicable regulatory requirements.

**On-site execution, office-to-site connected:** task creation and lifecycle, checklists and punch lists, site diaries / daily logs, formal progress reports (PDF / Excel), and versioned site photos with historical view — all tied to the same drawings the office works on.

**Pricing:** Core drawing management is free to get started (including the first AI renders). Advanced AI capabilities — creation and intelligence — are optional paid add-ons, around £89–139 per user/month as listed on the site. No storage limits: upload and manage as many drawings as the project requires.

**Data privacy:** Customer data is not used to train AI models without permission, and each project stays fully private.

**Yago's role:** Leads product and design — from the original concept and user research with architecture and construction professionals to the shipped product.`

const SMARTQUOTATION_DOSSIER = `## SmartQuotation (smartquotation.io)

**What it is:** A commercial-management tool for small print shops (PSPs — print service providers, typically ≤10 people, focused on large format). It brings together quotations, a product & client catalogue, an order pipeline and basic business analytics in one place, with AI assistance. Yago leads it on the product and design side with a small team. Live at smartquotation.io.

**One-liner:** From a messy client request to a clear, priced proposal.

**The problem it solves:** In a small print shop, quoting lives in fragile spreadsheets, catalogues, email and WhatsApp threads, and usually depends on one experienced person who knows the prices by heart. There is no single place to see clients, opportunities or order history, so follow-up is lost and quoting is slow and error-prone. The real bottleneck is not the arithmetic of the quote — it is the back-and-forth of understanding what the client wants and translating it into a concrete, priced offer.

**What it does:**
- **Assisted quotation flow** over a catalogue of products and clients, with a Kanban pipeline for orders (review → answer → start → production → done) and quote versioning.
- **Catalogue & history:** import clients and products from past invoices (AI extracts client/product data from the documents), and suggest prices based on that history. The value is not that the AI sets the price — it is that it surfaces the *right previous price* for that kind of job; the shop always keeps the final decision.
- **Client request link:** a shareable link that centralizes incoming requests from clients instead of scattered emails and chats.
- **AI assistant (front-desk):** a chatbot with full business context (products, clients, invoices). A real use case discovered with PSPs: a client calls about an event, and while on the phone the shop asks the assistant for options and a rough price range on the spot.
- **Quote → work order:** an approved quote can be turned into a work order, sent as a PDF or through the platform's inbox.
- **Billing integrations:** connects to the shop's invoicing system (e.g. Holded) so quotes and invoices live side by side.

**Design principle:** "make complexity available, not mandatory." The interface stays simple enough for anyone to quote; the underlying depth (materials, processes, expenses) is there for those who need it, without forcing it on everyone.

**Who it's for:** small print shops and copy shops with a closed, repeatable catalogue — not large commercial printers with custom ERPs already in place. The product focuses on solving standard, simple products well (cards, flyers, banners) rather than replicating a full print-house costing system.

**Positioning:** Free while in validation, with close, hands-on onboarding for the first shops (the team helps structure their catalogue and migrate it in). It is a real, working product with active users, not a mockup.

**Yago's role:** Leads product and design — from the original concept and the pilot research with print shops to the shipped product and its go-to-market.`

export function getProjectDossiers() {
  return [
    '# Selected projects (product dossiers)',
    WANDERPLANNER_DOSSIER,
    DRAWINGHUB_DOSSIER,
    SMARTQUOTATION_DOSSIER,
  ].join('\n\n')
}
