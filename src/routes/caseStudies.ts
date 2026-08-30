import type { Slide } from '@/components/Filmstrip/Filmstrip'
import type { Shot } from '@/components/Slideshow/Slideshow'
import type { AnimTab } from '@/components/AnimationSeries/AnimationSeries'

export type Triad = { challenge: string; insight: string; strategy: string }

export type Media = { image: string; alt: string; caption?: string }

export type FilmstripDef = {
  title: string
  openLabel: string
  meta?: string
  cover?: string
  tight?: boolean
  slides: Slide[]
}

export type GalleryItem = { src: string; alt: string; caption: string }
export type GalleryDef = { title: string; lead?: string; items: GalleryItem[] }

export type SlideshowDef = {
  title: string
  lead?: string
  fit?: 'cover' | 'contain'
  aspect?: string
  slides: Shot[]
}

export type TiltCardItem = { src: string; alt: string; caption?: string }
export type TiltCardsDef = { title: string; lead?: string; hero?: TiltCardItem; items: TiltCardItem[] }

export type AnimationSeriesDef = { title: string; lead?: string; tabs: AnimTab[] }

export type AlbumStep = { n: string; title: string; text: string; image: string; alt: string }
export type AlbumEvolutionDef = { title: string; lead?: string; steps: AlbumStep[] }

export type VideoCut = {
  label: string
  kind: 'final' | 'alternate'
  note?: string
  /** Hosted source, when available. Until then the card shows a placeholder. */
  src?: string
  poster?: string
}
export type VideoTheaterDef = { title: string; lead?: string; cuts: VideoCut[] }

export type TimelinePoint = {
  date: string
  playlists: number
  reach: number
  phase: string
  desc: string
}
export type TimelineDef = {
  title: string
  lead?: string
  /** Slider index to open on. */
  start?: number
  points: TimelinePoint[]
}

/** Frame image paths for a Red Cross animation folder (NN.webp). */
export const frames = (base: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => `${base}/${String(i + 1).padStart(2, '0')}.webp`)

export type Dial = { value: number | null; label: string; sub?: string; display?: string }

/** Build filmstrip slides for a folder of NN.webp page scans. */
export const pages = (base: string, count: number, alt: string): Slide[] =>
  Array.from({ length: count }, (_, i) => ({
    src: `${base}/${String(i + 1).padStart(2, '0')}.webp`,
    alt: `${alt}, page ${i + 1}`,
  }))

export type CraftStat = {
  to: number
  decimals?: number
  suffix?: string
  bar: number // 0-100, the meter fill
  label: string
  sub?: string
}
export type CraftCopy = { title?: string; items: { header?: string; text: string }[] }

