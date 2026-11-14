// The starting content for the whole website. The admin panel (admin/) copies this
// into its own storage on first run, and from then on the site loads its content from
// the admin server. If the server can't be reached, the site falls back to this file.
//
// Image values are names of files in public/images/ (without ".webp"), or uploads from
// the admin media library, which look like "u/some-name".

export const defaultContent = {
  site: {
    name: "Moin's Style Studio",
    tagline: 'Hair, beauty & bridal artistry',
    country: 'Sri Lanka',
    phone: '+94 XX XXX XXXX',
    whatsapp: '',
    email: 'hello@yourdomain.lk',
    address: 'Salon address, Sri Lanka',
    hours: [{ days: 'Opening hours', time: 'To be confirmed' }],
    instagram: '',
    facebook: '',
    tiktok: '',
    mapEmbedUrl: '',
  },

  seo: {
    title: "Moin's Style Studio | Hair, Beauty & Bridal in Sri Lanka",
    description:
      "Moin's Style Studio is one of Sri Lanka's most celebrated salons for hair, colour, bridal, makeup, skin, nails and men's grooming.",
  },

  nav: [
    { label: 'Home', to: '/', image: 'portrait-01' },
    { label: 'About', to: '/about', image: 'studio-02' },
    { label: 'Services', to: '/services', image: 'hair-05' },
    { label: 'Gallery', to: '/gallery', image: 'bride-02' },
    { label: 'Contact', to: '/contact', image: 'studio-04' },
  ],

  // Each category has one or more price lists ("groups"). A treatment can have:
  //   price          the price in LKR (leave empty for "On request")
  //   price2         an optional second price, shown in a second column
  //   from: true     "upwards" prices, shown as "from LKR …"
  // A group with a packagePrice is a package: the treatments are listed, then the
  // package price (with the separate total struck through when it is higher).
  services: [
    {
      slug: 'hair',
      name: 'Hair',
      line: 'Cuts, styling & treatments',
      cover: 'hair-05',
      blurb: 'Precision cutting, finishing and care, shaped around your face, your hair and your day.',
      images: [
        { name: 'hair-01', alt: 'Stylist curling long hair' },
        { name: 'hair-04', alt: 'Hair being set by hand' },
        { name: 'hair-06', alt: 'Hair being washed at the basin' },
        { name: 'hair-03', alt: 'Blow dry with a round brush' },
        { name: 'portrait-01', alt: 'Tousled dark layers' },
        { name: 'hair-07', alt: 'Client having their hair styled' },
      ],
      groups: [
        {
          title: 'Cut & style',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: '',
          items: [
            { name: 'Haircut, ladies', price: 5000, price2: 3000, from: false },
            { name: 'Haircut, gents', price: 3500, price2: 2000, from: false },
            { name: 'Haircut, kids', price: 3500, price2: 1500, from: false },
            { name: 'Beard trim', price: '', price2: 1000, from: false },
            { name: 'Blow dry', price: 5000, price2: 3500, from: true },
          ],
        },
        {
          title: 'Treatments',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: '',
          items: [
            { name: 'Hair extensions', price: 50000, price2: '', from: true },
            { name: 'Conditioning treatment', price: 5000, price2: '', from: false },
            { name: 'Scalp treatment', price: 5000, price2: '', from: true },
            { name: 'Hair perming', price: 20000, price2: '', from: true },
            { name: 'Hair straightening', price: 20000, price2: '', from: true },
            { name: 'Keratin treatment', price: 20000, price2: '', from: true },
          ],
        },
      ],
      notes: [],
    },
    {
      slug: 'colour',
      name: 'Colour',
      line: 'Tone, depth & shine',
      cover: 'colour-02',
      blurb: 'From covering greys to a full transformation, colour built to flatter and to last.',
      images: [
        { name: 'colour-02', alt: 'Long, softly toned waves' },
        { name: 'hair-02', alt: 'Colour being finished at the salon' },
        { name: 'colour-01', alt: 'Vivid hair in motion' },
        { name: 'portrait-07', alt: 'Rich auburn waves' },
        { name: 'colour-03', alt: 'Tousled blonde waves' },
        { name: 'portrait-06', alt: 'Long, glossy brunette hair' },
      ],
      groups: [
        {
          title: '',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: '',
          items: [
            { name: 'Grey cover', price: 4500, price2: '', from: true },
            { name: 'Ladies full head', price: 20000, price2: '', from: true },
            { name: 'Fashion highlights', price: 20000, price2: '', from: true },
            { name: 'Gents full head or highlights', price: 10000, price2: '', from: true },
          ],
        },
      ],
      notes: [],
    },
    {
      slug: 'bridal',
      name: 'Bridal',
      line: 'Packages & dressing',
      cover: 'bride-01',
      blurb: 'Complete bridal dressing for every tradition, planned with you from first trial to final pin.',
      images: [
        { name: 'bride-02', alt: 'Bride in a silk saree' },
        { name: 'bride-01', alt: 'Bride in traditional jewellery' },
        { name: 'bride-04', alt: 'Bride in a flowing emerald gown' },
        { name: 'bride-03', alt: 'Bride in a flowing white gown' },
        { name: 'portrait-03', alt: 'Sculpted bridal updo' },
        { name: 'bride-05', alt: 'Bridal bouquet in low light' },
      ],
      groups: [
        {
          title: 'Bridal package',
          text: 'Dressing for all three occasions.',
          priceLabel: '',
          price2Label: '',
          packagePrice: 185000,
          items: [
            { name: 'Bridal', price: 75000, price2: '', from: false },
            { name: 'Homecoming', price: 75000, price2: '', from: false },
            { name: 'Going away', price: 35000, price2: '', from: false },
          ],
        },
        {
          title: 'Bridal care package',
          text: 'Treatments to prepare for the big day.',
          priceLabel: '',
          price2Label: '',
          packagePrice: 45000,
          items: [
            { name: 'Haircut', price: 5000, price2: '', from: false },
            { name: 'Conditioning treatment', price: 5000, price2: '', from: false },
            { name: 'Facial', price: 12500, price2: '', from: false },
            { name: 'Body wax', price: 8500, price2: '', from: false },
            { name: 'Bridal body polish', price: 10000, price2: '', from: false },
            { name: 'Manicure', price: 2000, price2: '', from: false },
            { name: 'Luxury pedicure', price: 5000, price2: '', from: false },
            { name: 'Bridal nail extensions', price: 7000, price2: '', from: false },
          ],
        },
        {
          title: 'Without package',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: '',
          items: [
            { name: 'Bridal', price: 100000, price2: '', from: false },
            { name: 'Homecoming', price: 100000, price2: '', from: false },
            { name: 'Going away', price: 50000, price2: '', from: false },
            { name: 'Bridesmaid', price: 20000, price2: '', from: false },
            { name: 'Flower girl', price: 5000, price2: '', from: false },
            { name: 'Mother dressing', price: 8000, price2: '', from: false },
          ],
        },
      ],
      notes: ['50% advance when we confirm the appointment.', 'Advance payments are non-refundable.'],
    },
    {
      slug: 'groom',
      name: 'Groom',
      line: 'Groom, best men & page boys',
      cover: 'men-05',
      blurb: 'Dressing and grooming for the groom and his party, so everyone looks sharp on the day.',
      images: [
        { name: 'men-04', alt: 'Detailed fade and beard line' },
        { name: 'men-06', alt: 'Textured cut being styled' },
        { name: 'men-05', alt: 'Client being blow dried' },
        { name: 'men-01', alt: 'Portrait of a man with a textured cut' },
        { name: 'men-07', alt: 'Beard being trimmed with scissors' },
        { name: 'men-08', alt: 'Clippers, scissors and grooming products' },
      ],
      groups: [
        {
          title: 'Groom package',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: 50000,
          items: [
            { name: 'Groom dressing', price: 25000, price2: '', from: false },
            { name: 'Haircut', price: 3500, price2: '', from: false },
            { name: 'Facial', price: 12500, price2: '', from: false },
            { name: 'Hair relaxing', price: 10000, price2: '', from: false },
            { name: 'Manicure', price: 2000, price2: '', from: false },
            { name: 'Luxury pedicure', price: 3000, price2: '', from: false },
          ],
        },
        {
          title: 'Best men package',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: 30000,
          items: [
            { name: 'Best man dressing', price: 15000, price2: '', from: false },
            { name: 'Haircut', price: 3500, price2: '', from: false },
            { name: 'Clean-up', price: 8500, price2: '', from: false },
            { name: 'Hair relaxing', price: 10000, price2: '', from: false },
            { name: 'Manicure', price: 2000, price2: '', from: false },
            { name: 'Pedicure', price: 3000, price2: '', from: false },
          ],
        },
        {
          title: 'Without package',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: '',
          items: [
            { name: 'Groom dressing', price: 25000, price2: '', from: false },
            { name: 'Best man dressing', price: 20000, price2: '', from: false },
            { name: 'Page boy, each (includes haircut)', price: 15000, price2: '', from: false },
            { name: "Groom's mother dressing", price: 8000, price2: '', from: false },
          ],
        },
      ],
      notes: ['Charges depend on the time of the appointment.'],
    },
    {
      slug: 'facials',
      name: 'Facials',
      line: 'Facials & body polish',
      cover: 'skin-01',
      blurb: 'Quiet, considered treatments that leave skin clear, calm and luminous.',
      images: [
        { name: 'skin-02', alt: 'Soothing facial mask' },
        { name: 'skin-03', alt: 'Skin oil applied by hand' },
        { name: 'skin-01', alt: 'Facial treatment in progress' },
        { name: 'portrait-02', alt: 'Portrait against a dark backdrop' },
        { name: 'skin-04', alt: 'Towel, candle and fresh tulips' },
        { name: 'portrait-05', alt: 'Portrait with natural curls' },
      ],
      groups: [
        {
          title: '',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: '',
          items: [
            { name: 'Clean-up', price: 4900, price2: '', from: false },
            { name: 'Facial', price: 8500, price2: '', from: false },
            { name: 'Luxury facial', price: 12500, price2: '', from: false },
            { name: 'Face bleach', price: 3500, price2: '', from: false },
            { name: 'Body polish', price: 15000, price2: '', from: false },
          ],
        },
      ],
      notes: [],
    },
    {
      slug: 'wax',
      name: 'Wax & Threading',
      line: 'Smooth, clean & shaped',
      cover: 'portrait-04',
      blurb: 'Gentle waxing and precise threading, done quickly and with care.',
      images: [
        { name: 'portrait-04', alt: 'Portrait with soft makeup' },
        { name: 'skin-03', alt: 'Skin oil applied by hand' },
        { name: 'makeup-02', alt: 'Makeup brushes in the studio' },
        { name: 'skin-04', alt: 'Towel, candle and fresh tulips' },
        { name: 'portrait-06', alt: 'Long, glossy brunette hair' },
        { name: 'makeup-04', alt: 'Eyeshadow palette and foundation' },
      ],
      groups: [
        {
          title: 'Wax',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: '',
          items: [
            { name: 'Face', price: 2000, price2: '', from: false },
            { name: 'Eyebrows', price: 1000, price2: '', from: false },
            { name: 'Upper lip', price: 500, price2: '', from: false },
            { name: 'Underarms', price: 1500, price2: '', from: false },
            { name: 'Full arms', price: 3500, price2: '', from: false },
            { name: 'Half arms', price: 2000, price2: '', from: false },
            { name: 'Full legs', price: 3500, price2: '', from: false },
            { name: 'Half legs', price: 2000, price2: '', from: false },
            { name: 'Chest', price: 2000, price2: '', from: false },
            { name: 'Tummy', price: 2500, price2: '', from: false },
          ],
        },
        {
          title: 'Threading',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: '',
          items: [
            { name: 'Eyebrows', price: 1000, price2: '', from: false },
            { name: 'Upper lip', price: 300, price2: '', from: false },
            { name: 'Full face', price: 1500, price2: '', from: false },
          ],
        },
      ],
      notes: [],
    },
    {
      slug: 'nails',
      name: 'Nails & Spa',
      line: 'Nails, mehendi, hands & feet',
      cover: 'nails-02',
      blurb: 'Extensions, colour and art, plus manicures, pedicures and massages to unwind.',
      images: [
        { name: 'nails-02', alt: 'Dark gel manicure' },
        { name: 'nails-04', alt: 'Detailed nail art' },
        { name: 'nails-03', alt: 'Natural, polished nails' },
        { name: 'nails-01', alt: 'Polish being applied by hand' },
        { name: 'skin-04', alt: 'Towel, candle and fresh tulips' },
        { name: 'studio-05', alt: 'Row of salon chairs' },
      ],
      groups: [
        {
          title: 'Nail extensions',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: '',
          items: [
            { name: 'Bridal nail extensions', price: 7000, price2: '', from: false },
            { name: 'Acrylic or gel extensions', price: 6500, price2: '', from: false },
            { name: 'French extensions', price: 6500, price2: '', from: false },
            { name: 'Temporary extensions', price: 3500, price2: '', from: false },
            { name: 'Toe nail extensions', price: 4500, price2: '', from: false },
          ],
        },
        {
          title: 'Colour & art',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: '',
          items: [
            { name: 'Gel colour', price: 3500, price2: '', from: false },
            { name: 'Gel colour, French', price: 3500, price2: '', from: false },
            { name: 'Normal colour', price: 2000, price2: '', from: false },
            { name: 'Normal colour, French', price: 2500, price2: '', from: false },
            { name: 'Nail art, each nail', price: 1000, price2: '', from: false },
            { name: 'Broken nail repair with gel or acrylic, each (no colour)', price: 1500, price2: '', from: false },
          ],
        },
        {
          title: 'Hands, feet & massage',
          text: '',
          priceLabel: '',
          price2Label: '',
          packagePrice: '',
          items: [
            { name: 'Manicure', price: 2000, price2: '', from: false },
            { name: 'Pedicure', price: 3000, price2: '', from: false },
            { name: 'Luxury pedicure', price: 5000, price2: '', from: false },
            { name: 'Paraffin treatment', price: 3500, price2: '', from: false },
            { name: 'Foot massage', price: 2500, price2: '', from: false },
            { name: 'Head & shoulder massage with oil', price: 2500, price2: '', from: false },
          ],
        },
        {
          title: 'Mehendi',
          text: 'All mehendi designs are available on request.',
          priceLabel: '',
          price2Label: '',
          packagePrice: '',
          items: [
            { name: 'Bridal mehendi', price: '', price2: '', from: false },
            { name: 'Party mehendi', price: '', price2: '', from: false },
          ],
        },
      ],
      notes: [],
    },
  ],

  // Sample reviews: replace with genuine client feedback, used with permission.
  reviews: {
    eyebrow: 'Client feedback',
    title: 'Loved by our clients',
    text: 'What our guests say after a visit to the studio.',
    items: [
      { name: 'Client name', service: 'Bridal', rating: 5, quote: 'They understood exactly what I wanted for my wedding day. I felt calm, looked after and truly beautiful.' },
      { name: 'Client name', service: 'Hair colour', rating: 5, quote: 'The best colour I have ever had. It looks natural, and my hair feels healthier than before.' },
      { name: 'Client name', service: 'Skin care', rating: 5, quote: 'A wonderfully relaxing facial in a spotless salon. My skin was glowing for days afterwards.' },
      { name: 'Client name', service: "Men's grooming", rating: 5, quote: 'A sharp cut, a clean beard line and friendly people. This is the only place I go now.' },
    ],
  },

  gallery: {
    filters: ['Bridal', 'Hair', 'Beauty', 'Men', 'Studio'],
    items: [
      { name: 'bride-01', cat: 'Bridal', alt: 'Bride in a red and gold saree' },
      { name: 'hair-05', cat: 'Hair', alt: 'Stylist finishing a client at the basin' },
      { name: 'portrait-01', cat: 'Beauty', alt: 'Portrait with tousled dark hair' },
      { name: 'men-05', cat: 'Men', alt: 'Client being blow dried' },
      { name: 'studio-03', cat: 'Studio', alt: 'Long view through the salon' },
      { name: 'bride-02', cat: 'Bridal', alt: 'Bride in a silk saree against a plain backdrop' },
      { name: 'colour-02', cat: 'Hair', alt: 'Long toned waves' },
      { name: 'makeup-01', cat: 'Beauty', alt: 'Eyeshadow palette held in hand' },
      { name: 'men-04', cat: 'Men', alt: 'Fade and beard line up close' },
      { name: 'bride-03', cat: 'Bridal', alt: 'Bride in a flowing white gown' },
      { name: 'hair-01', cat: 'Hair', alt: 'Stylist curling long hair' },
      { name: 'portrait-03', cat: 'Beauty', alt: 'Portrait with a sculpted topknot' },
      { name: 'studio-02', cat: 'Studio', alt: 'Dark mirrored styling stations' },
      { name: 'men-06', cat: 'Men', alt: 'Textured cut being styled' },
      { name: 'bride-04', cat: 'Bridal', alt: 'Bride in a flowing emerald gown' },
      { name: 'nails-02', cat: 'Beauty', alt: 'Dark gel manicure' },
      { name: 'hair-04', cat: 'Hair', alt: 'Hair being set by hand' },
      { name: 'portrait-02', cat: 'Beauty', alt: 'Portrait against a dark backdrop' },
      { name: 'men-01', cat: 'Men', alt: 'Portrait of a man with a textured cut' },
      { name: 'bride-05', cat: 'Bridal', alt: 'Bridal bouquet in low light' },
      { name: 'colour-03', cat: 'Hair', alt: 'Tousled blonde waves' },
      { name: 'studio-04', cat: 'Studio', alt: 'Warm brick-walled barbering room' },
      { name: 'portrait-04', cat: 'Beauty', alt: 'Portrait with soft makeup' },
      { name: 'colour-01', cat: 'Hair', alt: 'Vivid hair in motion' },
      { name: 'skin-02', cat: 'Beauty', alt: 'Soothing facial mask' },
      { name: 'studio-05', cat: 'Studio', alt: 'Row of salon chairs' },
      { name: 'portrait-05', cat: 'Beauty', alt: 'Portrait with natural curls' },
    ],
  },

  // `photo`: an image name, or a file in public/images/team/ with its extension.
  owner: {
    name: 'Mr Moin Khan',
    role: 'Founder & Creative Director',
    photo: 'moin-khan.jpg',
    bio: [
      'Moin Khan founded the studio with a simple belief: everyone deserves to leave feeling like the best version of themselves.',
      'Years behind the chair, from everyday cuts to full bridal mornings, shape the way he leads the team and looks after every guest.',
    ],
  },

  team: [
    { name: 'Dilini Perera', role: 'Senior Stylist', photo: 'portrait-06' },
    { name: 'Nethmi Fernando', role: 'Colour Specialist', photo: 'portrait-07' },
    { name: 'Sanduni Silva', role: 'Bridal & Makeup Artist', photo: 'portrait-05' },
    { name: 'Ishara Jayawardena', role: 'Skin & Nail Therapist', photo: 'portrait-02' },
    { name: 'Kasun Rathnayake', role: 'Barber', photo: 'men-02' },
  ],

  pages: {
    home: {
      layout: [
        { id: 'hero', visible: true },
        { id: 'welcome', visible: true },
        { id: 'services', visible: true },
        { id: 'whyUs', visible: true },
        { id: 'bridal', visible: true },
        { id: 'trending', visible: true },
        { id: 'journey', visible: true },
        { id: 'forHerHim', visible: true },
        { id: 'testimonials', visible: true },
        { id: 'recentWork', visible: true },
        { id: 'cta', visible: true },
        { id: 'visitUs', visible: true },
      ],
      hero: {
        primaryLabel: 'Book appointment',
        secondaryLabel: 'Discover',
        slides: [
          {
            name: 'hair-02',
            tab: 'Hair',
            position: '60% 30%',
            alt: 'Stylist blow drying a client in the salon',
            eyebrow: 'Hair & colour',
            lines: ['Hair that turns', 'heads, every day'],
            text: "Cuts, colour and care from one of Sri Lanka's most loved salons.",
            to: '/services#hair',
          },
          {
            name: 'bride-01',
            tab: 'Bridal',
            position: '50% 17%',
            alt: 'Bride in a red and gold saree',
            eyebrow: 'Bridal dressing',
            lines: ['Your most beautiful', 'day starts here'],
            text: 'Complete bridal hair, makeup and dressing for every tradition.',
            to: '/services#bridal',
          },
          {
            name: 'skin-01',
            tab: 'Skin',
            position: '50% 40%',
            alt: 'Facial treatment in the salon',
            eyebrow: 'Skin & beauty',
            lines: ['Time to relax,', 'glow and unwind'],
            text: 'Facials, nails and beauty treatments made for quiet moments.',
            to: '/services#facials',
          },
          {
            name: 'men-05',
            tab: 'Grooming',
            position: '50% 28%',
            alt: 'Barber styling a client',
            eyebrow: 'For gentlemen',
            lines: ['Sharp cuts,', 'clean grooming'],
            text: 'Haircuts, beard work and hot towel shaves done with care.',
            to: '/services#hair',
          },
        ],
      },
      welcome: {
        eyebrow: 'Welcome to the studio',
        title: 'A salon that listens first',
        text: 'Whether you need a quick trim, a new colour or the full bridal morning, our team takes the time to understand what you want, then looks after every detail.',
        points: ['Skilled, friendly stylists', 'Quality professional products', 'A clean, relaxing salon', 'Advice before every service'],
        buttonLabel: 'Our story',
        image: { name: 'hair-04', alt: "Stylist setting a client's hair" },
        inset: { name: 'hair-05', alt: "Stylist washing a client's hair" },
      },
      services: {
        eyebrow: 'What we do',
        title: 'Our services',
        text: 'Everything you need for hair, beauty and bridal, under one roof.',
      },
      whyUs: {
        eyebrow: 'Why choose us',
        title: 'Care you can feel',
        reasons: [
          { icon: 'scissors', title: 'Expert hands', text: 'Stylists who know how to bring out the best in every client.' },
          { icon: 'sparkle', title: 'Quality products', text: 'Professional products chosen to care for your hair and skin.' },
          { icon: 'shield', title: 'Clean & safe', text: 'A spotless salon, with fresh tools for every guest.' },
          { icon: 'heart', title: 'Personal care', text: 'Time to listen, so you leave happy with your look.' },
        ],
      },
      bridal: {
        eyebrow: 'Bridal',
        title: 'Your wedding day, beautifully done',
        text: 'Complete bridal dressing for every tradition, planned with you from first trial to final pin.',
        steps: ['Consultation & planning', 'Trial hair and makeup', 'Dressing on your big day'],
        buttonLabel: 'Bridal services',
        images: [
          { name: 'bride-01', alt: 'Bride in a red and gold saree' },
          { name: 'bride-02', alt: 'Bride in a silk saree' },
          { name: 'bride-04', alt: 'Bride in a flowing emerald gown' },
        ],
      },
      trending: {
        eyebrow: 'Inspiration',
        title: 'Trending looks',
        text: 'Bring a favourite along and we will make it yours.',
        looks: [
          { name: 'colour-02', label: 'Soft waves' },
          { name: 'portrait-03', label: 'Sculpted updo' },
          { name: 'men-01', label: 'Textured crop' },
          { name: 'portrait-01', label: 'Tousled layers' },
          { name: 'bride-03', label: 'Bridal elegance' },
          { name: 'colour-03', label: 'Beach blonde' },
          { name: 'nails-02', label: 'Gel nails' },
          { name: 'portrait-05', label: 'Natural curls' },
        ],
      },
      journey: {
        eyebrow: 'Your visit',
        title: 'How it works',
        steps: [
          { icon: 'calendar', title: 'Book', text: 'Choose your service and a time that suits you.' },
          { icon: 'chat', title: 'Consult', text: 'We talk through your ideas and what will suit you.' },
          { icon: 'scissors', title: 'Relax', text: 'Sit back while our team takes care of everything.' },
          { icon: 'sparkle', title: 'Shine', text: 'Leave feeling confident, with tips to keep your look.' },
        ],
      },
      forHerHim: {
        linkLabel: 'Explore',
        offers: [
          { title: 'For Her', text: 'Hair, colour, bridal, skin and nails.', to: '/services#hair', image: 'portrait-03', alt: 'Woman with a sculpted updo' },
          { title: 'For Him', text: 'Cuts, beards and groom dressing.', to: '/services#groom', image: 'men-05', alt: 'Barber styling a client' },
        ],
      },
      recentWork: {
        eyebrow: 'Gallery',
        title: 'Our recent work',
        buttonLabel: 'View gallery',
        mosaic: [
          { name: 'hair-02', alt: 'Colour being finished in the salon', span: 'large' },
          { name: 'bride-03', alt: 'Bride in a flowing white gown', span: 'tall' },
          { name: 'nails-02', alt: 'Dark gel manicure', span: 'normal' },
          { name: 'makeup-01', alt: 'Eyeshadow palette', span: 'normal' },
          { name: 'men-06', alt: 'Textured cut being styled', span: 'normal' },
          { name: 'hair-07', alt: 'Client having their hair styled', span: 'wide' },
          { name: 'skin-02', alt: 'Soothing facial mask', span: 'normal' },
        ],
      },
      cta: {
        title: 'Ready for your new look?',
        text: 'Send us a booking request and we will get back to you.',
        buttonLabel: 'Book appointment',
        image: 'studio-03',
        alt: 'Inside the salon',
      },
    },

    about: {
      layout: [
        { id: 'founder', visible: true },
        { id: 'team', visible: true },
        { id: 'story', visible: true },
        { id: 'values', visible: true },
        { id: 'promise', visible: true },
        { id: 'studio', visible: true },
        { id: 'testimonials', visible: true },
        { id: 'cta', visible: true },
      ],
      hero: {
        eyebrow: 'About us',
        title: "About Moin's Style Studio",
        text: 'A Sri Lankan salon built around great hair, beautiful skin and genuine care.',
        image: 'studio-03',
        alt: 'View through the salon',
        position: 'center',
      },
      founder: { eyebrow: 'Meet the founder' },
      team: { eyebrow: 'Our crew', title: 'Meet the team' },
      story: {
        eyebrow: 'Our story',
        title: 'Great style is personal',
        quote: 'A name Sri Lanka trusts with its most important days, and its everyday ones too.',
        paragraphs: [
          'Great style begins with listening, and ends when you see yourself in the mirror and smile.',
          'From a simple trim to a full bridal morning, every guest receives the same attention to detail.',
        ],
        image: { name: 'hair-07', alt: 'Client having their hair styled' },
        inset: { name: 'makeup-02', alt: 'Makeup brushes' },
      },
      values: {
        eyebrow: 'Our values',
        title: 'What we stand for',
        items: [
          { title: 'Craft', image: 'hair-05', alt: 'Stylist working at the basin', text: 'Skilled hands, honest advice and a finish you can feel.' },
          { title: 'Care', image: 'skin-03', alt: 'Oil being applied by hand', text: 'Your hair and skin are looked after long before the final look.' },
          { title: 'Confidence', image: 'portrait-01', alt: 'Confident client portrait', text: 'You leave looking like yourself, on your very best day.' },
        ],
      },
      promise: {
        eyebrow: 'Our promise',
        title: 'Every visit, every guest',
        items: [
          { icon: 'chat', title: 'We listen', text: 'Every visit begins with a conversation.' },
          { icon: 'shield', title: 'We keep it clean', text: 'Fresh tools and a spotless salon.' },
          { icon: 'sparkle', title: 'We use the best', text: 'Professional products we trust.' },
          { icon: 'heart', title: 'We care', text: 'You are looked after from start to finish.' },
        ],
      },
      studio: {
        eyebrow: 'The salon',
        title: 'Inside the studio',
        images: [
          { name: 'hair-02', alt: 'Colour being finished in the salon', span: 'large' },
          { name: 'studio-04', alt: 'Warm barbering room', span: 'normal' },
          { name: 'studio-05', alt: 'Row of salon chairs', span: 'normal' },
          { name: 'studio-03', alt: 'View through the salon', span: 'wide' },
        ],
      },
      cta: { title: 'Come and meet us', text: '', buttonLabel: 'Book appointment', image: 'hair-07', alt: 'Stylist with a client' },
    },

    services: {
      hero: {
        eyebrow: 'Services',
        title: 'Services & prices',
        text: 'Choose from our full menu of hair, beauty, bridal and grooming.',
        image: 'hair-07',
        alt: 'Client having their hair styled in the salon',
        position: 'center',
      },
      bookLabel: 'Book',
      cta: {
        title: 'Not sure where to start?',
        text: 'Prices are a guide and can vary with hair length and condition. Tell us what you have in mind and we will help you choose.',
        buttonLabel: 'Book appointment',
        image: 'hair-04',
        alt: "Stylist working on a client's hair",
      },
    },

    gallery: {
      hero: {
        eyebrow: 'Gallery',
        title: 'Our work',
        text: 'A look at the hair, beauty and bridal styling we love.',
        image: 'bride-02',
        alt: 'Bride in a silk saree',
        position: '50% 14%',
      },
      allLabel: 'All',
      cta: { title: 'Love what you see?', text: '', buttonLabel: 'Book appointment', image: 'hair-02', alt: "Stylist finishing a client's hair" },
    },

    contact: {
      hero: {
        eyebrow: 'Contact',
        title: "Let's get you booked",
        text: 'Send a request, call the studio, or drop in and say hello.',
        image: 'studio-04',
        alt: 'Warm brick-walled room in the studio',
        position: 'center',
      },
      booking: {
        eyebrow: 'Appointments',
        title: 'Book your visit',
        text: 'Fill in your details and we will get back to you to confirm.',
        buttonLabel: 'Request booking',
        successMessage: 'Thank you. We have your request and will contact you soon to confirm.',
      },
      bottomImage: { name: 'studio-03', alt: 'Long view through the salon' },
    },

    notFound: {
      lines: ['This page has', 'left the chair.'],
      buttonLabel: 'Back to home',
    },
  },
}

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value)

// Fills anything missing from `stored` with the defaults, so content saved by an older
// version keeps working when new fields are added. Lists are taken as saved.
export function withDefaults(defaults, stored) {
  if (!isObject(defaults) || !isObject(stored)) return stored === undefined ? defaults : stored
  const out = { ...defaults }
  for (const [key, value] of Object.entries(stored)) {
    out[key] = key in defaults ? withDefaults(defaults[key], value) : value
  }
  return out
}
