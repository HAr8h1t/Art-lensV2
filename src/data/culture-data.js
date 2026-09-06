export const verificationStates = {
  unverified: "Unverified",
  community_submitted: "Community Submitted",
  source_backed: "Source Backed",
  verified: "Verified",
  institution_verified: "Institution Verified"
};

const IMG = {
  rogan: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Rogan_painting.jpg/960px-Rogan_painting.jpg",
    alt: "Rogan painting being practiced in Nirona village, Kutch",
    credit: "Rick Bradley / Wikimedia Commons",
    license: "CC BY 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Rogan_painting.jpg",
    caption: "Photograph of Rogan painting in Nirona, Kutch. Not a portrait of an ART-LENS demo profile."
  },
  embroidery: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Kutchi_Embroidery.png/960px-Kutchi_Embroidery.png",
    alt: "Kutchi embroidery photographed in Kutch, Gujarat",
    credit: "Michel Cecil / Wikimedia Commons",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kutchi_Embroidery.png",
    caption: "Kutchi embroidery photographed in Kutch, Gujarat."
  },
  ajrak: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Ajrak.jpg/960px-Ajrak.jpg",
    alt: "Ajrak block-printed textile",
    credit: "Ahub1988 / Wikimedia Commons",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ajrak.jpg",
    caption: "Ajrak photographed as a Sindh block-printed textile. Used only to illustrate the shared Ajrakh/Ajrak tradition, not as a verified Kutch-specific artwork."
  },
  rann: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/White_Rann_of_Kutch.jpg/1280px-White_Rann_of_Kutch.jpg",
    alt: "White Rann of Kutch salt marsh landscape",
    credit: "Rahul Zota / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:White_Rann_of_Kutch.jpg",
    caption: "White Rann of Kutch landscape."
  },
  indiaMap: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Political_map_of_India.svg/800px-Political_map_of_India.svg.png",
    alt: "Political map of India showing states",
    credit: "Saravask / Wikimedia Commons",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Political_map_of_India.svg",
    caption: "Locator map only. Pins are not geographic coordinates."
  },
  demoProfile: {
    url: "assets/placeholders/demo-profile.svg",
    alt: "Demo profile — no photograph",
    credit: "ART-LENS placeholder",
    license: "Internal placeholder",
    sourceUrl: "",
    caption: "No verified photograph. This is a demonstration profile."
  },
  none: {
    url: "assets/placeholders/no-verified-image.svg",
    alt: "No verified image yet",
    credit: "ART-LENS placeholder",
    license: "Internal placeholder",
    sourceUrl: "",
    caption: "No trustworthy photograph is attached to this record yet."
  }
};

export const mediaLibrary = IMG;

