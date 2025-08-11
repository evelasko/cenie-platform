# CENIE Web Presence Strategy: The Hybrid Hub-and-Spoke Model

This document provides a comprehensive and detailed overview of the recommended digital strategy for distributing the Centre for Research and Innovation in Performing Arts (CENIE)'s content and services across its web properties. The objective is to create a scalable, coherent, and effective online presence that strengthens the main CENIE brand while providing focused, high-performance platforms for its diverse initiatives.

---

## 1. Strategic Overview & Core Philosophy

The fundamental challenge for CENIE's digital presence is to effectively represent a multi-faceted organization that includes academic publishing, SaaS products, consulting services, and educational programs. A single, monolithic website would struggle to serve the unique functional needs and user expectations of each of these areas. Conversely, completely separate websites would fragment the brand, dilute SEO authority, and fail to communicate the powerful, integrated ecosystem that makes CENIE unique.

The recommended solution is a **Hybrid Hub-and-Spoke Model**.

* **The Hub (`cenie.org`)**: A central, authoritative website that serves as the primary brand anchor and discovery engine for all of CENIE's activities. It tells the holistic story and funnels users towards specialized offerings.
* **The Spokes (Subdomains)**: A series of dedicated web properties, hosted on subdomains (e.g., `product.cenie.org`), that provide specialized, function-rich experiences for specific products or services like SaaS applications or publishing platforms.

This model balances a unified brand identity with the specialized functional requirements of each initiative, creating clear user journeys and maximizing both brand cohesion and operational effectiveness.

---

## 2. The Hub: `cenie.org` — The Center of Gravity

The main `cenie.org` website is the core of CENIE's digital identity. Its primary purpose is not to *be* everything, but to be the definitive *entry point* to everything.

### Purpose

* **Central Brand Identity**: To establish and communicate the overarching mission, vision, and values of CENIE.
* **Primary Discovery Engine**: To introduce all of CENIE's initiatives and services to a broad audience, explaining their value proposition within the context of the larger ecosystem.
* **SEO Authority**: To act as the primary domain for search engine optimization, building authority that benefits the entire ecosystem through strategic linking.
* **Holistic Storytelling**: To articulate how CENIE's various components work together to solve critical challenges in the performing arts industry, based on the user-centric outcomes defined in `web/final-sitemap.md` (Elevate Skills, Innovate Art, Optimize Process).

### Content & Structure

The main website will host all content related to the core CENIE brand and its less functionally complex initiatives. This includes:

* The primary, user-outcome-focused navigation: `/skills`, `/innovate`, `/optimize`, `/insights`, `/about`, and `/connect`.
* High-level marketing and landing pages for **every** CENIE initiative, including the Editorial, all software products, and the agency. These pages will act as compelling "front porches" that introduce the value proposition and funnel interested users to the more specialized "spoke" sites where appropriate.
* All content that defines the CENIE mission, community, and thought leadership (e.g., About Us, Partnerships, News, Blog, Research Insights).
* Full content for initiatives that are services or core functions of CENIE, not standalone products (e.g., Automation Agency, Creative Development Hub).

---

## 3. The Spokes: Dedicated Subdomains for Specialized Applications

The Spokes are focused, purpose-built web applications that live on subdomains. They prioritize function and user experience for specific, complex tasks.

### Purpose

* **Focused User Experience (UX)**: To provide a clean, distraction-free environment for users engaged in a specific task (e.g., using a software application, searching a publication database, taking an online course).
* **Specialized Functional Requirements**: To accommodate unique features that do not belong on a general marketing website, such as user authentication, dashboards, database search interfaces, e-commerce, or Learning Management System (LMS) functionalities.
* **Independent Technology Stacks**: To allow each Spoke to be built on the technology best suited for its purpose, without constraining or being constrained by the technology of the main website.

### Branding & Integration

To prevent brand fragmentation, all Spokes must be cohesively integrated with the Hub:

* **Consistent Branding**: Each Spoke must be clearly branded as "A CENIE Initiative" with consistent visual elements (logos, fonts, color palette).
* **Mandatory Cross-Linking**: Every Spoke must feature a clear, persistent link back to the main `cenie.org` hub in its header or footer, allowing users to easily navigate the full ecosystem.
* **Shared Design Language**: While layouts will differ based on function, the overall design aesthetic should feel part of the same family.

---

## 4. Initiative-Specific Implementation Plan

### a. CENIE Editorial (Academic Publishing)

* **Web Property**: **`editorial.cenie.org`** or **`publishing.cenie.org`**
* **Rationale**:
  * **Specialized Functionality**: An academic press requires a complex, database-driven platform for manuscript submission, peer-review management, author portals, and a searchable archive of publications. Integrating this into a marketing-focused CMS would be inefficient and limiting.
  * **Distinct Audience**: The target audience (academics, researchers) has specific expectations for a scholarly press website that differ from the general audience of the main site.
* **Integration Strategy**: The `/insights` section of `cenie.org` will serve as the marketing funnel. It will feature articles, showcase featured publications, and explain the editorial's mission. All calls-to-action (e.g., "Search Archives," "Submit Your Manuscript") will direct users to the `editorial.cenie.org` subdomain.

