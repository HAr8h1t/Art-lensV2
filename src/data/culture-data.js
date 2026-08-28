export const verificationStates = {
  unverified: "Unverified",
  community_submitted: "Community Submitted",
  source_backed: "Source Backed",
  verified: "Verified",
  institution_verified: "Institution Verified"
};

export const data = {
  regions: [
    {
      id: "region-kutch",
      state: "Gujarat",
      name: "Kutch",
      city: "Bhuj",
      summary: "A western Gujarat region where villages, desert landscapes, craft clusters, and festivals form a dense cultural ecosystem.",
      image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/White%20Rann%20of%20Kutch.jpg",
      coordinates: { lat: 23.7337, lng: 69.8597 },
      verification: "source_backed",
      sourceIds: ["src-kachchh-festivals", "src-gujarat-rann"]
    }
  ],
  traditions: [
    {
      id: "trad-rogan",
      name: "Rogan Painting",
      regionId: "region-kutch",
      origin: "Nirona village, Kutch",
      category: "Textile painting",
      intro: "A rare cloth painting practice associated with Nirona, using an oil-based paste and fine metal stylus work.",
      significance: "The craft is strongly associated with the Khatri family of Nirona and is presented here as a source-backed demo record.",
      practice: "Pigment paste is prepared from heated oil and colour, then guided on cloth using a metal rod to create detailed symmetrical motifs.",
      image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kutchi%20Embroidery.png",
      verification: "source_backed",
      isDemo: true,
      sourceIds: ["src-gujarat-nirona", "src-incredible-kutch-crafts"],
      relatedTraditionIds: ["trad-kutch-embroidery", "trad-ajrak"]
    },
    {
      id: "trad-kutch-embroidery",
      name: "Kutch Embroidery",
      regionId: "region-kutch",
      origin: "Kutch district, Gujarat",
      category: "Needlework and textile ornamentation",
      intro: "A family of embroidery practices associated with Kutch communities, mirror work, colour, and regional identity.",
      significance: "Included to show how ART-LENS can connect a broader tradition to practitioners, works, and sites.",
      practice: "Embroidery is practiced through community-specific stitches, mirror placement, motifs, and textile uses.",
      image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kutchi%20Embroidery.png",
      verification: "community_submitted",
      isDemo: true,
      sourceIds: ["src-incredible-kutch-crafts"],
      relatedTraditionIds: ["trad-rogan", "trad-ajrak"]
    },
    {
      id: "trad-ajrak",
      name: "Ajrakh Block Printing",
      regionId: "region-kutch",
      origin: "Kutch and Sindh cultural region",
      category: "Resist block printing",
      intro: "A textile printing tradition associated with repeated block impressions, resist processes, and deep natural colour palettes.",
      significance: "Included as a structured placeholder needing stronger source review before verification is raised.",
      practice: "Artisans apply mordants, resists, dyes, and hand-carved blocks through multiple stages.",
      image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kutchi%20Embroidery.png",
      verification: "community_submitted",
      isDemo: true,
      sourceIds: ["src-incredible-kutch-crafts"],
      relatedTraditionIds: ["trad-rogan", "trad-kutch-embroidery"]
    }
  ],
  creators: [
    {
      id: "creator-khatri-demo",
      name: "Demo Creator: Nirona Rogan Practitioner",
      regionId: "region-kutch",
      traditionIds: ["trad-rogan"],
      role: "Cultural practitioner",
      bio: "A demo profile representing a Rogan painting practitioner workflow. This is not a real onboarded creator account.",
      story: "The profile demonstrates how ART-LENS would preserve a creator's practice, works, workshops, events, sources, and contact path without reducing the person to a seller.",
      image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kutchi%20Embroidery.png",
      contact: "Demo contact request form",
      verification: "community_submitted",
      isDemo: true,
      sourceIds: ["src-gujarat-nirona"]
    },
    {
      id: "creator-embroidery-demo",
      name: "Demo Creator: Kutch Textile Collective",
      regionId: "region-kutch",
      traditionIds: ["trad-kutch-embroidery", "trad-ajrak"],
      role: "Demo artisan collective",
      bio: "A sample creator profile for testing multi-tradition relationships and dashboard workflows.",
      story: "This demo account shows how collectives could publish cultural context, media, events, and support options.",
      image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kutchi%20Embroidery.png",
      contact: "Demo workshop inquiry",
      verification: "unverified",
      isDemo: true,
      sourceIds: []
    }
  ],
  artworks: [
    {
      id: "work-tree-life-demo",
      title: "Demo Work: Tree of Life Cloth Panel",
      creatorId: "creator-khatri-demo",
      traditionIds: ["trad-rogan"],
      regionId: "region-kutch",
      description: "A demo artwork record showing how an object can link to its maker, tradition, cultural story, source trail, and optional support path.",
      materials: ["Cloth", "oil-based pigment paste", "metal stylus"],
      verification: "community_submitted",
      isDemo: true,
      sourceIds: ["src-gujarat-nirona"]
    },
    {
      id: "work-embroidered-panel-demo",
      title: "Demo Work: Embroidered Textile Panel",
      creatorId: "creator-embroidery-demo",
      traditionIds: ["trad-kutch-embroidery"],
      regionId: "region-kutch",
      description: "A demo record for connecting textile work, creator, tradition, media, and saved explorer items.",
      materials: ["Textile", "thread", "mirror embellishment"],
      verification: "unverified",
      isDemo: true,
      sourceIds: []
    }
  ],
  sites: [
    {
      id: "site-nirona",
      name: "Nirona Village",
      type: "Craft village",
      regionId: "region-kutch",
      relatedTraditionIds: ["trad-rogan"],
      coordinates: { lat: 23.5221, lng: 69.6266 },
      description: "A Kutch village connected in this prototype to Rogan painting and creator-led experiences.",
      verification: "source_backed",
      sourceIds: ["src-gujarat-nirona"]
    },
    {
      id: "site-white-rann",
      name: "White Rann / Dhordo",
      type: "Cultural landscape and festival site",
      regionId: "region-kutch",
      relatedTraditionIds: ["trad-kutch-embroidery", "trad-ajrak", "trad-rogan"],
      coordinates: { lat: 23.8368, lng: 69.6694 },
      description: "A festival and cultural experience location associated with Rann Utsav programming.",
      verification: "source_backed",
      sourceIds: ["src-gujarat-rann", "src-kachchh-festivals"]
    }
  ],
  events: [
    {
      id: "event-rann-utsav-demo",
      title: "Rann Utsav Cultural Evenings",
      type: "Festival",
      date: "2026-11-05",
      time: "Evening programming",
      location: "White Rann / Dhordo, Kutch",
      regionId: "region-kutch",
      traditionIds: ["trad-rogan", "trad-kutch-embroidery", "trad-ajrak"],
      creatorIds: ["creator-khatri-demo", "creator-embroidery-demo"],
      description: "Festival discovery record connected to Kutch traditions, sites, and demo creators.",
      registration: "See official event source before planning travel.",
      verification: "source_backed",
      isDemo: true,
      sourceIds: ["src-gujarat-rann", "src-rann-utsav-official"]
    }
  ],
  workshops: [
    {
      id: "workshop-rogan-demo",
      title: "Demo Workshop: Rogan Painting Introduction",
      creatorId: "creator-khatri-demo",
      traditionIds: ["trad-rogan"],
      regionId: "region-kutch",
      location: "Nirona Village, Kutch",
      date: "To be scheduled by creator",
      description: "A creator-led experience placeholder showing how workshops connect to tradition pages and creator profiles.",
      verification: "community_submitted",
      isDemo: true,
      sourceIds: []
    }
  ],
  sources: [
    {
      id: "src-gujarat-nirona",
      title: "Gujarat Tourism: Nirona / Rogan Painting",
      publisher: "Gujarat Tourism",
      url: "https://gujarattourism.com/kutch-zone/kutch/nirona.html",
      sourceType: "official tourism page"
    },
    {
      id: "src-gujarat-rann",
      title: "Gujarat Tourism: Rann Utsav",
      publisher: "Gujarat Tourism",
      url: "https://gujarattourism.com/fair-and-festival/rann-utsav.html",
      sourceType: "official tourism page"
    },
    {
      id: "src-kachchh-festivals",
      title: "District Kachchh: Fairs and Festivals",
      publisher: "Government of Gujarat",
      url: "https://kachchh.nic.in/fairs-festivals/",
      sourceType: "district information page"
    },
    {
      id: "src-incredible-kutch-crafts",
      title: "Incredible India: Crafts of Kutch",
      publisher: "Incredible India",
      url: "https://www.incredibleindia.gov.in/en/gujarat/kutch/crafts-of-kutch-rogan-art",
      sourceType: "public cultural tourism page"
    },
    {
      id: "src-rann-utsav-official",
      title: "Rann Utsav official booking information",
      publisher: "Rann Utsav",
      url: "https://www.rannutsav.com/",
      sourceType: "event information page"
    }
  ]
};
