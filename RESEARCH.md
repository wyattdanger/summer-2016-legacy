# Classic Legacy MTG - Site Research and Analysis

**URL:** https://classiclegacymtg.com
**Date of Research:** June 26, 2026
**Purpose:** Documentation for building a static website based on this model

---

## Overview

Classic Legacy is an unofficial Magic: The Gathering format created in 2020. It's "a tribute to what we consider to be the golden era of the official Legacy format," with **Rise of the Eldrazi** as the final legal expansion. The format emphasizes casual play and sportsmanship over competitive achievement.

---

## Site Map

```
Homepage (/)
├── Legal Sets (/legal-sets/) [404]
├── Banned Cards (/banned-cards/) [404]
├── Rules (/rules/) [404]
├── Decks (/decks/)
├── Our Vision (/our-vision/)
├── Blog (/blog/)
└── Contact (/contact/)
```

**Note:** Some direct URL paths returned 404 errors, suggesting these may be dynamic pages or use different URL structures than expected. However, content was accessible from the homepage.

---

## Page-by-Page Breakdown

### 1. Homepage (/)

**Primary Sections:**

- **Hero/Introduction**
  - Format overview and description
  - Key selling points of the format

- **Deck Gallery**
  - Carousel/slider featuring inspirational deck examples
  - Card images displayed prominently

- **Rules Section**
  - Tournament standards
  - London Mulligan rules
  - Contemporary Magic rulings reference

- **Legal Sets Section**
  - Comprehensive list from Alpha through Rise of the Eldrazi
  - Approximately 73 sets total

- **Banned Cards Section**
  - 54 banned cards displayed with images
  - Range from Black Lotus to Vengevine
  - Tooltip functionality for card information

- **Community Section**
  - Social media links:
    - Facebook Group
    - Instagram
    - Discord

**Technical Features:**
- Card image carousel/slider
- Tooltip functionality for card information
- Responsive image handling
- Google Analytics integration

---

### 2. Decks Page (/decks/)

**Display Format:**
Each deck listing includes:

- **Visual Elements:**
  - Card artwork thumbnail
  - Deck name
  - Mana symbols indicating color identity (blue, white, green, black, red)

- **Metadata:**
  - Deck type (Control, Aggro, Combo, etc.)
  - Archetype (Zoo, Dredge, Countertop, etc.)
  - Player name (clickable link)
  - Tournament name
  - Date of competition
  - Placement ("X of Y" format)

**Functionality:**
- "Filter decks" interface with options to filter by:
  - Deck type
  - Archetype
  - Color combination
  - Specific card inclusions/exclusions
- "View Deck" links to detailed decklists
- Shows card compositions and quantities

---

### 3. Our Vision Page (/our-vision/)

**Core Philosophy:**

- Prioritizes enjoyment and sportsmanship over competitive achievement
- Created by "old school players" who value recreational spirit
- Emphasis on playing Magic "to have fun, not to be the 'most successful magic player'"

**Code of Conduct:**
- Prohibits unsporting conduct
- Bans verbal rudeness toward opponents
- Forbids rules exploitation for unfair advantages
- Acknowledges competition is inherent but maintains it "should never take place in a Classic Legacy event" in an unsporting manner

---

### 4. Blog (/blog/)

**Content Types:**

1. **Ban List Updates**
   - Official announcements (e.g., "Ban List Update – January 2025")

2. **Strategy Guides**
   - In-depth analyses of deck archetypes (e.g., "In-depth analysis: The Perfect Dredge")

3. **Deck Primers**
   - Detailed strategy explorations (e.g., "Back to the brewery: Survival Zoo")

4. **Tournament Reports**
   - First-person competitive play accounts (e.g., Barcelona tournament reports)

5. **Format Advocacy**
   - Introductory articles (e.g., "Classic Legacy: the format we were waiting for")

**Organization:**
- Chronological display (most recent first)
- Standard WordPress structure
- Individual article pages with descriptive URLs

**Post Metadata:**
- Author bylines with profile images
- Featured images
- Brief excerpt previews

**Notable Authors:**
- Iñaki Puigdollers
- Lluís Cortès
- Other format enthusiasts and competitive players

---

### 5. Contact Page (/contact/)

