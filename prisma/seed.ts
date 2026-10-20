import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const OCCASIONS = [
  { name: "Birthday", slug: "birthday", icon: "🎂", description: "Celebrate another wonderful year around the sun", sortOrder: 1 },
  { name: "Anniversary", slug: "anniversary", icon: "💍", description: "Romantic milestones and lasting love", sortOrder: 2 },
  { name: "Graduation", slug: "graduation", icon: "🎓", description: "Congratulate academic and career achievements", sortOrder: 3 },
  { name: "Valentine's Day", slug: "valentines-day", icon: "💖", description: "Express your heartfelt love and romance", sortOrder: 4 },
  { name: "Mother's Day", slug: "mothers-day", icon: "💐", description: "Shower mom with gratitude and warmth", sortOrder: 5 },
  { name: "Father's Day", slug: "fathers-day", icon: "👔", description: "Show dad how much you appreciate him", sortOrder: 6 },
  { name: "Wedding", slug: "wedding", icon: "👰", description: "Celebrate the union of two souls", sortOrder: 7 },
  { name: "Housewarming", slug: "housewarming", icon: "🏡", description: "Warm wishes for a cozy new home", sortOrder: 8 },
  { name: "Thank You", slug: "thank-you", icon: "🙏", description: "A meaningful token of heartfelt appreciation", sortOrder: 9 },
  { name: "Just Because", slug: "just-because", icon: "✨", description: "Spontaneous surprises that brighten anyone's day", sortOrder: 10 },
  { name: "Get Well Soon", slug: "get-well-soon", icon: "🍵", description: "Comforting care packages and warm thoughts", sortOrder: 11 },
  { name: "New Baby", slug: "new-baby", icon: "🍼", description: "Welcoming the sweetest new arrival", sortOrder: 12 },
];

