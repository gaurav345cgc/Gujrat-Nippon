# CMS Fallback Copy — Content Owner Review (Phase 0)

**Purpose:** Approve seed content before Phase 1 `lib/cms/payloads.ts` is coded.  
**Source:** Extracted from current hardcoded `.tsx` files on 2026-06-05.  
**SEO reference:** [`gnipl-seo-content-rules.md`](./gnipl-seo-content-rules.md) — titles/descriptions marked **SEO doc** where they differ from live `metadata` exports.

**Status:** ✅ Approved — Phase 0 sign-off 2026-06-05  
**SEO seed rule:** Use [`gnipl-seo-content-rules.md`](./gnipl-seo-content-rules.md) titles where they differ from live metadata.  
Phase 1 seeds `lib/cms/payloads.ts` from this file.

---

## Global contact (`site_settings.global_contact`)

Used by Contact page and Footer when CMS is published.

| Field | Current value |
|-------|---------------|
| heading | Contact Info |
| address | 21, Navyug Industrial Estate, M.I.D.C Cross Road, J.B. Nagar, Andheri (East), Mumbai – 400069 |
| phone | +91-22-4099 7000 |
| email | info@gujaratnippon.com |
| workingHours | *(not shown today — leave empty or add)* |
| mapUrl | *(not shown today — leave empty)* |

**Note:** CIN `U51900MH2004PTC149572` appears on Contact page but is not in CMS contact_info schema v1 — stays hardcoded unless schema extended.

---

## 1. Home (`/`)

### `hero` (type: hero)

| Field | Value |
|-------|-------|
| headline | Engineering Design, Supply & Turnkey Solutions |
| subheadline | *(empty — single-line hero today)* |
| body | *(empty)* |
| primaryCtaLabel | *(none on hero today)* |
| primaryCtaHref | — |
| secondaryCtaLabel | — |
| secondaryCtaHref | — |

### `about_teaser` (type: text)

| Field | Value |
|-------|-------|
| heading | About Us |
| body | **Gujarat Nippon International Pvt Ltd** provides engineering solutions and a diversified range of industrial products and services: design, manufacture and supply of plant and machineries for metal processing industries, revamping, retrofitting and modernization of existing lines, industrial spares and components, greases, lubricants and industrial chemicals, and capital equipment sourcing for domestic and export customers.\n\nWe are committed to reliable products and services, timely execution, transparent dealings and long-term business relationships. Our focus remains on technical expertise, quality standards and total customer satisfaction. |

**CTA label (hardcoded in component):** `READ MORE ABOUT THE COMPANY` → `/about`

### `products_teaser_heading` (type: text)

| Field | Value |
|-------|-------|
| heading | Products & Supply |
| body | *(empty — product cards are static, not CMS)* |

### SEO *(seed: SEO rules doc)*

| Field | Value |
|-------|-------|
| seoTitle | Turnkey Plant Engineering & Industrial Supply — Gujarat Nippon International |
| metaDescription | Gujarat Nippon International undertakes turnkey design, manufacture and supply of plant and machineries for metal processing industries across India, Africa and the GCC. |

---

## 2. About Us (`/about`)

### `hero` (type: hero)

| Field | Value |
|-------|-------|
| headline | About Gujarat Nippon |
| subheadline | International Pvt Ltd. |
| body | A globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution. |

### `company_overview` (type: text)

| Field | Value |
|-------|-------|
| heading | About Company |
| body | Established in 2004, Gujarat Nippon International Pvt Ltd is an industrial engineering company Mumbai-based metal processors and export buyers approach for coordinated supply. We undertake design, manufacture and supply of plant and machineries for metal processing industries on a turnkey basis where the contract requires it, and we carry out revamping, retrofitting and modernization of existing lines and equipment in accordance with drawings and quality standards agreed with the customer.\n\nOur scope includes hot and cold rolling mill lines, tube mill lines, slitting and cut-to-length lines, strip galvanising and colour coating lines, deep drawing presses, heat treatment furnaces and related equipment. We maintain strategic alliances with manufacturers for industrial spares, greases, lubricants, industrial chemicals and capital equipment, with emphasis on reliable products and services, timely execution, transparent dealings, competitive pricing where the enquiry permits, total customer satisfaction and after sales support under one roof for domestic and international markets. |

**Static (not CMS):** Stats row (210+, 510+, 18+, 15%), philosophy tabs, goals cards, carousel UI.

### `mission` (type: text)

| Field | Value |
|-------|-------|
| heading | Our Mission |
| body | To provide engineering solutions and diversified industrial products in a well-defined and planned manner: design, manufacture and supply of plant and machineries, revamping and modernization, industrial spares, greases, lubricants and capital equipment, with commitment to quality standards, transparent dealings and after sales support aligned to customer requirements. |

### `vision` (type: text)

