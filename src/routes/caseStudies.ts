export type Triad = { challenge: string; insight: string; strategy: string }

export type Media = { image: string; alt: string; caption?: string }

export type CraftSection = {
  kicker: string
  title: string
  body: string[]
  pullQuote?: string
  media?: Media[]
}

export type Artefact = {
  label: string
  note?: string
  field: 1 | 2 | 3 | 4
  image?: string
  images?: string[] // a stack of small images inside one tile
  href?: string
  pending?: 'video'
}

export type Stat = {
  value: number
  decimals?: number
  format?: 'plain' | 'comma'
  prefix?: string
  suffix?: string
  label: string
  sub?: string
}

export type CaseStudy = {
  slug: string
  title: string
  meta: string
  year: string
  field: 1 | 2 | 3 | 4
  disciplines: string[]
  audio?: { src: string; label: string }
  brief: {
    role: string
    strategyLine: { text: string; emphasis: string }
    triad?: Triad
    portrait?: Media
  }
  craft: CraftSection[]
  artefacts: { title: string; items: Artefact[] }
  results: { intro: string; stats: Stat[]; note?: string; media?: Media[] }
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  unopenedletter: {
    slug: 'unopenedletter',
    title: 'Unopened Letter',
    meta: 'Brand Campaign',
    year: '2025',
    field: 1,
    disciplines: ['Creative Strategy', 'Copywriting', 'Campaign'],
    audio: { src: '/works/unopenedletter/track.mp3', label: 'Unopened Letter, Nicholas Jimenez' },
    brief: {
      role:
        "Nicholas Jimenez is an American concert pianist, composer, and educator based in Austin. As former roommates, we collaborated on a campaign for his new piece, Unopened Letter. I built the creative strategy and wrote the copy, anchoring the whole campaign to one feeling: the universal ache of longing.",
      strategyLine: {
        text: 'A new piano sound for those days that feel like memories.',
        emphasis: 'memories',
      },
      portrait: {
        image: '/works/unopenedletter/nicholas-jimenez.webp',
        alt: 'Nicholas Jimenez seated at a grand piano',
        caption: 'Nicholas Jimenez',
      },
      triad: {
        challenge:
          'In a streaming feed flooded with millions of instrumental tracks, contemporary piano slips into background noise.',
        insight:
          'Listeners return to a song when it holds one of their own memories, not when it simply sounds nice.',
        strategy:
          'Attach a single feeling, longing, to the track, and let listeners hang their own memories on it.',
      },
    },
    craft: [
      {
        kicker: 'Visual direction',
        title: 'The album cover',
        body: [
          "Nick's original cover was an impressionistic painting of a letter resting on a piano. It caught the nostalgia, but it was not memorable.",
          'We rebuilt the art around a sharper, more ownable image so the track had a face a listener could recall a week later.',
        ],
        media: [
          {
            image: '/works/unopenedletter/cover-original.webp',
            alt: 'Original impressionistic album cover, a painted letter on a piano',
            caption: 'Before, the original concept',
          },
          {
            image: '/works/unopenedletter/cover-rework.webp',
            alt: 'Reworked cover, a sealed envelope framed in a CD case',
            caption: 'After, the rework',
          },
        ],
      },
      {
        kicker: 'Copywriting and testing',
        title: 'Finding the hook',
        body: [
          "We A/B tested 'A New Piano Sound' against 'The Definitive Soundtrack.'",
          "'A New Piano Sound' won on performance. It frames the track as a cinematic score for the listener's inner life, an invitation to tie a memory to it and keep coming back.",
        ],
        pullQuote: 'A new piano sound for those days that feel like memories.',
      },
      {
        kicker: 'Video campaign',
        title: 'A story preserved in time',
        body: [
          'The video campaign built a visual parallel to the memories the music evokes: the bittersweet pull toward moments that have already passed.',
          'We cut four versions, two final selections and two alternates, to test how far to lean into the ache.',
        ],
        media: [
          {
            image: '/works/unopenedletter/envelope-ref.webp',
            alt: 'A cream envelope with a red wax seal in dappled light',
          },
        ],
      },
    ],
    artefacts: {
      title: 'The deliverables',
      items: [
        {
          label: 'Album cover',
          note: 'Rework',
          field: 1,
          image: '/works/unopenedletter/cover-rework.webp',
        },
        { label: 'Ad copy set', note: 'A/B tested', field: 1 },
        { label: 'Final cut 1', field: 1, pending: 'video' },
        { label: 'Final cut 2', field: 1, pending: 'video' },
        { label: 'Alternate cut 1', field: 1, pending: 'video' },
        { label: 'Alternate cut 2', field: 1, pending: 'video' },
      ],
    },
    results: {
      intro:
        'Early playlist adds compounded into exponential reach between March and August 2026.',
      stats: [
        { value: 23260, format: 'comma', label: 'Single streams', sub: 'Unopened Letter' },
        { value: 179691, format: 'comma', label: 'Playlist reach', sub: 'Active audience' },
        { value: 23, label: 'Active playlists', sub: 'Verified nodes' },
      ],
      note:
        'Spotify surfaced the track in Discover Weekly and Release Radar; playlists went from 6 to 21 in two weeks. Data verified by Songstats.',
    },
  },

  americanartistproject: {
    slug: 'americanartistproject',
    title: 'American Artist Project',
    meta: 'Creative Strategy',
    year: '2024',
    field: 2,
    disciplines: ['Creative Strategy', 'Copywriting', 'Event Marketing'],
    brief: {
      role:
        "American Artist Project is a nonprofit that invests in under-resourced artists and helps underrepresented communities see their stories on stage. Alongside one teammate, I helped build AAP's marketing department from the ground up, handling promotional concepting and writing every piece of copy.",
      strategyLine: {
        text: 'Share the spotlight: name partners and creators as contributors, not an audience.',
        emphasis: 'contributors',
      },
      triad: {
        challenge:
          "Raise awareness and attendance for Amplify Austin with no paid media, against nonprofits several times AAP's size.",
        insight:
          "Partners and micro-influencers back an event far harder when they are recognised as contributors to it, not an audience for it.",
        strategy:
          'Research values-aligned organisations and creators, then write each a tailored invitation to become part of the event.',
      },
    },
    craft: [
      {
        kicker: 'Act I',
        title: 'Dance Party Activation',
        body: [
          'Planned and promoted a donor dance party during Amplify Austin to drive votes for AAP.',
          'Secured a venue partnership with Rain on 4th, ran drink-ticket incentives, and drove attendance and on-site donations through influencer outreach.',
        ],
      },
      {
        kicker: 'Act II',
        title: 'Amplify Austin Campaign',
        body: [
          "Amplify Austin is a 24-hour, community-wide giving day that has raised $139M for the area since 2007. It is a crowded, competitive field.",
          "I researched organisations and micro-influencers aligned with AAP's mission and wrote each a tailored invitation. Several partners shared the event on their Instagram Stories.",
        ],
        pullQuote: 'Recognition drives participation.',
      },
      {
        kicker: 'Acts III and IV',
        title: 'Donor guide and 24-hour impact report',
        body: [
          'I independently researched, wrote, and designed a donor travel guide for a curated Broadway Brunch weekend in Portland, Maine.',
          'When leadership needed an impact report immediately after a donor meeting, I researched, structured, and produced it in a 24-hour turnaround with no prior experience making one.',
        ],
        media: [
          {
            image: '/works/aap/travel-guide-01.webp',
            alt: 'Cover page of the Portland, Maine donor travel guide',
            caption: 'Donor travel guide',
          },
          {
            image: '/works/aap/impact-report-01.webp',
            alt: 'Cover of the American Artist Project impact report',
            caption: '24-hour impact report',
          },
        ],
      },
    ],
    artefacts: {
      title: 'The deliverables',
      items: [
        {
          label: 'Influencers reached out to',
          note: '3 posts',
          field: 2,
          // TODO(kenneth): confirm the order once the images are labelled
          images: [
            '/works/aap/influencer-secret-aap.webp',
            '/works/aap/influencer-reggaeton.webp',
            '/works/aap/partner-rainbow.webp',
          ],
        },
        {
          label: 'Donor Travel Guide',
          note: '12 pages, PDF',
          field: 2,
          image: '/works/aap/travel-guide-02.webp',
          href: '/works/aap/travel-guide.pdf',
        },
        {
          label: '24hr Impact Report',
          note: 'PDF',
          field: 2,
          image: '/works/aap/impact-report-02.webp',
          href: '/works/aap/impact-report.pdf',
        },
      ],
    },
    results: {
      intro: 'Amplify Austin, 2024 to 2025.',
      stats: [
        {
          value: 130326,
          format: 'comma',
          prefix: '$',
          label: 'Raised on Amplify Austin',
          sub: '2025, from 220 donors',
        },
        { value: 6, prefix: '#', label: 'Citywide leaderboard', sub: 'Up from #48 the year before' },
        { value: 1, suffix: 'st', label: 'Medium-size nonprofit category', sub: '2025' },
      ],
      note: 'Partners and micro-influencers amplified the campaign across their own channels.',
      media: [
        {
          image: '/works/aap/leaderboard-2024.webp',
          alt: 'Amplify Austin leaderboard, 2024',
          caption: '2024',
        },
        {
          image: '/works/aap/leaderboard-2025.webp',
          alt: 'Amplify Austin leaderboard, 2025, with American Artist Project at sixth',
          caption: '2025',
        },
      ],
    },
  },

  redcross: {
    slug: 'redcross',
    title: '#SignTheAlarm',
    meta: 'Campaign Work',
    year: '2024',
    field: 3,
    disciplines: ['Concept Development', 'Copywriting', 'Creative Strategy', 'Research'],
    brief: {
      role:
        'The American Red Cross gives away bed-shaker fire alarms for the Deaf and Hard of Hearing community, but awareness was low and safety messaging was not landing. I authored the creative brief and wrote the script for an animated PSA that reframed fire safety as an act of protecting family.',
      strategyLine: {
        text: 'Reframe the free alarm as a way to protect the people you love, not a handout.',
        emphasis: 'not a handout',
      },
      triad: {
        challenge:
          'Bed shakers were free, but awareness in the DHH community was low and traditional safety messaging failed to resonate.',
        insight:
          'Many DHH individuals do not identify as disabled and resist outreach that feels like charity. This community values independence.',
        strategy:
          'Speak to independence. Frame the alarm as protecting your family, not receiving assistance.',
      },
    },
    craft: [
      {
        kicker: 'Strategic foundation',
        title: 'The stakes behind the strategy',
        body: [
          'A modern furnished room can become unsurvivable in about four minutes, down from thirty with older furnishings. The standard 3,100 Hz alarm sits in the exact frequency range most degraded by hearing loss, and the sense of smell shuts off entirely during deep sleep.',
          "Specialised bed-shaker units were just 1.1% of the alarms the Red Cross installed in a recent program year. The barrier was not availability. It was tone, stigma, and trust.",
        ],
        pullQuote: 'A modern house fire can become unsurvivable in about four minutes.',
      },
      {
        kicker: 'Thirty-second social spot',
        title: 'Animation series',
        body: [
          'Traditional safety PSAs risk being dismissed the moment they imply vulnerability. Each animation instead centres on a loved one, a dog, a grandmother, a sister, intervening during a house fire.',
          'The narrative shows the real risk of relying on sound and smell while others are put in danger trying to wake you. Shifting the weight from self-preservation to protecting others creates urgency without condescension.',
        ],
        pullQuote: 'Your dog waits for you. What are you waiting for?',
      },
      {
        kicker: 'Print call-to-action',
        title: 'Business cards',
        body: [
          'The card series leans deliberately into urgency: in a fire, a DHH individual may only get one warning, and seconds matter.',
          'Blunt, minimal, time-sensitive copy paired with QR codes linking straight to the free bed-shaker request tool. Not charity. Prevention.',
        ],
      },
    ],
    artefacts: {
      title: 'The deliverables',
      items: [
        { label: 'Creative brief', field: 3 },
        { label: 'Animated PSA script', note: 'Dog, Granny, Bedshaker', field: 3 },
        { label: 'Business card series', note: '4 back variations', field: 3 },
        { label: 'Storyboards', note: '11 frames', field: 3 },
        { label: 'Social captions', field: 3 },
        { label: 'Free bedshaker infographic', note: '4 steps', field: 3 },
      ],
    },
    results: {
      intro: 'The numbers the strategy had to move against.',
      stats: [
        { value: 60, suffix: '%', label: 'Lower fire death rate', sub: 'Homes with a working alarm, NFPA' },
        { value: 4, suffix: ' min', label: 'To unsurvivable', sub: 'Modern furnished room, NIST / UL' },
        {
          value: 1.1,
          decimals: 1,
          suffix: '%',
          label: 'Were bed-shaker units',
          sub: '3,016 of 267,100 Red Cross alarms',
        },
      ],
      note:
        'Strategic objective: shift from an aid narrative to active prevention and universal household safety.',
    },
  },

  dutchbros: {
    slug: 'dutchbros',
    title: 'Dutch Bros',
    meta: 'Brand Positioning',
    year: '2023',
    field: 4,
    disciplines: ['Strategy', 'Research', 'Concept Development', 'Copywriting'],
    brief: {
      role:
        'A speculative brand-positioning project: how Dutch Bros can win over discerning coffee drinkers without losing the playful identity its Gen-Z following loves. I handled strategy, research, concept development, and copy.',
      strategyLine: {
        text: "Fun flavors elevate an already high-quality coffee. They do not mask it.",
        emphasis: 'elevate',
      },
      triad: {
        challenge:
          "Starbucks owns 28.7% of the category and defines what good coffee looks like. Coffee Purists read Dutch Bros' syrups as a sign the coffee underneath is weak.",
        insight:
          'Good coffee does not have to be serious to be taken seriously. Dutch Bros already has permission, it just has not claimed it.',
        strategy:
          'Reframe fun as intentional and craft-driven. Flavors are deliberate enhancements on a quality base, not a distraction from it.',
      },
    },
    craft: [
      {
        kicker: 'Field research',
        title: 'The perception problem',
        body: [
          'In purist interviews the pattern was consistent: syrups signal something to hide.',
          "The price ladder makes it worse. Dutch Bros at $3.50 reads as cheap next to Starbucks at $5.25, even when the cup is not.",
        ],
        pullQuote: 'I feel bad about syrups sometimes. That feels suspicious to me.',
      },
      {
        kicker: 'Positioning framework',
        title: 'Four axes, one opening',
        body: [
          'Company, consumer, category, and culture all point the same way. Dutch Bros has served fun flavored drinks since 1992, while the rest of the category is now racing to catch up.',
          "The repositioning: fun flavors elevate an already high-quality coffee. The ask shifts from 'switch to us' to 'add us to your rotation.'",
        ],
      },
      {
        kicker: 'Creative strategy',
        title: 'Two executions',
        body: [
          "'A Bean's Life' traces a single bean from origin to cup, making craft visible without the austerity of specialty coffee.",
          "'Surprise, It's a Dutch Bros' opens inside what looks like a restrained artisanal shop, builds credibility through ritual, then reveals the space is a Dutch Bros.",
        ],
        pullQuote: 'Not so serious, on purpose.',
      },
    ],
    artefacts: {
      title: 'The deliverables',
      items: [
        { label: 'Competitive analysis', note: 'Category field metrics', field: 4 },
        { label: '4Cs positioning framework', field: 4 },
        { label: 'Purist interview log', field: 4 },
        { label: "A Bean's Life", note: 'Execution 01', field: 4 },
        { label: "Surprise, It's a Dutch Bros", note: 'Execution 02', field: 4 },
        { label: 'Closing field note', field: 4 },
      ],
    },
    results: {
      intro: 'The category math behind the opportunity.',
      stats: [
        {
          value: 28.7,
          decimals: 1,
          suffix: '%',
          label: 'Starbucks category share',
          sub: '2023, ten times the next competitor',
        },
        { value: 3.5, decimals: 2, prefix: '$', label: 'Dutch Bros cup', sub: 'vs $5.25 Starbucks' },
        { value: 56, suffix: '%', label: 'Customers aged 25 or under', sub: 'Gen-Z following' },
      ],
      note: 'Speculative client proposal. Sealed and indexed.',
    },
  },
}

export const CASE_STUDY_SLUGS = Object.keys(CASE_STUDIES)