export const data = {
  states: [
    { id: "state-gujarat", name: "Gujarat", status: "active", summary: "Complete demo data available for Kutch." },
    { id: "state-rajasthan", name: "Rajasthan", status: "soon", summary: "ART-LENS is coming soon to this region." },
    { id: "state-maharashtra", name: "Maharashtra", status: "soon", summary: "ART-LENS is coming soon to this region." },
    { id: "state-tamil-nadu", name: "Tamil Nadu", status: "soon", summary: "ART-LENS is coming soon to this region." },
    { id: "state-west-bengal", name: "West Bengal", status: "soon", summary: "ART-LENS is coming soon to this region." },
    { id: "state-assam", name: "Assam", status: "soon", summary: "ART-LENS is coming soon to this region." }
  ],
  regions: [
    {
      id: "region-kutch",
      stateId: "state-gujarat",
      state: "Gujarat",
      name: "Kutch",
      city: "Bhuj",
      summary: "A western Gujarat region where villages, desert landscapes, craft clusters, and festivals form a dense cultural ecosystem.",
      image: IMG.rann.url,
      imageAlt: IMG.rann.alt,
      imageCredit: IMG.rann.credit,
      imageLicense: IMG.rann.license,
      imageSourceUrl: IMG.rann.sourceUrl,
      imageCaption: IMG.rann.caption,
      latitude: 23.7337,
      longitude: 69.8597,
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
      image: IMG.rogan.url,
      imageAlt: IMG.rogan.alt,
      imageCredit: IMG.rogan.credit,
      imageLicense: IMG.rogan.license,
      imageSourceUrl: IMG.rogan.sourceUrl,
      imageCaption: IMG.rogan.caption,
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
      image: IMG.embroidery.url,
      imageAlt: IMG.embroidery.alt,
      imageCredit: IMG.embroidery.credit,
      imageLicense: IMG.embroidery.license,
      imageSourceUrl: IMG.embroidery.sourceUrl,
      imageCaption: IMG.embroidery.caption,
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
      significance: "Included as a structured placeholder needing stronger source review before verification is raised. The photograph illustrates Ajrak from Sindh, not a verified Kutch workshop.",
      practice: "Artisans apply mordants, resists, dyes, and hand-carved blocks through multiple stages.",
      image: IMG.ajrak.url,
      imageAlt: IMG.ajrak.alt,
      imageCredit: IMG.ajrak.credit,
      imageLicense: IMG.ajrak.license,
      imageSourceUrl: IMG.ajrak.sourceUrl,
      imageCaption: IMG.ajrak.caption,
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
      image: IMG.demoProfile.url,
      imageAlt: IMG.demoProfile.alt,
      imageCredit: IMG.demoProfile.credit,
      imageLicense: IMG.demoProfile.license,
      imageCaption: IMG.demoProfile.caption,
      contact: "Demo contact request form",
      yearsPractice: "Demonstration profile",
      verification: "community_submitted",
      isDemo: true,
      sourceIds: ["src-gujarat-nirona"]
    },
    {
      id: "creator-embroidery-demo",
      name: "Demo Creator: Kutch Textile Collective",
      regionId: "region-kutch",
      traditionIds: ["trad-kutch-embroidery"],
      role: "Demo artisan collective",
      bio: "A sample creator profile for testing textile relationships and dashboard workflows. This is not a real collective.",
      story: "This demo account shows how collectives could publish cultural context, media, events, and support options.",
      image: IMG.demoProfile.url,
      imageAlt: IMG.demoProfile.alt,
      imageCredit: IMG.demoProfile.credit,
      imageLicense: IMG.demoProfile.license,
      imageCaption: IMG.demoProfile.caption,
      contact: "Demo workshop inquiry",
      yearsPractice: "Demonstration profile",
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
      description: "A demo artwork record showing how an object can link to its maker, tradition, cultural story, source trail, and optional support path. No verified photograph of this sample object is attached.",
      materials: ["Cloth", "oil-based pigment paste", "metal stylus"],
      image: IMG.none.url,
      imageAlt: IMG.none.alt,
      imageCredit: IMG.none.credit,
      imageCaption: IMG.none.caption,
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
      description: "A demo record for connecting textile work, creator, tradition, media, and saved explorer items. No verified photograph of this sample object is attached.",
      materials: ["Textile", "thread", "mirror embellishment"],
      image: IMG.none.url,
      imageAlt: IMG.none.alt,
      imageCredit: IMG.none.credit,
      imageCaption: IMG.none.caption,
      verification: "unverified",
      isDemo: true,
      sourceIds: []
    }
  ],
  products: [
    {
      id: "product-rogan-panel-demo",
      title: "Demo Support Work: Rogan Cloth Panel",
      creatorId: "creator-khatri-demo",
      artworkId: "work-tree-life-demo",
      traditionIds: ["trad-rogan"],
      regionId: "region-kutch",
      price: "Demo inquiry only",
      availability: "Available for support inquiry",
      description: "A demo supportable-work record. It is not a live listing and has no sales analytics.",
      image: IMG.none.url,
      imageAlt: IMG.none.alt,
      imageCredit: IMG.none.credit,
      imageCaption: IMG.none.caption,
      verification: "community_submitted",
      isDemo: true,
      sourceIds: ["src-gujarat-nirona"]
    }
  ],
  sites: [
    {
      id: "site-nirona",
      name: "Nirona Village",
      type: "Craft village",
      regionId: "region-kutch",
      stateId: "state-gujarat",
      relatedTraditionIds: ["trad-rogan"],
      latitude: 23.5221,
      longitude: 69.6266,
      coordinates: { lat: 23.5221, lng: 69.6266 },
      description: "A Kutch village connected in this prototype to Rogan painting. Coordinates are carried for a future geographic map and are not independently surveyed in this dataset.",
      image: IMG.none.url,
      imageAlt: "No verified photograph of Nirona village in this dataset",
      imageCredit: IMG.none.credit,
      imageCaption: IMG.none.caption,
      verification: "source_backed",
      sourceIds: ["src-gujarat-nirona"]
    },
    {
      id: "site-white-rann",
      name: "White Rann / Dhordo",
      type: "Cultural landscape and festival site",
      regionId: "region-kutch",
      stateId: "state-gujarat",
      relatedTraditionIds: [],
      latitude: 23.8368,
      longitude: 69.6694,
      coordinates: { lat: 23.8368, lng: 69.6694 },
      description: "A festival and cultural landscape associated with Rann Utsav programming. It is not the home of Ajrakh, Rogan, or Kutch embroidery workshops.",
      image: IMG.rann.url,
      imageAlt: IMG.rann.alt,
      imageCredit: IMG.rann.credit,
      imageLicense: IMG.rann.license,
      imageSourceUrl: IMG.rann.sourceUrl,
      imageCaption: IMG.rann.caption,
      verification: "source_backed",
      sourceIds: ["src-gujarat-rann", "src-kachchh-festivals"]
    }
  ],
  mapMarkers: [
    {
      id: "marker-nirona-rogan",
      label: "Nirona Rogan Cluster",
      kind: "craft",
      state: "Gujarat",
      stateId: "state-gujarat",
      regionId: "region-kutch",
      siteId: "site-nirona",
      traditionId: "trad-rogan",
      creatorId: "creator-khatri-demo",
      workshopId: "workshop-rogan-demo"
    },
    {
      id: "marker-white-rann-event",
      label: "White Rann / Dhordo",
      kind: "event",
      state: "Gujarat",
      stateId: "state-gujarat",
      regionId: "region-kutch",
      siteId: "site-white-rann",
      eventId: "event-rann-utsav-demo"
    }
  ],
  events: [
    {
      id: "event-rann-utsav-demo",
      title: "Rann Utsav Cultural Evenings",
      type: "Festival",
      image: IMG.rann.url,
      imageAlt: IMG.rann.alt,
      imageCredit: IMG.rann.credit,
      imageLicense: IMG.rann.license,
      imageSourceUrl: IMG.rann.sourceUrl,
      imageCaption: IMG.rann.caption,
      date: "Seasonal festival programming",
      time: "See official source",
      location: "White Rann / Dhordo, Kutch",
      organizer: "See Gujarat Tourism / Rann Utsav sources",
      regionId: "region-kutch",
      siteId: "site-white-rann",
      traditionIds: [],
      creatorIds: [],
      description: "Festival discovery record for the White Rann landscape. Individual craft traditions are not listed here until a sourced programme link exists.",
      registration: "See official event source before planning travel. ART-LENS does not take bookings.",
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
      siteId: "site-nirona",
      location: "Nirona Village, Kutch",
      date: "To be scheduled by creator",
      description: "A creator-led experience placeholder showing how workshops connect to tradition pages and creator profiles. Not an open booking.",
      image: IMG.none.url,
      imageAlt: IMG.none.alt,
      imageCredit: IMG.none.credit,
      imageCaption: IMG.none.caption,
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