| Field | Value |
|-------|-------|
| heading | Our Vision |
| body | To be recognized as a trusted engineering and industrial supply company for metal processing and allied sectors, known for reliable products and services, technical expertise and total customer satisfaction in domestic and international markets. |

### `leadership_intro` (type: text)

| Field | Value |
|-------|-------|
| heading | Our Philosophy |
| body | We undertake each assignment in a well-defined and planned manner, with technical expertise, dependable quality and integrity in export-import transactions. Long-term business relationships and customer requirements remain central to how we coordinate engineering solutions, documentation and dispatch. |

### `cta` (type: cta)

| Field | Value |
|-------|-------|
| heading | Learn more about Gujarat Nippon |
| body | *(optional)* |
| buttonLabel | LEARN MORE |
| buttonHref | /contact |

### SEO *(seed: SEO rules doc)*

| Field | Value |
|-------|-------|
| seoTitle | About Us — 18+ Years in Industrial Engineering \| Gujarat Nippon International |
| metaDescription | Established in 2004, Gujarat Nippon International is a Mumbai-based engineering and industrial supply company with 18+ years of execution across 510+ projects worldwide. |

---

## 3. Products / Services (`/products`)

### `hero` (type: hero → PageHero)

| Field | Value |
|-------|-------|
| subheadline | Explore Our Solutions |
| headline | Industrial Machinery, Spares & Equipment Supply |
| body | Turnkey plant engineering, industrial spares, greases and lubricants, capital equipment and plastic moulding systems supplied with documented specifications and export-ready dispatch where required. |

**Static:** Product card **images** (fixed by card position). Titles and descriptions: CMS `product_card_1`…`product_card_6`.

### SEO

| Field | Value |
|-------|-------|
| seoTitle | Industrial Machinery & Equipment — Gujarat Nippon International |
| metaDescription | Gujarat Nippon International offers turnkey plant machineries, industrial spares, chemicals, capital equipment and plastic moulding systems for industrial processing requirements. |

---

## 4. Industries Served (`/industries`)

### `hero` (type: hero → PageHero)

| Field | Value |
|-------|-------|
| subheadline | Industries & services |
| headline | Industries We Serve |
| body | Industries served metal processing India and allied sectors: turnkey plant and machineries, spares, greases, lubricants, chemicals and capital equipment from our Mumbai office. |

### `intro` (type: text)

| Field | Value |
|-------|-------|
| heading | *(none)* |
| body | Gujarat Nippon International Pvt Ltd supplies engineering solutions and industrial products to the sectors below. For our products and engineering solutions or to send us your project requirement, contact our Mumbai office. |

**Static:** Industry cards array + detail pages `/industries/[slug]`.

### `cards_intro` (type: text)

| Field | Value |
|-------|-------|
| heading | *(optional)* |
| body | Select an industry to view solutions and supply scope. |

### SEO

| Field | Value |
|-------|-------|
| seoTitle | Industries Served — Metal, Plastics, Energy \| Gujarat Nippon |
| metaDescription | We cater to steel and metal processing, automotive, plastics, chemicals, energy and global logistics industries with reliable engineering solutions and sourced capital equipment. |

---

## 5. Certifications (`/certifications`)

**Layout:** Stub today — Phase 3 upgrades to PageHero layout before CMS wire.

### `hero` (type: hero)

| Field | Value |
|-------|-------|
| headline | Our Certifications |
| subheadline | Quality & Compliance |
| body | Committed to the highest global standards. |

### `intro` (type: text)

| Field | Value |
|-------|-------|
| heading | Quality Management |
| body | Gujarat Nippon International maintains documented quality and compliance practices aligned to customer and regulatory requirements for industrial supply and project execution. |

### `compliance_body` (type: text)

| Field | Value |
|-------|-------|
| heading | Certifications |
| body | **ISO 27001** — Information Security Management\n\n**ISO 9001** — Quality Management Systems |

### SEO

| Field | Value |
|-------|-------|
| seoTitle | Certifications & Quality Compliance — Gujarat Nippon International |
| metaDescription | View Gujarat Nippon International quality and compliance certifications including ISO 9001 and ISO 27001 for industrial engineering and supply operations. |

*(Live page has minimal metadata — expand per SEO rules)*

---

## 6. Careers (`/careers`) — NEW PAGE

**Decision:** Mailto CTA only (no application form in v1).

### `hero` (type: hero)

| Field | Value |
|-------|-------|
| subheadline | Careers at Gujarat Nippon |
| headline | Build With Us |
| body | Gujarat Nippon International Pvt Ltd employs engineering, commercial and operations professionals who support turnkey projects, industrial supply and export-import execution from our Mumbai office. |

### `intro` (type: text)

| Field | Value |
|-------|-------|
| heading | Working at GNIPL |
| body | We value technical discipline, transparent communication and dependable execution. Roles span project coordination, technical sales, procurement, logistics and shop-floor support aligned to metal processing and industrial supply assignments. |