**Contact Method:**
- Single web form with fields:
  - Name (required)
  - Email (required)
  - Message (required)

**Security:**
- Google reCAPTCHA protection
- Agreement to Google's Privacy Policy and Terms of Service

**Note:** No alternative contact methods listed (no email addresses, phone numbers, or direct social media links on this page)

---

### 6. Legal Sets, Banned Cards, Rules Pages

These pages were referenced in navigation but returned 404 errors when accessed directly. Content appears to be integrated into the homepage in dedicated sections rather than separate pages, or they use different URL structures.

---

## Design and Technical Observations

### Visual Design
- Clean, modern WordPress-based design
- Centered navigation menu
- Image-heavy display (card images throughout)
- Card gallery carousel/slider functionality
- Organized sections with clear visual hierarchy
- Professional but community-oriented aesthetic

### Technical Stack (Observed)
- WordPress CMS
- Contact Form 7 plugin
- Google reCAPTCHA
- Google Analytics integration
- Responsive image handling
- Tooltip functionality (likely JavaScript-based)
- Social media integration

### Color Scheme
- Appears to use MTG-themed colors
- Professional and readable layout
- Card images provide primary visual interest

---

## Key Features to Consider for Emulation

### Essential Features
1. **Card image display** with tooltips
2. **Deck database** with filtering capabilities
3. **Blog/news system** for updates and articles
4. **Rules/format documentation** sections
5. **Community links** (social media integration)
6. **Contact form** functionality

### Nice-to-Have Features
1. **Image carousel/slider** for featured content
2. **Advanced deck filtering** (by color, archetype, cards)
3. **Author profiles** for blog contributors
4. **Tournament result tracking**
5. **Card search/lookup** functionality

### Potential Improvements/Additions
1. **Deck builder tool** (interactive deck creation)
2. **Card database** with search
3. **Event calendar** for tournaments
4. **Forum or discussion board**
5. **Better URL structure** (some pages 404'd)
6. **API integration** with card databases (e.g., Scryfall)

---

## Recommendations for Static Site Implementation

### Good Fit for Static Site
- **Legal Sets page** - Static list
- **Banned Cards page** - Static list with images
- **Rules page** - Static documentation
- **Our Vision page** - Static content
- **Blog** - Static site generator friendly (markdown posts)

### Requires Special Consideration
- **Decks page** - Large dataset, may need:
  - JSON data files
  - Client-side filtering (JavaScript)
  - Or build-time generation of filter pages

- **Contact form** - Needs backend solution:
  - Formspree, Netlify Forms, or similar service
  - Or serverless function

### Suggested Approach with Astro

**Astro** would be excellent for this project because:

1. **Content Collections** - Perfect for:
   - Blog posts
   - Deck lists
   - Card data

2. **Component Islands** - Can add interactivity where needed:
   - Deck filters
   - Card tooltips
   - Image carousels

3. **Static by Default** - Fast loading for content-heavy pages with card images

4. **Markdown Support** - Easy content authoring for blog and documentation

5. **Image Optimization** - Built-in image optimization for card images

6. **Integration Options** - Easy to add:
   - React/Vue/Svelte for interactive components
   - API calls to card databases (Scryfall)
   - Form services for contact page

---

## Next Steps

1. **Decide which features to include/exclude**
   - Core features needed
   - Nice-to-have features
   - Features to skip

2. **Plan site structure**
   - Page hierarchy
   - URL structure
   - Content organization

3. **Set up Astro project**
   - Initialize with appropriate template
   - Configure content collections
   - Set up styling approach

4. **Gather/create content**
   - Legal sets list
   - Banned cards data
   - Rules documentation
   - Initial blog posts (if any)

5. **Design considerations**
   - Color scheme
   - Typography
   - Layout patterns
   - Responsive design approach

---

## Questions to Answer Before Building

1. Do we want deck database functionality? (Complex feature)
2. Will we need card image hosting or use external APIs?
3. Do we need blog functionality from day one?
4. What contact form service should we use?
5. Will we need user accounts or everything public?
6. Do we want to integrate with Scryfall or other card APIs?
7. What's the deployment target? (Netlify, Vercel, GitHub Pages, etc.)