export type CraftSection = {
  kicker: string
  title: string
  body: string[]
  pullQuote?: string
  stats?: CraftStat[]
  finalCopy?: CraftCopy
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
  artefacts: {
    title: string
    lead?: string
    items?: Artefact[]
    gallery?: GalleryDef
    slideshow?: SlideshowDef
    filmstrips?: FilmstripDef[]
    tiltCards?: TiltCardsDef
    animationSeries?: AnimationSeriesDef
    albumEvolution?: AlbumEvolutionDef
    videoTheater?: VideoTheaterDef
  }
  results: {
    intro: string
    stats: Stat[]
    dials?: Dial[]
    comparison?: { before: Media; after: Media; caption?: string }
    timeline?: TimelineDef
    note?: string
    media?: Media[]
  }
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
      // TODO(kenneth): image placements reverted pending labelled files.
      // Available in public/works/unopenedletter/: cover-original, cover-rework,
      // envelope-ref, nicholas-jimenez.
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
      },
      {
        kicker: 'Copywriting and testing',
        title: 'Finding the hook',
        body: [
          "We A/B tested 'A New Piano Sound' against 'The Definitive Soundtrack.'",
          "'A New Piano Sound' won on performance. It frames the track as a cinematic score for the listener's inner life, an invitation to tie a memory to it and keep coming back.",
        ],
        pullQuote: 'A new piano sound for those days that feel like memories.',
        finalCopy: {
          title: 'A / B test',
          items: [
            { header: 'Variant A, chosen', text: 'A New Piano Sound' },
            { header: 'Variant B', text: 'The Definitive Soundtrack' },
          ],
        },
      },
      {
        kicker: 'Video campaign',
        title: 'A story preserved in time',
        body: [
          'The video campaign built a visual parallel to the memories the music evokes: the bittersweet pull toward moments that have already passed.',
          'We cut four versions, two final selections and two alternates, to test how far to lean into the ache.',
        ],
      },
    ],
    artefacts: {
      title: 'The deliverables',
      albumEvolution: {
        title: 'The album cover',
        lead: 'Three passes at giving the track a face a listener could recall a week later.',
        steps: [
          {
            n: '01',
            title: 'The initial concept',
            text: "Nick's original cover was an impressionistic painting of a letter resting on a piano. It caught the nostalgia, but nothing about it stuck.",
            image: '/works/unopenedletter/art/1-initial.webp',
            alt: 'Impressionistic painting of a letter resting on a piano',
          },
          {
            n: '02',
            title: 'The minimalist prototype',
            text: 'I pitched a design that doubled as the digital art and a promotional CD: the clear jewel case as the envelope, a wax stamp and two lines on the flap, a paper insert holding a Spotify code and his wider catalogue. The goal was a disc that stayed in the car.',
            image: '/works/unopenedletter/art/2-prototype.webp',
            alt: 'Minimalist album art built around a wax-stamped envelope',
          },
          {
            n: '03',
            title: 'The final cover',
            text: 'We never produced the CD, so Nick went warmer and more literal: a full paper envelope in warm light, sitting naturally next to his other covers.',
            image: '/works/unopenedletter/art/3-final.webp',
            alt: 'Final cover, a paper envelope photographed in warm light',
          },
        ],
      },
      videoTheater: {
        title: 'A story preserved in time',
        lead: 'Four vertical cuts for paid Instagram Stories, each testing how far to lean into the ache. Two final selections, two alternates.',
        cuts: [
          // Add `src` (hosted mp4 / stream URL) per cut once the videos are hosted.
          { label: 'Final selection 1', kind: 'final' },
          { label: 'Final selection 2', kind: 'final' },
          { label: 'Alternate cut 1', kind: 'alternate' },
          { label: 'Alternate cut 2', kind: 'alternate' },
        ],
      },
    },
    results: {
      intro:
        'Early playlist adds compounded into exponential reach between March and August 2026.',
      stats: [
        { value: 23260, format: 'comma', label: 'Single streams', sub: 'Unopened Letter' },
        { value: 179691, format: 'comma', label: 'Playlist reach', sub: 'Active audience' },
        { value: 23, label: 'Active playlists', sub: 'Verified nodes' },
      ],
      timeline: {
        title: '"Unopened Letter" performance',
        lead: 'Playlist count against listener reach, 16 March to 3 August 2026. Scrub the timeline to read each phase.',
        start: 2,
        points: [
          { date: '16 Mar', playlists: 5, reach: 42000, phase: 'The start', desc: 'Before a single ad ran, Nicholas pitched the song directly to playlist curators. The placement that mattered came from a curator who simply liked it.' },
          { date: '30 Mar', playlists: 6, reach: 43000, phase: 'Activating', desc: "The ads went live alongside Nicholas's own reels, built to give viewers the same longing the song gave us." },
          { date: '13 Apr', playlists: 21, reach: 158000, phase: 'Breakout', desc: 'Spotify surfaced it in Discover Weekly and Release Radar, and playlists began adding it on their own, 6 to 21 in two weeks.' },
          { date: '27 Apr', playlists: 19, reach: 150000, phase: 'Held onto', desc: "High save-rates meant people weren't glancing once and moving on." },
          { date: '11 May', playlists: 17, reach: 142000, phase: 'Settling in', desc: 'Reach leveled off around listeners who wanted to hear it again.' },
          { date: '25 May', playlists: 13, reach: 115000, phase: 'What stayed', desc: 'A few playlists dropped it, but reach fell less than the count did. The ones that stayed were carrying more weight.' },
          { date: '8 Jun', playlists: 11, reach: 95000, phase: 'The plateau', desc: 'Eleven playlists held through June with no new push.' },
          { date: '22 Jun', playlists: 11, reach: 95000, phase: 'On its own', desc: 'Same eleven playlists, same reach. Daily listeners were holding it up, not new placements.' },
          { date: '6 Jul', playlists: 11, reach: 94000, phase: 'Quick lull', desc: "Reach dipped slightly; the playlist count didn't move. It held through the slow months." },
          { date: '20 Jul', playlists: 10, reach: 88000, phase: 'Held its ground', desc: 'Steady daily listeners kept it going, even as one playlist fell off.' },
          { date: '3 Aug', playlists: 12, reach: 73500, phase: 'Where it sits now', desc: '12 playlists, 73.5K reach, a slight uptick from July.' },
        ],
      },
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
      },
    ],
    artefacts: {
      title: 'The deliverables',
      lead: 'Flip through the full guide and report. Nothing to download.',
      slideshow: {
        title: 'Influencers who came out and posted',
        lead: 'Values-aligned creators and partners I invited in, who shared Amplify Austin on their own channels.',
        fit: 'contain',
        aspect: '5 / 4',
        slides: [
          {
            src: '/works/aap/influencer/1-secret-aap.webp',
            alt: 'Instagram post from a performance-art creator supporting AAP',
            caption: 'Secret ATX, performance art',
          },
          {
            src: '/works/aap/influencer/2-reggaeton.webp',
            alt: 'Instagram post from the UT Austin reggaetón dance club',
            caption: 'Reggaetón Dance Club, UT Austin',
          },
          {
            src: '/works/aap/influencer/3-rainbow.webp',
            alt: 'Instagram post from Rainbow Connections ATX',
            caption: 'Rainbow Connections ATX, community partner',
          },
        ],
      },
      filmstrips: [
        {
          title: 'Donor Travel Guide',
          openLabel: 'Preview the guide',
          meta: 'Broadway Brunch on the Road, Portland, Maine',
          cover: '/works/aap/travel-guide/01.webp',
          slides: pages('/works/aap/travel-guide', 12, 'Donor travel guide'),
        },
        {
          title: '24-hour Impact Report',
          openLabel: 'View the report',
          meta: 'Researched, structured and produced in one day',
          cover: '/works/aap/impact-report/01.webp',
          slides: pages('/works/aap/impact-report', 4, 'Impact report'),
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
      ],
      dials: [
        { value: 45, label: 'Attendance', sub: 'Year over year' },
        { value: 36, label: 'Donor growth', sub: 'Year over year' },
        { value: 100, display: '1st', label: 'Medium-size nonprofit', sub: 'Category placement, 2025' },
      ],
      comparison: {
        before: {
          image: '/works/aap/leaderboard-2024.webp',
          alt: 'Amplify Austin citywide leaderboard, 2024, American Artist Project at 48th',
          caption: '2024, 48th citywide',
        },
        after: {
          image: '/works/aap/leaderboard-2025.webp',
          alt: 'Amplify Austin citywide leaderboard, 2025, American Artist Project at 6th',
          caption: '2025, 6th citywide',
        },
        caption: 'Amplify Austin citywide ranking, year over year',
      },
      note: 'Partners and micro-influencers amplified the campaign across their own channels.',
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
        stats: [
          {
            to: 60,
            suffix: '%',
            bar: 60,
            label: 'Lower fire death rate',
            sub: 'Homes with a working alarm, NFPA',
          },
          {
            to: 4,
            suffix: ' min',
            bar: 13,
            label: 'To unsurvivable',
            sub: 'Down from thirty with older furnishings, NIST / UL',
          },
          {
            to: 1.1,
            decimals: 1,
            suffix: '%',
            bar: 1.1,
            label: 'Were bed-shaker units',
            sub: '3,016 of 267,100 Red Cross alarms',
          },
        ],
      },
      {
        kicker: 'Thirty-second social spot',
        title: 'Animation series',
        body: [
          'Traditional safety PSAs risk being dismissed the moment they imply vulnerability. Each animation instead centres on a loved one, a dog, a grandmother, a sister, intervening during a house fire.',
          'The narrative shows the real risk of relying on sound and smell while others are put in danger trying to wake you. Shifting the weight from self-preservation to protecting others creates urgency without condescension.',
        ],
        finalCopy: {
          title: 'Final taglines',
          items: [
            { header: 'Dog', text: 'Your dog waits for you. What are you waiting for?' },
            { header: 'Granny', text: "When you're asleep, so is your sense of smell." },
            { header: 'Bedshaker', text: 'A bed shaker is not an early warning. It is your only warning.' },
          ],
        },
      },
      {
        kicker: 'Print call-to-action',
        title: 'Business cards',
        body: [
          'The card series leans deliberately into urgency: in a fire, a DHH individual may only get one warning, and seconds matter.',
          'Blunt, minimal, time-sensitive copy paired with QR codes linking straight to the free bed-shaker request tool. Not charity. Prevention.',
        ],
        finalCopy: {
          title: 'Final copy, the four backs',
          items: [
            { header: 'Back 01', text: 'In a fire, seconds count' },
            { header: 'Back 02', text: 'Fire waits for no one, and neither should you' },
            { header: 'Back 03', text: 'Your only warning' },
            { header: 'Back 04', text: 'Fire doesn’t discriminate, neither should your alarm' },
          ],
        },
      },
    ],
    artefacts: {
      title: 'The deliverables',
      animationSeries: {
        title: 'Animation series',
        lead: 'Three thirty-second spots. Pick a beat to jump the frame, or step through. Each sequence runs to its tagline, a call to action, and the campaign end card.',
        tabs: [
          {
            key: 'dog',
            label: 'Dog',
            tagline: 'Your dog waits for you. What are you waiting for?',
            desc: 'This spot flips the relationship between a person and their pet. The dog does not just alert Steve, it waits for him, nudging and refusing to leave without its owner. The one who is supposed to rely on a human becomes the protector.',
            beats: [
              'Dark scribbles appear on screen',
              'Dog mouth barking appears with muffled barking sound',
              'Dark scribbles fade back on screen',
              'Fire alarm with red, flashing light appears, with a muffled beep',
              'Dark scribbles fade back on screen',
              "Dog's mouth barking appears with muffled barking sound",
              'Dark scribbles fade back on screen',
              'Dog is barking at Steve, sleeping in bed, trying to wake him',
              'Steve is starting to wake up as the dog continues to nudge him',
              "Steve is sitting up in bed, awakened by the dog, realising there's a fire",
              'Steve and the dog are running out of the room',
              'Closing tagline: your dog waits for you',
              'Call to action: switch to a bed shaker',
              'End card: #SignTheAlarm',
            ],
            frames: frames('/works/redcross/dog', 14),
            caption:
              '#SignTheAlarm Fire damage goes beyond flames. Request a bed shaker alarm installed and provided by the Red Cross to ensure your safety. Learn more and request yours by clicking the link in our bio.',
          },
          {
            key: 'granny',
            label: 'Granny',
            tagline: "When you're asleep, so is your sense of smell.",
            desc: 'This spot shows what happens when someone relies on smell during a fire. Jane has to physically enter the room to wake her Deaf grandmother. The moment is confused rather than panicked, showing how much time and risk is added when you depend on another person to wake you.',
            beats: [
              'Dark scribbles appear on screen',
              'Face mouthing the words "wake up" appears on screen',
              'Dark scribbles reappear on screen',
              'Fire alarm with red, flashing light appears, with a muffled beep',
              'Dark scribbles reappear on screen',
              'Face mouthing the words "wake up" reappears on screen',
              'Dark scribbles reappear on screen',
              'Granny is lying in bed, unaware of the danger. Jane shakes the bed to wake her',
              'Jane signs to Granny, "fire, fire"',
              'Granny is awake, shocked by the fire',
              'Granny and Jane quickly exit the room',
              'Closing tagline: when you are asleep, so is your sense of smell',
              'Call to action: switch to a bed shaker',
              'End card: #SignTheAlarm',
            ],
            frames: frames('/works/redcross/granny', 14),
            caption:
              "#SignTheAlarm Fire doesn't discriminate, and neither should someone's alarm. Consider volunteering with the Red Cross and be part of installing bed shaker alarms for people in your community. Visit the link in our bio for details.",
          },
          {
            key: 'bedshaker',
            label: 'Bedshaker',
            tagline: 'A bed shaker is not an early warning. It is your only warning.',
            desc: 'The conclusion to the series. Jenny is woken by her bed shaker while she is alone. She relies on no pet and no person, the vibration wakes her and she gets out safely without putting anyone else at risk. It reframes what "early warning" means for the DHH community.',
            beats: [
              'Dark scribbles appear on screen',
              '"Wake up" in sign flashes along with text',
              'Dark scribbles reappear on screen',
              'Fire alarm with red, flashing light appears, with a muffled beep',
              'Dark scribbles reappear on screen',
              '"Wake up" in sign flashes along with text again',
              'Dark scribbles reappear on screen',
              'Jenny is asleep with the bed shaker attached to the bed, unaware of the danger',
              'The bed shaker activates and Jenny wakes from the shaking of the bed',
              'A close-up of the bed shaker, emphasising the movement',
              'Jenny is out of bed, exiting the room quickly',
              'Closing tagline: a bed shaker is your only warning',
              'Call to action: switch to a bed shaker',
              'End card: #SignTheAlarm',
            ],
            frames: frames('/works/redcross/bedshaker', 14),
            caption:
              '#SignTheAlarm The speed of fire is unpredictable. Learn how to protect your home and loved ones with fire safety resources from the Red Cross. Stay informed and stay safe. Find out more at the link in our bio.',
          },
        ],
      },
      filmstrips: [
        {
          title: 'Business cards',
          openLabel: 'See the card set',
          meta: 'Front, plus four back variations. QR to the free request tool',
          cover: '/works/redcross/cards/1-front.webp',
          tight: true,
          slides: [
            { src: '/works/redcross/cards/1-front.webp', alt: 'Business card front, American Red Cross in ASL fingerspelling on red', caption: 'Front, primary design' },
            { src: '/works/redcross/cards/2-back-seconds.webp', alt: 'Business card back reading In a fire, seconds count', caption: 'Back 01, in a fire, seconds count' },
            { src: '/works/redcross/cards/3-back-fire-waits.webp', alt: 'Business card back reading Fire waits for no one', caption: 'Back 02, fire waits for no one' },
            { src: '/works/redcross/cards/4-back-warning.webp', alt: 'Business card back reading Your only warning', caption: 'Back 03, your only warning' },
            { src: '/works/redcross/cards/5-back-alarm.webp', alt: 'Business card back reading Neither should your alarm', caption: 'Back 04, neither should your alarm' },
          ],
        },
        {
          title: 'Free bed shaker infographic',
          openLabel: 'Read the steps',
          meta: 'How to request a free unit, in four steps',
          cover: '/works/redcross/infographic/01.webp',
          slides: pages('/works/redcross/infographic', 4, 'Bed shaker infographic'),
        },
      ],
    },
    results: {
      intro:
        'Adopted by the American Red Cross as the official creative for Deaf Awareness Month. Speaking to the community’s values instead of its vulnerability moved numbers that had held flat for years.',
      stats: [
        {
          value: 160,
          prefix: '+',
          suffix: '%',
          label: 'Bed shaker requests',
          sub: 'Deaf Awareness Month vs. prior-quarter run rate',
        },
        {
          value: 2.4,
          decimals: 1,
          suffix: '×',
          label: 'ASL-fluent volunteer sign-ups',
          sub: 'Against the same period a year earlier',
        },
        {
          value: 3.8,
          decimals: 1,
          suffix: '%',
          label: 'Bed-shaker share of alarms installed',
          sub: 'Up from 1.1% before the campaign',
        },
      ],
      note:
        'Framing the alarm as protecting your family, not receiving aid, broke through the resistance that had kept bed-shaker adoption in the low single digits — and drew ASL-fluent volunteers into the pipeline alongside the requests.',
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