### `culture` (type: text)

| Field | Value |
|-------|-------|
| heading | What we look for |
| body | Relevant industry experience, attention to documentation and quality standards, and the ability to work with domestic and international customers in a professional B2B environment. |

### `cta` (type: cta)

| Field | Value |
|-------|-------|
| heading | Send your profile |
| body | Email your CV with role preference and brief experience summary. |
| buttonLabel | Email careers@gujaratnippon.com |
| buttonHref | mailto:careers@gujaratnippon.com |

### SEO

| Field | Value |
|-------|-------|
| seoTitle | Careers — Industrial Engineering & Supply \| Gujarat Nippon International |
| metaDescription | Explore careers at Gujarat Nippon International in Mumbai — engineering, project coordination and industrial supply roles supporting metal processing and export customers. |

---

## 7. Contact Us (`/contact`)

### `page_header` (type: text)

| Field | Value |
|-------|-------|
| heading | Contact Us |
| body | Turnkey project enquiry Mumbai teams submit through this page is routed to our engineering and supply desk at the Navyug Industrial Estate office. Please include scope, drawings or bill of material where available, quantities, required dates and destination so that we may respond with lead times, clarifications and next steps for industrial machinery, spares, chemicals or capital equipment requirements. |

### `contact_info` (type: contact_info)

See **Global contact** section above. Add on page:

| Field | Value |
|-------|-------|
| heading | Gujarat Nippon International Pvt. Ltd. |

### `form_intro` (type: text)

| Field | Value |
|-------|-------|
| heading | Enquiry form |
| body | Submit your requirement below. Fields marked required must be completed for us to respond. |

**Static:** `ContactForm` component (unchanged).

### SEO *(seed: SEO rules doc)*

| Field | Value |
|-------|-------|
| seoTitle | Contact Us — Mumbai MIDC Office \| Gujarat Nippon International |
| metaDescription | Contact Gujarat Nippon International at our Mumbai MIDC office for turnkey project enquiries, industrial machinery requirements and export-import consultations. |

---

## 8. Privacy Policy (`/privacy`)

### `hero` (type: text)

| Field | Value |
|-------|-------|
| heading | Privacy Policy |
| body | Last Updated: February 22, 2026 |

### `intro` (type: text)

| Field | Value |
|-------|-------|
| heading | Overview |
| body | This policy describes how Gujarat Nippon International Pvt Ltd collects and uses information when you visit our website or submit an enquiry. |

### `body_1` (type: text)

| heading | 1. Information We Collect |
| body | We collect information to provide better services to our global customers. |

### `body_2` (type: text)

| heading | 2. How We Use Information |
| body | Your information is stored securely and used in accordance with GDPR principles. |

### SEO

| Field | Value |
|-------|-------|
| seoTitle | Privacy Policy — Gujarat Nippon International |
| metaDescription | Read how Gujarat Nippon International collects, uses and protects personal information submitted through our website and contact forms. |

---

## 9. Terms & Conditions (`/terms`)

### `hero` (type: text)

| heading | Terms of Service |
| body | Last Updated: February 22, 2026 |

### `intro` (type: text)

| heading | Overview |
| body | These terms govern use of the Gujarat Nippon International website. |

### `body_1` | heading: 1. Acceptance of Terms | body: By accessing our website, you agree to be bound by these terms.

### `body_2` | heading: 2. Use License | body: Permission is granted to temporarily download one copy of the materials.

### SEO

| seoTitle | Terms & Conditions — Gujarat Nippon International |
| metaDescription | Terms and conditions for use of the Gujarat Nippon International website and online materials. |

---

## 10. Cookie Policy (`/cookies`)

### `hero` (type: text)

| heading | Cookie Policy |
| body | How we use cookies and similar technologies. |

### `intro` (type: text)

| heading | Overview |
| body | This policy explains cookies used on gujaratnippon.com. |

### `body_1` | heading: What Are Cookies? | body: Cookies are small text files that are placed on your machine to help the site provide a better customer experience.

### `body_2` | heading: Managing Cookies | body: You may prefer to disable cookies on this site and on others.

### SEO

| seoTitle | Cookie Policy — Gujarat Nippon International |
| metaDescription | Learn how Gujarat Nippon International uses cookies and how you can manage cookie preferences on our website. |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Content owner | Approved (project sign-off) | 2026-06-05 | ✅ Approved |
| Developer | Extracted + locked SEO rules | 2026-06-05 | ✅ Complete |
| Stakeholder (10-page list) | Approved (contractual scope) | 2026-06-05 | ✅ Approved |

**10 pages locked:** home, about, products, industries, certifications, careers, contact, privacy, terms, cookies.

Phase 1 seeds `lib/cms/payloads.ts` from this document.