const CATEGORIES = [
  { name: "Flowers & Bouquets", slug: "flowers", icon: "🌸", description: "Fresh floral arrangements, roses, and preserved blooms", imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80", sortOrder: 1 },
  { name: "Beauty & Skincare", slug: "beauty-skincare", icon: "✨", description: "Ayurvedic wellness, organic lotions, and pampering sets", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", sortOrder: 2 },
  { name: "Curated Gift Boxes", slug: "gift-boxes", icon: "🎁", description: "Handcrafted themed gift hampers for every taste", imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80", sortOrder: 3 },
  { name: "Chocolates & Sweets", slug: "chocolates-sweets", icon: "🍫", description: "Artisan chocolates, brownies, macarons and treats", imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80", sortOrder: 4 },
  { name: "Cakes & Desserts", slug: "cakes", icon: "🎂", description: "Custom celebration cakes, cupcakes, and tarts", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80", sortOrder: 5 },
  { name: "Perfumes & Scents", slug: "perfumes", icon: "🌿", description: "Signature fragrances, mists, and diffuser sets", imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80", sortOrder: 6 },
  { name: "Jewellery & Keepsakes", slug: "jewellery", icon: "💎", description: "Silver, gold-plated, gemstone jewelry & pendants", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80", sortOrder: 7 },
  { name: "Personalized Gifts", slug: "personalized", icon: "🏷️", description: "Custom engraved frames, mugs, journals & keepsakes", imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80", sortOrder: 8 },
  { name: "Handmade & Crafts", slug: "handmade", icon: "🧶", description: "Authentic Sri Lankan handlooms, pottery and crafts", imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80", sortOrder: 9 },
  { name: "Home & Lifestyle", slug: "home-lifestyle", icon: "🕯️", description: "Scented candles, ceramic tableware, cozy decor", imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80", sortOrder: 10 },
  { name: "Fashion & Bags", slug: "fashion-bags", icon: "👜", description: "Silk scarves, tote bags, wallets and accessories", imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80", sortOrder: 11 },
  { name: "Plants & Succulents", slug: "plants", icon: "🪴", description: "Indoor plants, air-purifying pots, and terrariums", imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80", sortOrder: 12 },
  { name: "Stationery & Books", slug: "stationery-books", icon: "📖", description: "Leather journals, planners, desk sets & bestsellers", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80", sortOrder: 13 },
  { name: "Experiences & Dining", slug: "experiences", icon: "🎟️", description: "High tea vouchers, spa days, pottery workshops", imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80", sortOrder: 14 },
];

const SHOPS = [
  {
    name: "Bloom House Colombo",
    slug: "bloom-house",
    tagLine: "Artisan Bouquets & Luxury Preserved Floral Boxes",
    description: "Colombo's premier floral studio crafting breathtaking bouquets, boxed fresh Ecuadorian roses, and everlasting dried flower arrangements for life's most unforgettable occasions.",
    logo: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://bloomhouse.lk",
    instagramUrl: "https://instagram.com/bloomhousecolombo",
    facebookUrl: "https://facebook.com/bloomhousecolombo",
    whatsappNumber: "+94771234567",
    phone: "+94112345678",
    email: "hello@bloomhouse.lk",
    address: "42 Ward Place, Cinnamon Gardens",
    city: "Colombo 07",
    district: "Colombo",
    latitude: 6.9147,
    longitude: 79.8732,
    categories: "Flowers & Bouquets, Curated Gift Boxes, Personalized Gifts",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "Spa Ceylon Luxury Ayurveda",
    slug: "spa-ceylon",
    tagLine: "Royal Wellness & Ceylon Botanical Spa Rituals",
    description: "World-renowned Ceylon luxury ayurveda bath, body, skincare and wellness collections, packaged with regal elegance and pure royal botanical ingredients.",
    logo: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://spaceylon.com",
    instagramUrl: "https://instagram.com/spaceylon",
    facebookUrl: "https://facebook.com/spaceylon",
    whatsappNumber: "+94779876543",
    phone: "+94114567890",
    email: "care@spaceylon.com",
    address: "14 Park Street, Colombo 02",
    city: "Colombo 02",
    district: "Colombo",
    latitude: 6.9189,
    longitude: 79.8596,
    categories: "Beauty & Skincare, Perfumes & Scents, Curated Gift Boxes",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "Mimosa Studio",
    slug: "mimosa",
    tagLine: "Modern Curated Gift Boxes & Celebration Essentials",
    description: "Thoughtfully themed gift hampers featuring locally crafted goodies, premium teas, scented candles, and customized keepsakes packaged in signature reusable pine and matte boxes.",
    logo: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://mimosagifts.lk",
    instagramUrl: "https://instagram.com/mimosastudio.lk",
    facebookUrl: "https://facebook.com/mimosastudiolk",
    whatsappNumber: "+94772345678",
    phone: "+94117654321",
    email: "curate@mimosagifts.lk",
    address: "88 Horton Place",
    city: "Colombo 07",
    district: "Colombo",
    latitude: 6.9112,
    longitude: 79.8745,
    categories: "Curated Gift Boxes, Personalized Gifts, Home & Lifestyle",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "Butter Boutique",
    slug: "butter-boutique",
    tagLine: "Decadent Artisan Cakes, Gourmet Cookies & Sweet Treats",
    description: "Famous for decadent layered cakes, tres leches, handmade artisan gelato, gourmet brownies and show-stopping celebration treats baked with pure French butter and real chocolate.",
    logo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://butterboutique.lk",
    instagramUrl: "https://instagram.com/butterboutique",
    facebookUrl: "https://facebook.com/butterboutique",
    whatsappNumber: "+94773456789",
    phone: "+94112500000",
    email: "orders@butterboutique.lk",
    address: "34 27th Lane, Colombo 03",
    city: "Colombo 03",
    district: "Colombo",
    latitude: 6.9015,
    longitude: 79.8524,
    categories: "Cakes & Desserts, Chocolates & Sweets",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "Urban Island",
    slug: "urban-island",
    tagLine: "Contemporary Tropical Lifestyle, Ceramic Ware & Homeware",
    description: "Celebrating modern tropical Sri Lankan design through handwoven textiles, handcrafted stoneware ceramics, scented soy candles, and artisan lifestyle decor.",
    logo: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://urbanisland.com",
    instagramUrl: "https://instagram.com/urbanisland.lk",
    facebookUrl: "https://facebook.com/urbanislandlk",
    whatsappNumber: "+94774567890",
    phone: "+94112599000",
    email: "contact@urbanisland.com",
    address: "181 S. De S. Jayasinghe Mawatha",
    city: "Nugegoda",
    district: "Colombo",
    latitude: 6.8722,
    longitude: 79.8988,
    categories: "Home & Lifestyle, Handmade & Crafts, Fashion & Bags",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "Barefoot Ceylon",
    slug: "barefoot-ceylon",
    tagLine: "Iconic Handloom Wonders, Books, Toys & Island Living",
    description: "A legendary Sri Lankan institution created by Barbara Sansoni. Vibrant hand-dyed cotton handlooms, handcrafted soft toys, bespoke notebooks, and coffee table Ceylon art books.",
    logo: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://barefootceylon.com",
    instagramUrl: "https://instagram.com/barefootceylon",
    facebookUrl: "https://facebook.com/barefootceylon",
    whatsappNumber: "+94775678901",
    phone: "+94112589305",
    email: "info@barefootceylon.com",
    address: "704 Galle Road, Colombo 03",
    city: "Colombo 03",
    district: "Colombo",
    latitude: 6.8920,
    longitude: 79.8550,
    categories: "Handmade & Crafts, Home & Lifestyle, Stationery & Books",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "The Scent Bar Colombo",
    slug: "the-scent-bar",
    tagLine: "Bespoke Perfumery, Scented Mist & Reed Diffusers",
    description: "Crafting customized signature fragrances, luxury soy wax candles, and oriental reed diffusers inspired by tropical Ceylon spices, vanilla orchids and ocean breezes.",
    logo: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://thescentbar.lk",
    instagramUrl: "https://instagram.com/thescentbarcolombo",
    facebookUrl: "https://facebook.com/thescentbarlk",
    whatsappNumber: "+94776789012",
    phone: "+94112543210",
    email: "fragrance@thescentbar.lk",
    address: "15 Stratford Avenue",
    city: "Colombo 06",
    district: "Colombo",
    latitude: 6.8790,
    longitude: 79.8655,
    categories: "Perfumes & Scents, Home & Lifestyle, Curated Gift Boxes",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "Aurelia Fine Jewellery",
    slug: "aurelia-jewellery",
    tagLine: "Minimalist 18k Gold Plated, Sterling Silver & Ceylon Sapphires",
    description: "Timeless everyday fine jewelry featuring ethically sourced Ceylon sapphires, dainty 18k gold vermeil pendants, stackable rings, and customized birthstone necklaces.",
    logo: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://aureliajewels.lk",
    instagramUrl: "https://instagram.com/aureliajewels.lk",
    facebookUrl: "https://facebook.com/aureliajewelslk",
    whatsappNumber: "+94777890123",
    phone: "+94112378901",
    email: "sparkle@aureliajewels.lk",
    address: "22 Alfred House Gardens",
    city: "Colombo 03",
    district: "Colombo",
    latitude: 6.8990,
    longitude: 79.8540,
    categories: "Jewellery & Keepsakes, Personalized Gifts",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "Green Thumb Plant Studio",
    slug: "green-thumb",
    tagLine: "Exotic Indoor Botanicals, Bonsai & Handcrafted Planters",
    description: "Lush potted monsteras, air-purifying snake plants, succulent terrariums in handmade terracotta and ceramic vessels that bring peaceful green life to any room.",
    logo: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://greenthumb.lk",
    instagramUrl: "https://instagram.com/greenthumb.lk",
    facebookUrl: "https://facebook.com/greenthumbplants",
    whatsappNumber: "+94778901234",
    phone: "+94112789123",
    email: "grow@greenthumb.lk",
    address: "55 Nawala Road",
    city: "Rajagiriya",
    district: "Colombo",
    latitude: 6.9080,
    longitude: 79.8920,
    categories: "Plants & Succulents, Home & Lifestyle",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "Papyrus Artisan Stationery",
    slug: "papyrus-stationery",
    tagLine: "Handmade Deckled Paper, Leather Journals & Wax Seal Kits",
    description: "Preserving the romantic art of letter writing with recycled handmade elephant dung paper, gilded calligraphy sets, vintage wax stamps, and customized journals.",
    logo: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://papyruspaper.lk",
    instagramUrl: "https://instagram.com/papyrus.stationery",
    facebookUrl: "https://facebook.com/papyruspaperlk",
    whatsappNumber: "+94779012345",
    phone: "+94112456123",
    email: "write@papyruspaper.lk",
    address: "71 Reid Avenue",
    city: "Colombo 07",
    district: "Colombo",
    latitude: 6.9030,
    longitude: 79.8650,
    categories: "Stationery & Books, Personalized Gifts, Handmade & Crafts",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "Teaeli Artisan Teas",
    slug: "teaeli",
    tagLine: "Single Origin Ceylon Designer Tea Blends & Tea Gift Chests",
    description: "Sri Lanka's first designer tea blender, crafting playful, decadent tea infusions like Chocolate Truffle, Mint Earl Grey, and Rose Berry in luxury collectible caddies.",
    logo: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://teaeli.com",
    instagramUrl: "https://instagram.com/teaeliteas",
    facebookUrl: "https://facebook.com/teaeli",
    whatsappNumber: "+94770123456",
    phone: "+94112890456",
    email: "sip@teaeli.com",
    address: "12 Independence Avenue",
    city: "Colombo 07",
    district: "Colombo",
    latitude: 6.9045,
    longitude: 79.8690,
    categories: "Curated Gift Boxes, Food & Beverages, Home & Lifestyle",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "Kandy Craft & Silks",
    slug: "kandy-craft-silks",
    tagLine: "Traditional Kandyan Brass, Handwoven Batik Silks & Woodcarvings",
    description: "Heritage craftsmen cooperative from the sacred hills of Kandy delivering hand-drawn silk batiks, embossed brass platters, and polished ebony decorative keepsakes.",
    logo: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://kandycrafts.lk",
    instagramUrl: "https://instagram.com/kandycraftsilks",
    facebookUrl: "https://facebook.com/kandycrafts",
    whatsappNumber: "+94771122334",
    phone: "+94812234567",
    email: "heritage@kandycrafts.lk",
    address: "88 Dalada Veediya",
    city: "Kandy",
    district: "Kandy",
    latitude: 7.2906,
    longitude: 80.6337,
    categories: "Handmade & Crafts, Fashion & Bags, Home & Lifestyle",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "Galle Fort Perfumerie",
    slug: "galle-fort-perfumerie",
    tagLine: "Artisan Coastal Scents & Dutch Fort Heritage Botanicals",
    description: "Nestled within the 17th-century UNESCO Galle Fort, blending bespoke coastal scents using cinnamon bark, lemongrass, frangipani, and Indian Ocean salt.",
    logo: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1512290900672-1f02e60742f3?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://gallefortperfumerie.lk",
    instagramUrl: "https://instagram.com/gallefortscents",
    facebookUrl: "https://facebook.com/galleperfumerie",
    whatsappNumber: "+94772233445",
    phone: "+94912233445",
    email: "galle@gallefortperfumerie.lk",
    address: "44 Church Street, Fort",
    city: "Galle",
    district: "Galle",
    latitude: 6.0270,
    longitude: 80.2170,
    categories: "Perfumes & Scents, Beauty & Skincare",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "The Chocolate Factory Colombo",
    slug: "the-chocolate-factory",
    tagLine: "Handmade Single Estate Dark Cocoa Truffles & Pralines",
    description: "Small-batch bean-to-bar chocolatier producing velvety bonbons infused with Ceylon cinnamon, salted caramel, cashew crunch, and wild passion fruit.",
    logo: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://chocolatefactory.lk",
    instagramUrl: "https://instagram.com/thechocolatefactorylk",
    facebookUrl: "https://facebook.com/chocolatefactorylk",
    whatsappNumber: "+94773344556",
    phone: "+94112998877",
    email: "truffles@chocolatefactory.lk",
    address: "10 Deal Place",
    city: "Colombo 03",
    district: "Colombo",
    latitude: 6.9030,
    longitude: 79.8520,
    categories: "Chocolates & Sweets, Curated Gift Boxes",
    isVerified: true,
    status: "ACTIVE",
  },
  {
    name: "Negombo Clay & Pottery House",
    slug: "negombo-clay",
    tagLine: "Earthy Hand-thrown Ceramic Mugs, Planters & Dinnerware",
    description: "Cozy coastal pottery studio crafting minimal matte terracotta coffee mugs, glazed noodle bowls, and aroma burners made by local master potters.",
    logo: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://negombopottery.lk",
    instagramUrl: "https://instagram.com/negomboclay",
    facebookUrl: "https://facebook.com/negomboclay",
    whatsappNumber: "+94774455667",
    phone: "+94312223344",
    email: "clay@negombopottery.lk",
    address: "24 Porutota Road",
    city: "Negombo",
    district: "Gampaha",
    latitude: 7.2280,
    longitude: 79.8430,
    categories: "Handmade & Crafts, Home & Lifestyle",
    isVerified: true,
    status: "ACTIVE",
  }
];

// Helper to assemble products
function generateProducts(shopMap: Record<string, string>) {
  return [
    // Bloom House Products
    {
      shopId: shopMap["bloom-house"],
      name: "Velvet Crimson Rose & Baby's Breath Bouquet",
      slug: "velvet-crimson-rose-bouquet",
      description: "24 handpicked long-stem red roses wrapped in premium waterproof matte Korean paper and tied with a luxury satin ribbon. Includes complimentary handwritten calligraphed card.",
      price: 4800,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Flowers & Bouquets",
      tags: "flowers, roses, romantic, bouquet, birthday, anniversary, girlfriend, wife, cute",
      occasions: "Birthday, Anniversary, Valentine's Day, Just Because",
      recipientTypes: "Girlfriend, Wife, Mom, Sister, Friend",
      interests: "Flowers, Romantic surprises, Aesthetics, Cute decor",
      giftTypes: "Romantic, Cute, Luxurious, Surprising",
      minBudget: 3500,
      maxBudget: 6000,
      isFeatured: true,
      isActive: true,
      viewsCount: 342,
      clicksCount: 89,
    },
    {
      shopId: shopMap["bloom-house"],
      name: "Pastel Dream Preserved Everlasting Floral Dome",
      slug: "pastel-dream-floral-dome",
      description: "A magical glass bell jar housing 100% real preserved hydrangea and peony blooms that last 3+ years without watering. Features subtle warm fairy lights embedded inside.",
      price: 7500,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Flowers & Bouquets",
      tags: "preserved flowers, fairy lights, aesthetic, romantic, long lasting, room decor",
      occasions: "Birthday, Anniversary, Valentine's Day, Graduation",
      recipientTypes: "Girlfriend, Wife, Sister, Friend",
      interests: "Flowers, Room aesthetics, Fairy lights, Cute gifts",
      giftTypes: "Romantic, Cute, Luxurious, Personalized",
      minBudget: 6000,
      maxBudget: 10000,
      isFeatured: true,
      isActive: true,
      viewsCount: 280,
      clicksCount: 71,
    },
    {
      shopId: shopMap["bloom-house"],
      name: "Sunflower Sunshine Hand-Tied Posy",
      slug: "sunflower-sunshine-posy",
      description: "Bright golden sunflowers paired with chamomile flowers and eucalyptus leaves. Guaranteed to bring instant joy and bright energy to any graduate or best friend.",
      price: 3200,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Flowers & Bouquets",
      tags: "sunflowers, graduation, yellow, cheerful, affordable, under-5000, friend, sister",
      occasions: "Graduation, Birthday, Get Well Soon, Thank You, Just Because",
      recipientTypes: "Friend, Sister, Brother, Colleague, Mom",
      interests: "Nature, Photography, Bright aesthetic, Minimalist",
      giftTypes: "Cute, Useful, Surprising",
      minBudget: 2500,
      maxBudget: 4000,
      isFeatured: false,
      isActive: true,
      viewsCount: 195,
      clicksCount: 48,
    },

    // Spa Ceylon Products
    {
      shopId: shopMap["spa-ceylon"],
      name: "De-Stress Luxury Wellness Gift Box",
      slug: "spa-ceylon-destress-wellness-box",
      description: "Infused with calming Frankincense, pure Kaffir Lime and soothing Sandalwood. Contains Relaxing Body Cleanser, Body Massage Oil, Calming Mist, and Peace Soothing Balm.",
      price: 6900,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Beauty & Skincare",
      tags: "skincare, self care, ayurveda, relaxation, luxury, spa, girlfriend, mom, wife",
      occasions: "Birthday, Mother's Day, Anniversary, Thank You, Just Because",
      recipientTypes: "Girlfriend, Mom, Wife, Sister, Friend, Colleague",
      interests: "Skincare, Self care, Wellness, Spa rituals, Natural beauty",
      giftTypes: "Luxurious, Useful, Romantic, Thoughtful",
      minBudget: 5000,
      maxBudget: 9000,
      isFeatured: true,
      isActive: true,
      viewsCount: 420,
      clicksCount: 115,
    },
    {
      shopId: shopMap["spa-ceylon"],
      name: "Ceylon Tea & Aloe Gentle Face Care Set",
      slug: "ceylon-tea-aloe-face-care-set",
      description: "Hydrating Ceylon Green Tea clarifying face wash, refreshing floral facial toning mist, and ultra-light soothing aloe vera moisture gel for radiant tropical skin.",
      price: 4600,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Beauty & Skincare",
      tags: "face care, skincare, green tea, under 5000, organic, girlfriend, sister, bestie",
      occasions: "Birthday, Just Because, Thank You",
      recipientTypes: "Girlfriend, Sister, Friend, Boyfriend",
      interests: "Skincare, Organic beauty, Daily routine, Refreshment",
      giftTypes: "Useful, Cute, Thoughtful",
      minBudget: 3500,
      maxBudget: 5500,
      isFeatured: false,
      isActive: true,
      viewsCount: 310,
      clicksCount: 78,
    },
    {
      shopId: shopMap["spa-ceylon"],
      name: "Cardamom Rose Signature Solid Perfume & Mist",
      slug: "cardamom-rose-solid-perfume-mist",
      description: "An intoxicating blend of wild rose petals, crushed spicy cardamom and warm amber. Elegantly boxed in royal turquoise casing with traditional golden floral motifs.",
      price: 3900,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Perfumes & Scents",
      tags: "perfume, fragrance, rose, cardamom, travel friendly, elegant, girlfriend, wife",
      occasions: "Birthday, Valentine's Day, Anniversary, Mother's Day",
      recipientTypes: "Girlfriend, Wife, Sister, Mom",
      interests: "Fragrances, Luxury scents, Royal style, Skincare",
      giftTypes: "Romantic, Luxurious, Cute",
      minBudget: 3000,
      maxBudget: 5000,
      isFeatured: false,
      isActive: true,
      viewsCount: 225,
      clicksCount: 52,
    },

    // Mimosa Studio Products
    {
      shopId: shopMap["mimosa"],
      name: "The 'Sweet Hug' Thoughtful Care Package",
      slug: "sweet-hug-care-package",
      description: "Includes an artisan scented soy candle (Vanilla Berry), gourmet chocolate fudge brownie cookies, a cozy ceramic mug, and a customized personalized greeting card in a ribboned gift box.",
      price: 4900,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Curated Gift Boxes",
      tags: "gift box, cute, thoughtful, candle, cookies, mug, under 5000, girlfriend, best friend",
      occasions: "Birthday, Just Because, Thank You, Get Well Soon",
      recipientTypes: "Girlfriend, Sister, Friend, Mom, Colleague",
      interests: "Cute things, Cozy lifestyle, Baking, Coffee, Candles",
      giftTypes: "Cute, Thoughtful, Useful, Surprising",
      minBudget: 4000,
      maxBudget: 6000,
      isFeatured: true,
      isActive: true,
      viewsCount: 512,
      clicksCount: 140,
    },
    {
      shopId: shopMap["mimosa"],
      name: "Gentleman's Executive Coffee & Leather Box",
      slug: "gentlemans-executive-coffee-leather-box",
      description: "Features premium single-origin Ceylon roasted Arabica coffee beans, a stainless steel french press, genuine top-grain leather card holder, and dark single-estate chocolate thins.",
      price: 8800,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Curated Gift Boxes",
      tags: "boyfriend gift, husband, dad, coffee lover, leather wallet, luxury, executive",
      occasions: "Birthday, Father's Day, Anniversary, Graduation, Promotion",
      recipientTypes: "Boyfriend, Husband, Dad, Brother, Colleague",
      interests: "Coffee, Leather goods, Tech, Minimalist style, Executive life",
      giftTypes: "Luxurious, Useful, Thoughtful",
      minBudget: 7000,
      maxBudget: 12000,
      isFeatured: true,
      isActive: true,
      viewsCount: 390,
      clicksCount: 94,
    },
    {
      shopId: shopMap["mimosa"],
      name: "Custom Engraved Bamboo Memory Keepsake Box",
      slug: "custom-engraved-memory-box",
      description: "Natural organic bamboo memory chest engraved with the recipient's name or custom coordinates, filled with dried lavender sachet and polaroid photo prints of your moments.",
      price: 3600,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Personalized Gifts",
      tags: "personalized, engraved, wooden box, polaroids, romantic, anniversary, memory",
      occasions: "Anniversary, Birthday, Valentine's Day, Wedding",
      recipientTypes: "Girlfriend, Boyfriend, Wife, Husband, Best Friend",
      interests: "Photography, Sentimental memories, Keepsakes, Woodcraft",
      giftTypes: "Personalized, Romantic, Thoughtful",
      minBudget: 3000,
      maxBudget: 5000,
      isFeatured: false,
      isActive: true,
      viewsCount: 260,
      clicksCount: 63,
    },

    // Butter Boutique Products
    {
      shopId: shopMap["butter-boutique"],
      name: "Signature Tres Leches Celebration Cake (1kg)",
      slug: "signature-tres-leches-cake",
      description: "Colossal sponge soaked in three rich creams, topped with whipped chantilly and fresh strawberries. Colombo's most celebrated birthday and anniversary centerpiece dessert.",
      price: 6200,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Cakes & Desserts",
      tags: "cake, celebration, birthday, dessert, food, sweet, delicious, strawberries",
      occasions: "Birthday, Anniversary, Graduation, Housewarming, Just Because",
      recipientTypes: "Girlfriend, Boyfriend, Mom, Dad, Sister, Friend, Couple",
      interests: "Food, Desserts, Celebration, Gourmet dining",
      giftTypes: "Surprising, Delicious, Luxurious",
      minBudget: 5000,
      maxBudget: 8000,
      isFeatured: true,
      isActive: true,
      viewsCount: 470,
      clicksCount: 130,
    },
    {
      shopId: shopMap["butter-boutique"],
      name: "Assorted Gourmet Fudge Brownie Box (6-Pack)",
      slug: "gourmet-fudge-brownie-box",
      description: "Six thick, chewy brownies featuring Nutella Swirl, Salted Caramel Crunch, Lotus Biscoff, Dark Cocoa Walnut, Triple Choc, and Peanut Butter Dream.",
      price: 3400,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Chocolates & Sweets",
      tags: "brownies, dessert, chocolate, box, under 5000, affordable, friends, colleagues",
      occasions: "Birthday, Thank You, Housewarming, Just Because",
      recipientTypes: "Friend, Sister, Brother, Colleague, Boyfriend",
      interests: "Chocolate, Baking, Desserts, Casual treats",
      giftTypes: "Delicious, Cute, Useful",
      minBudget: 2500,
      maxBudget: 4500,
      isFeatured: false,
      isActive: true,
      viewsCount: 315,
      clicksCount: 82,
    },

    // Urban Island Products
    {
      shopId: shopMap["urban-island"],
      name: "Handmade Ceramic Tropical Pour-Over & Mug Set",
      slug: "handmade-ceramic-coffee-set",
      description: "Artisan stoneware dripper cone and matching wide-mouth latte mug finished in a soothing sea-foam green speckle glaze. Microwave and dishwasher safe.",
      price: 5400,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Home & Lifestyle",
      tags: "ceramic, mug, coffee, handcrafted, aesthetic, housewarming, home decor",
      occasions: "Housewarming, Birthday, Wedding, Thank You",
      recipientTypes: "Friend, Colleague, Sister, Mom, Couple",
      interests: "Coffee, Pottery, Interior design, Minimalist living",
      giftTypes: "Useful, Cute, Thoughtful",
      minBudget: 4500,
      maxBudget: 7000,
      isFeatured: false,
      isActive: true,
      viewsCount: 210,
      clicksCount: 45,
    },
    {
      shopId: shopMap["urban-island"],
      name: "Woven Palm Leaf & Brass Wall Hanging",
      slug: "woven-palm-leaf-wall-hanging",
      description: "Handwoven by rural artisan women in Kurunegala using cured Palmyra palm leaves and spun brass rings. Adds organic warmth and textured charm to any gallery wall.",
      price: 4200,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Handmade & Crafts",
      tags: "handloom, crafts, wall decor, palm leaf, sustainable, ethical, housewarming",
      occasions: "Housewarming, Wedding, Birthday",
      recipientTypes: "Mom, Friend, Couple, Colleague",
      interests: "Home decor, Bohemian style, Handcrafts, Sustainability",
      giftTypes: "Thoughtful, Useful, Cute",
      minBudget: 3500,
      maxBudget: 5500,
      isFeatured: false,
      isActive: true,
      viewsCount: 175,
      clicksCount: 38,
    },

    // Barefoot Ceylon Products
    {
      shopId: shopMap["barefoot-ceylon"],
      name: "Handwoven Sunset Orange Cotton Tote Bag",
      slug: "handwoven-sunset-orange-tote-bag",
      description: "Heavy-duty 100% Sri Lankan handloom cotton tote featuring iconic Barbara Sansoni bright geometric stripes, sturdy shoulder straps, and interior zip pocket.",
      price: 3800,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Fashion & Bags",
      tags: "tote bag, handloom, colorful, barefoot, sustainable, fashion, under 5000",
      occasions: "Birthday, Just Because, Graduation",
      recipientTypes: "Girlfriend, Sister, Friend, Mom",
      interests: "Fashion, Everyday essentials, Island living, Art",
      giftTypes: "Useful, Cute, Thoughtful",
      minBudget: 3000,
      maxBudget: 5000,
      isFeatured: true,
      isActive: true,
      viewsCount: 360,
      clicksCount: 88,
    },
    {
      shopId: shopMap["barefoot-ceylon"],
      name: "Handcrafted Handloom Elephant Soft Toy",
      slug: "handcrafted-handloom-elephant",
      description: "Iconic Barefoot heirloom stuffed elephant hand-stitched by female artisans using bright non-toxic dyed cotton fabrics. A beloved collector's treasure and nursery gift.",
      price: 2900,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Handmade & Crafts",
      tags: "elephant, toy, cute, kids, baby, handmade, heirloom, souvenir, under 3000",
      occasions: "New Baby, Birthday, Just Because, Housewarming",
      recipientTypes: "Child, Friend, Girlfriend, Sister",
      interests: "Cute animals, Handlooms, Nostalgia, Room decor",
      giftTypes: "Cute, Thoughtful, Personalized",
      minBudget: 2000,
      maxBudget: 4000,
      isFeatured: false,
      isActive: true,
      viewsCount: 290,
      clicksCount: 74,
    },

    // The Scent Bar Products
    {
      shopId: shopMap["the-scent-bar"],
      name: "Ceylon Vanilla & Wild Fig Luxury Scented Candle",
      slug: "ceylon-vanilla-fig-candle",
      description: "250g natural coconut-soy wax candle with double cotton wick. Features top notes of fresh black fig, heart of spicy vanilla bean, and warm sandalwood base. 55-hour burn time.",
      price: 3800,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Home & Lifestyle",
      tags: "candle, vanilla, fig, relaxing, room scent, girlfriend, mom, under 5000",
      occasions: "Birthday, Housewarming, Anniversary, Thank You",
      recipientTypes: "Girlfriend, Mom, Wife, Friend, Colleague",
      interests: "Candles, Aromatherapy, Cozy vibes, Self care",
      giftTypes: "Romantic, Cute, Luxurious, Useful",
      minBudget: 3000,
      maxBudget: 5000,
      isFeatured: true,
      isActive: true,
      viewsCount: 405,
      clicksCount: 96,
    },
    {
      shopId: shopMap["the-scent-bar"],
      name: "Amber & Teakwood Room Reed Diffuser (150ml)",
      slug: "amber-teakwood-reed-diffuser",
      description: "Continuous effortless scent diffusion for 3+ months. Rich blend of cedarwood, amber resin, tonka bean, and spicy clove with 8 black rattan reeds in an amber glass apothecary bottle.",
      price: 4900,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Perfumes & Scents",
      tags: "diffuser, home scent, amber, masculine, unisex, housewarming, boyfriend, dad",
      occasions: "Housewarming, Birthday, Father's Day, Thank You",
      recipientTypes: "Boyfriend, Husband, Dad, Friend, Colleague",
      interests: "Home decor, Sophisticated scents, Men lifestyle",
      giftTypes: "Useful, Luxurious, Thoughtful",
      minBudget: 4000,
      maxBudget: 6500,
      isFeatured: false,
      isActive: true,
      viewsCount: 230,
      clicksCount: 57,
    },

    // Aurelia Fine Jewellery Products
    {
      shopId: shopMap["aurelia-jewellery"],
      name: "Dainty Ceylon Blue Sapphire Solitaire Necklace (18k Gold Vermeil)",
      slug: "ceylon-blue-sapphire-necklace",
      description: "A brilliant round-cut 4mm natural Ceylon blue sapphire bezel-set on a shimmering 16-18 inch adjustable 18k gold-plated 925 sterling silver cable chain. Packaged in a velvet keepsake box.",
      price: 14500,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Jewellery & Keepsakes",
      tags: "jewellery, sapphire, gold necklace, luxury, girlfriend, anniversary, romantic, wife",
      occasions: "Anniversary, Birthday, Valentine's Day, Wedding, Graduation",
      recipientTypes: "Girlfriend, Wife, Mom, Sister",
      interests: "Fine jewellery, Gemstones, Minimalist fashion, Luxury",
      giftTypes: "Romantic, Luxurious, Personalized",
      minBudget: 12000,
      maxBudget: 20000,
      isFeatured: true,
      isActive: true,
      viewsCount: 520,
      clicksCount: 165,
    },
    {
      shopId: shopMap["aurelia-jewellery"],
      name: "Personalized Initial Letter Disc Bracelet",
      slug: "personalized-initial-disc-bracelet",
      description: "Custom hand-stamped initial disc on a dainty 14k gold-filled chain. Pick any uppercase letter to create an intimate keepsake she can wear everyday.",
      price: 4900,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1611591475155-4284fa2c0e7f?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1611591475155-4284fa2c0e7f?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Jewellery & Keepsakes",
      tags: "initial bracelet, personalized, jewelry, gold, cute, girlfriend, bestie, under 5000",
      occasions: "Birthday, Valentine's Day, Anniversary, Graduation",
      recipientTypes: "Girlfriend, Sister, Friend, Wife",
      interests: "Jewelry, Personalization, Minimalist style, Cute things",
      giftTypes: "Personalized, Cute, Romantic",
      minBudget: 4000,
      maxBudget: 6000,
      isFeatured: true,
      isActive: true,
      viewsCount: 385,
      clicksCount: 110,
    },

    // Green Thumb Plant Studio Products
    {
      shopId: shopMap["green-thumb"],
      name: "Monstera Deliciosa in Matte Terracotta Pot",
      slug: "monstera-deliciosa-terracotta-pot",
      description: "Thriving Swiss Cheese plant with iconic split leaves, potted in custom draining terracotta planter with organic aerated tropical soil blend. Includes plant care guide card.",
      price: 3500,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Plants & Succulents",
      tags: "plant, indoor plant, monstera, green, housewarming, desk plant, room decor, under 5000",
      occasions: "Housewarming, Birthday, Thank You, Just Because",
      recipientTypes: "Friend, Colleague, Brother, Sister, Mom",
      interests: "Plants, Gardening, Home aesthetic, Nature",
      giftTypes: "Useful, Cute, Thoughtful",
      minBudget: 2500,
      maxBudget: 5000,
      isFeatured: false,
      isActive: true,
      viewsCount: 240,
      clicksCount: 65,
    },
    {
      shopId: shopMap["green-thumb"],
      name: "Miniature Geometric Succulent & Crystal Terrarium",
      slug: "geometric-succulent-crystal-terrarium",
      description: "Hexagonal glass and brass terrarium featuring 3 hardy assorted succulents, raw rose quartz crystal, white river pebbles and charcoal filtration layer.",
      price: 4800,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Plants & Succulents",
      tags: "terrarium, succulents, crystals, glass, desk decor, cute, girlfriend, colleague",
      occasions: "Birthday, Housewarming, Graduation, Just Because",
      recipientTypes: "Girlfriend, Colleague, Friend, Sister",
      interests: "Crystals, Desk aesthetics, Low maintenance plants",
      giftTypes: "Cute, Thoughtful, Useful",
      minBudget: 3500,
      maxBudget: 6000,
      isFeatured: true,
      isActive: true,
      viewsCount: 310,
      clicksCount: 80,
    },

    // Papyrus Artisan Stationery Products
    {
      shopId: shopMap["papyrus-stationery"],
      name: "Vintage Calligraphy & Brass Wax Seal Starter Kit",
      slug: "vintage-calligraphy-wax-seal-kit",
      description: "Wooden storage box containing a glass dip pen, 3 pigmented metallic inks (Gold, Crimson, Emerald), floral brass wax stamp, wax melting spoon, and assorted wax beads.",
      price: 4500,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Stationery & Books",
      tags: "wax seal, calligraphy, stationery, art, vintage, aesthetic, journaling, under 5000",
      occasions: "Birthday, Graduation, Just Because, Thank You",
      recipientTypes: "Friend, Sister, Girlfriend, Brother",
      interests: "Journaling, Calligraphy, Art, Letter writing, Vintage aesthetic",
      giftTypes: "Thoughtful, Useful, Cute, Surprising",
      minBudget: 3500,
      maxBudget: 5500,
      isFeatured: false,
      isActive: true,
      viewsCount: 220,
      clicksCount: 59,
    },
    {
      shopId: shopMap["papyrus-stationery"],
      name: "Handmade Deckled Cotton Paper Leather Journal",
      slug: "handmade-deckled-paper-leather-journal",
      description: "Rustic full-grain saddle leather journal bound with 200 pages of 150gsm unlined deckled-edge recycled cotton paper. Includes wrap-around leather tie and bookmark.",
      price: 3900,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Stationery & Books",
      tags: "journal, notebook, leather, stationery, writing, sketch, boyfriend, brother, friend",
      occasions: "Graduation, Birthday, Father's Day, Just Because",
      recipientTypes: "Boyfriend, Husband, Brother, Friend, Dad",
      interests: "Writing, Journaling, Travel, Sketching, Vintage items",
      giftTypes: "Useful, Thoughtful, Personalized",
      minBudget: 3000,
      maxBudget: 5000,
      isFeatured: false,
      isActive: true,
      viewsCount: 275,
      clicksCount: 68,
    },

    // Teaeli Artisan Teas Products
    {
      shopId: shopMap["teaeli"],
      name: "Artisan Dessert Tea Trio Gift Chest",
      slug: "artisan-dessert-tea-trio",
      description: "Three collectible matte tins featuring 'Choc Mint Truffle', 'Almond Vanilla Rooibos', and 'Strawberries & Champagne Green Tea' presented in an embossed wooden slider box with golden mesh tea infuser.",
      price: 5200,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Curated Gift Boxes",
      tags: "tea, ceylon tea, dessert tea, gourmet, gift chest, mom, dad, housewarming",
      occasions: "Mother's Day, Father's Day, Housewarming, Birthday, Thank You",
      recipientTypes: "Mom, Dad, Friend, Colleague, Couple",
      interests: "Tea lover, Gourmet flavors, Relaxation, Ceylon heritage",
      giftTypes: "Thoughtful, Luxurious, Useful",
      minBudget: 4000,
      maxBudget: 7000,
      isFeatured: true,
      isActive: true,
      viewsCount: 330,
      clicksCount: 84,
    },

    // The Chocolate Factory Products
    {
      shopId: shopMap["the-chocolate-factory"],
      name: "Handcrafted Single-Origin Praline Collection (16-Piece)",
      slug: "handcrafted-single-origin-praline-collection",
      description: "Artisan chocolate gems hand-painted with colored cocoa butter. Flavors include Ceylon Cinnamon Ganache, Passionfruit Gelee, Kandy Salted Caramel, and Pistachio Cream.",
      price: 4500,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Chocolates & Sweets",
      tags: "chocolates, pralines, truffles, gourmet, romantic, girlfriend, sweet tooth, under 5000",
      occasions: "Valentine's Day, Anniversary, Birthday, Thank You",
      recipientTypes: "Girlfriend, Boyfriend, Wife, Husband, Friend",
      interests: "Chocolates, Gourmet food, Sweets, Romantic dates",
      giftTypes: "Romantic, Delicious, Cute, Luxurious",
      minBudget: 3500,
      maxBudget: 6000,
      isFeatured: true,
      isActive: true,
      viewsCount: 460,
      clicksCount: 135,
    },

    // Negombo Clay & Pottery Products
    {
      shopId: shopMap["negombo-clay"],
      name: "Speckled White Wheel-Thrown Coffee Mug",
      slug: "speckled-white-wheel-thrown-mug",
      description: "Chunky ergonomic ceramic mug with comfortable thumb rest, handcrafted from local Negombo river clay with white speckled matte glaze.",
      price: 2200,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Handmade & Crafts",
      tags: "ceramic mug, pottery, coffee, affordable, under 3000, handmade, colleague, friend",
      occasions: "Birthday, Housewarming, Thank You, Just Because",
      recipientTypes: "Friend, Colleague, Brother, Sister, Mom",
      interests: "Coffee, Minimalist pottery, Daily essentials",
      giftTypes: "Useful, Cute, Thoughtful",
      minBudget: 1500,
      maxBudget: 3000,
      isFeatured: false,
      isActive: true,
      viewsCount: 190,
      clicksCount: 42,
    },

    // Galle Fort Perfumerie Products
    {
      shopId: shopMap["galle-fort-perfumerie"],
      name: "Dutch Fort Spice & Sea Mist Eau De Parfum (50ml)",
      slug: "dutch-fort-spice-sea-mist-edp",
      description: "Crisp ocean air accord infused with freshly grated Ceylon cinnamon, pink peppercorns, crushed lime, and wild driftwood in an elegant French glass flacon.",
      price: 8500,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Perfumes & Scents",
      tags: "perfume, cologne, edp, luxury fragrance, galle fort, ocean scent, boyfriend, husband",
      occasions: "Birthday, Anniversary, Valentine's Day, Father's Day",
      recipientTypes: "Boyfriend, Husband, Brother, Dad, Friend",
      interests: "Fragrances, Luxury lifestyle, Ocean & travel",
      giftTypes: "Luxurious, Romantic, Thoughtful",
      minBudget: 7000,
      maxBudget: 12000,
      isFeatured: true,
      isActive: true,
      viewsCount: 310,
      clicksCount: 79,
    },

    // Kandy Craft & Silks Products
    {
      shopId: shopMap["kandy-craft-silks"],
      name: "Hand-Painted Kandyan Lotus Silk Scarf",
      slug: "hand-painted-kandyan-lotus-silk-scarf",
      description: "100% pure Habotai silk scarf hand-painted with ancient sacred lotus motifs by master batik artists in Kandy. Featherlight, breathable and vibrant.",
      price: 6800,
      currency: "LKR",
      imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80"
      ]),
      category: "Fashion & Bags",
      tags: "silk scarf, batik, hand painted, kandy, mom gift, mother, wife, traditional, elegant",
      occasions: "Mother's Day, Birthday, Anniversary, Wedding",
      recipientTypes: "Mom, Wife, Sister, Friend",
      interests: "Traditional art, Silk fashion, Heritage crafts",
      giftTypes: "Luxurious, Thoughtful, Romantic",
      minBudget: 5000,
      maxBudget: 9000,
      isFeatured: false,
      isActive: true,
      viewsCount: 205,
      clicksCount: 49,
    }
  ];
}

async function main() {
  console.log("🌱 Seeding Giftly database...");

  // 1. Clean existing data
  await prisma.analyticsEvent.deleteMany({});
  await prisma.savedListItem.deleteMany({});
  await prisma.savedList.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.recipientProfile.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.shop.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.occasion.deleteMany({});

  console.log("✨ Cleaned existing records");

  // 2. Insert Categories
  for (const cat of CATEGORIES) {
    await prisma.category.create({ data: cat });
  }
  console.log(`✅ Seeded ${CATEGORIES.length} Categories`);

  // 3. Insert Occasions
  for (const occ of OCCASIONS) {
    await prisma.occasion.create({ data: occ });
  }
  console.log(`✅ Seeded ${OCCASIONS.length} Occasions`);

  // 4. Create Demo Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@giftly.lk",
      role: "ADMIN",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    }
  });

  const shopOwnerUser = await prisma.user.create({
    data: {
      name: "Kasun Jayawardena (Bloom House)",
      email: "partner@bloomhouse.lk",
      role: "SHOP_OWNER",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    }
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "Siluni Silva",
      email: "siluni@example.com",
      role: "USER",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    }
  });
  console.log("✅ Seeded Demo Users (Admin, Shop Owner, User)");

  // 5. Insert Shops
  const shopMap: Record<string, string> = {};
  for (const shopData of SHOPS) {
    const isBloom = shopData.slug === "bloom-house";
    const createdShop = await prisma.shop.create({
      data: {
        ...shopData,
        ownerId: isBloom ? shopOwnerUser.id : undefined,
      }
    });
    shopMap[createdShop.slug] = createdShop.id;
  }
  console.log(`✅ Seeded ${SHOPS.length} Sri Lankan Shops`);

  // 6. Insert Products
  const products = generateProducts(shopMap);
  const createdProducts = [];
  for (const prodData of products) {
    const product = await prisma.product.create({ data: prodData });
    createdProducts.push(product);
  }
  console.log(`✅ Seeded ${products.length} Rich Gift Products`);

  // 7. Seed Sample Recipient Profiles for Regular User
  await prisma.recipientProfile.create({
    data: {
      userId: regularUser.id,
      name: "My Girlfriend ❤️",
      relationship: "Girlfriend",
      ageGroup: "20s",
      interests: "Skincare, Flowers, Cute stationery, Coffee & Chocolates",
      preferredStyles: "Cute, Romantic, Aesthetic",
      minBudget: 3000,
      maxBudget: 8000,
      birthday: "May 14",
      notes: "Loves pastel pinks, rose scented things and artisan desserts!",
    }
  });

  await prisma.recipientProfile.create({
    data: {
      userId: regularUser.id,
      name: "Amma (Mom) 💐",
      relationship: "Mom",
      ageGroup: "50s",
      interests: "Ayurvedic wellness, Herbal teas, Handloom crafts, Gardening",
      preferredStyles: "Useful, Thoughtful, Traditional",
      minBudget: 4000,
      maxBudget: 12000,
      birthday: "November 28",
      notes: "Prefers Spa Ceylon wellness products or organic teas.",
    }
  });

  await prisma.recipientProfile.create({
    data: {
      userId: regularUser.id,
      name: "Bestie Kasun ☕",
      relationship: "Friend",
      ageGroup: "20s",
      interests: "Coffee, Tech gadgets, Desk setups, Books",
      preferredStyles: "Useful, Minimalist",
      minBudget: 2500,
      maxBudget: 6000,
      birthday: "August 10",
      notes: "Loves speciality roast coffees and unique desk notebooks.",
    }
  });
  console.log("✅ Seeded Recipient Profiles");

  // 8. Seed Favorites
  if (createdProducts.length >= 3) {
    await prisma.favorite.create({
      data: {
        userId: regularUser.id,
        productId: createdProducts[0].id,
      }
    });
    await prisma.favorite.create({
      data: {
        userId: regularUser.id,
        productId: createdProducts[3].id,
      }
    });
    await prisma.favorite.create({
      data: {
        userId: regularUser.id,
        shopId: shopMap["bloom-house"],
      }
    });
  }

  // 9. Seed Saved Lists
  const savedList = await prisma.savedList.create({
    data: {
      userId: regularUser.id,
      title: "Girlfriend Birthday Ideas 🎂",
      description: "Curated gift shortlist for May birthday surprise",
      isPublic: true,
    }
  });

  if (createdProducts.length >= 2) {
    await prisma.savedListItem.create({
      data: {
        listId: savedList.id,
        productId: createdProducts[0].id,
      }
    });
    await prisma.savedListItem.create({
      data: {
        listId: savedList.id,
        productId: createdProducts[6].id,
      }
    });
  }

  // 10. Seed Analytics Events
  const events = [
    { eventType: "SEARCH_QUERY", query: "birthday gift for girlfriend under 5000" },
    { eventType: "SEARCH_QUERY", query: "flowers colombo" },
    { eventType: "SEARCH_QUERY", query: "skincare set for mom" },
    { eventType: "PRODUCT_VIEW", entityId: createdProducts[0]?.id, entityType: "product" },
    { eventType: "OUTBOUND_WHATSAPP", entityId: shopMap["bloom-house"], entityType: "shop" },
    { eventType: "OUTBOUND_INSTAGRAM", entityId: shopMap["spa-ceylon"], entityType: "shop" },
    { eventType: "OUTBOUND_WEBSITE", entityId: shopMap["mimosa"], entityType: "shop" },
  ];

  for (const evt of events) {
    await prisma.analyticsEvent.create({ data: evt });
  }

  console.log("🚀 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