### b. Software Suite (qAderno, Stoomp, Platea)

* **Web Property**: A separate subdomain for each product: **`qaderno.cenie.org`**, **`stoomp.cenie.org`**, and **`platea.cenie.org`**.
* **Rationale**:
  * **SaaS Product Identity**: These are standalone Software-as-a-Service (SaaS) products. They require their own distinct product marketing sites, including dedicated pages for features, pricing, and sign-up/login. The application itself is a distinct entity from the marketing site.
  * **Focused User Environment**: A user logged into the `qAderno` app needs a focused, functional interface for production management, free from the global navigation of the main CENIE site.
  * **Scalability**: This allows each product to develop its own comprehensive documentation, support portal, and community forum as it grows.
* **Integration Strategy**: The `/optimize` and `/innovate` sections of `cenie.org` will host compelling landing pages for each tool. For example, a page on `/optimize/production-collaboration` will describe the challenges of production management and introduce `qAderno` as the solution, with strong calls-to-action linking to `qaderno.cenie.org` for a demo, trial, or subscription.

### c. Automation Agency

* **Web Property**: Fully integrated into the main **`cenie.org`** website.
* **Rationale**:
  * **Core Service Offering**: Unlike a SaaS product, the agency is a direct service provided by CENIE itself. Its value and credibility are intrinsically tied to the parent brand.
  * **Synergistic Content**: The services offered (e.g., AI automation, workflow consulting) are already perfectly aligned with the content categories of the main site (`/optimize`, `/innovate`). Separating them would create artificial divisions and a fractured user journey.
* **Integration Strategy**: The agency's offerings will be presented as solutions within the relevant sections of `cenie.org`. Case studies, service descriptions, and contact forms will be built directly into the main website's pages.

### d. Specialized Academy & Training Hub

* **Web Property**: A hybrid model.
    1. **Marketing & Catalog on `cenie.org`**: The main site's `/skills` section will serve as the "course catalog." It will host all marketing pages, course descriptions, instructor biographies, and enrollment/payment funnels.
    2. **LMS on `learn.cenie.org`**: The actual learning environment—where authenticated users watch videos, download materials, and participate in forums—should be hosted on a dedicated Learning Management System (LMS) on a subdomain.
* **Rationale**: This approach leverages the main site's SEO and marketing power to attract students, while providing a focused, optimized, and secure environment for the educational experience itself.
* **Integration Strategy**: Users will discover and enroll in courses on `cenie.org`. Upon successful enrollment, they will be directed to `learn.cenie.org` to log in and access their course content.

### e. Creative Development Hub & Content Distribution Network

* **Web Property**: Fully integrated into the main **`cenie.org`** website.
* **Rationale**: These initiatives are core, non-commercial functions of the CENIE mission, not standalone products.
  * The **Creative Hub**'s activities, residencies, and research are central to the "Innovate Your Art" value proposition and are key content for the main site.
  * The **Content Distribution Network** describes an outbound strategy (publishing to YouTube, social media, etc.). The `cenie.org` site will act as the central aggregator for this content, featuring it in blogs, news sections, and resource libraries, and linking out to the respective external platforms.

---

## 5. Summary: The CENIE Digital Ecosystem

| Web Property                  | Purpose                                        | Key Content / Functionality                                            |
| ----------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| **`cenie.org` (The Hub)**     | Central Brand, Discovery, SEO, Storytelling    | Main Site, Marketing for all initiatives, About, Insights, Blog, Agency Services, Course Catalog |
| **`editorial.cenie.org`**     | Academic Publishing Platform                   | Publication Database, Submission/Review Portals, Author Dashboards     |
| **`stoomp.cenie.org`**        | SaaS Product Site & Application                | Marketing, Pricing, Docs, Support, Login for Stoomp App                |
| **`qaderno.cenie.org`**       | SaaS Product Site & Application                | Marketing, Pricing, Docs, Support, Login for qAderno App               |
| **`platea.cenie.org`**        | SaaS Product Site & Application                | Marketing, Pricing, Docs, Support, Login for Platea App                |
| **`learn.cenie.org`**         | Learning Management System (LMS)               | Student Dashboard, Course Materials, Video Lectures, Community Forums  |

---

## 6. Core Strategic Principles

* **Unified Brand, Specialized Experience**: Maintain a strong, consistent brand across all properties while delivering purpose-built, high-performance user experiences on the Spokes.
* **Scalability and Flexibility**: This model allows each component of CENIE to grow independently without requiring a complete overhaul of the entire web presence.
* **SEO Synergy**: The Hub (`cenie.org`) concentrates SEO authority and strategically passes it to the Spokes through curated, high-value links, boosting the visibility of the entire ecosystem.
* **Clear User Journeys**: Users are guided from broad discovery on the Hub to focused action on the Spokes, reducing confusion and increasing conversion rates.
* **Technological Independence**: Frees the development of specialized applications from the constraints of the main website's marketing-oriented technology, and vice-versa.
