import React, { useEffect, useMemo, useState, useRef, Suspense, lazy } from "react";
import {
  Search, ShoppingBag, ArrowUpRight, Sparkles, Menu, X, Plus, Minus,
  SlidersHorizontal, LayoutDashboard, Package, ShoppingCart, Users,
  Settings, Trash2, Pencil, Eye, ChevronDown, Check, Heart, Truck,
  ShieldCheck, Gift, Sprout, Paintbrush, Coffee, LogOut, ExternalLink,
  CircleHelp, TrendingUp, MoreHorizontal, ImagePlus, Save, Mail, MapPin,
  Clock, HelpCircle, FileText, ArrowLeft, Star, Share2, Play, Pause, Volume2, VolumeX,
  QrCode, Printer, MessageSquare, Download, CreditCard
} from "lucide-react";
import { money, readStore, adminStatusLabel, SUPPORTED_CURRENCIES } from "./lib/utils";
import { runViewTransition } from "./lib/viewTransitions";
import { AnukoolLoadingSpinner } from "./components/AnukoolLayout";
import { Newsletter } from "./components/Newsletter";
import { ProductCard } from "./components/ProductCard";
import { buildUpiUrl, generateUpiQrSvg, DEFAULT_VPA, getPaymentConfig } from "./lib/paymentEngine";
import { generateConsignmentRecord, buildWhatsAppDispatchUrl } from "./lib/dispatchEngine";

// Lazy-loaded subpages for high performance & instant initial load
const ProductPage = lazy(() => import("./pages/ProductPage"));
const OurStoryPage = lazy(() => import("./pages/OurStoryPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const BrandAssetsPage = lazy(() => import("./pages/BrandAssetsPage"));
const AdminSection = lazy(() => import("./pages/AdminSection"));
const GiftConciergeModal = lazy(() => import("./components/GiftConciergeModal"));
const BlockPrintSimulatorModal = lazy(() => import("./components/BlockPrintSimulatorModal"));
const InvoiceModal = lazy(() => import("./components/InvoiceModal"));
const DispatchCenterModal = lazy(() => import("./components/DispatchCenterModal"));

const seedProducts = [
  // Anukool — Handcrafted block-printed fabric DIY craft kits from Jaipur
  {
    id: 1,
    name: 'Anukool Diwali Light-Making Kit',
    category: 'Gifting & Fabric',
    price: 699,
    mrp: 999,
    rating: 4.9,
    reviewsCount: 142,
    emoji: '🪔',
    image: '/anukool-assets/1_443e4d06-c435-4199-befb-2892b9cfb4a8.png',
    images: [
      '/anukool-assets/1_443e4d06-c435-4199-befb-2892b9cfb4a8.png',
      '/anukool-assets/1_13892dfb-841d-4432-a2be-685fbaacd876.jpg',
      '/anukool-assets/DT-1.jpg',
      '/anukool-assets/DT-2.jpg'
    ],
    video: '/anukool-assets/AQOxdeN6bVJequURyl0y12FuBT4zAUal3pKs59s5-bEG494PgXTWKw-0htYDviq9IHjZiLliXun96QVN6qMvyv1rNPxMZVRrOozk6Gw.mp4',
    color: '#fde68a',
    tag: 'Festival favourite',
    stock: 45,
    description: 'Create two beautiful reusable fabric-covered diyas with Jaipur block-printed panels and warm LED tea lights. A festive, heartwarming project to illuminate Diwali with handmade meaning.',
    components: 'Pre-cut fabric panels (2 sets), Plain fabric sleeves (2), LED tea lights with batteries (2), Decorative golden zari thread, Brass-finish mirrors (12), Step-by-step guidebook, Gift box',
    materials: '100% Pure Jaipur Cotton (Block-printed front, plain base), Glass embellishments, LED tea lights',
    dimensions: '4" diameter x 3" height each finished diya',
    customization: 'Choice of 2 heritage block-printed patterns. Personalizable base plate with name or festive date.',
    craftTime: '45–60 mins',
    difficulty: 'Beginner friendly (Ages 8+)'
  },
  {
    id: 2,
    name: 'Anukool Rakhi Bonding Kit',
    category: 'Gifting & Fabric',
    price: 599,
    mrp: 849,
    rating: 4.8,
    reviewsCount: 98,
    emoji: '🧵',
    image: '/images/products/rakhi-kit-1.jpg',
    images: [
      '/images/products/rakhi-kit-1.jpg',
      '/images/products/rakhi-kit-2.jpg',
      '/images/products/rakhi-kit-3.jpg'
    ],
    video: '/anukool-assets/AQNlwv2Sp_WtDJnHG_JFw05RUqRDj-YZQx4TrJL7zWC2BFHgM-JqKyU53lYdMMlwmajgTLOKV-gjjcYXoME25R2_dz3tc1pPgcnmuZM.mp4',
    color: '#fca5a5',
    tag: 'Celebration kit',
    stock: 38,
    description: 'Create a cherished bond with coordinating block-printed rakhi and friendship bracelet sets. Handcrafted textiles made for memorable celebration and lasting connection.',
    components: 'Pre-cut block-printed fabric strips (2 sets), Elastic craft cord, Decorative embroidery thread, Ceramic & glass beads, Wool pompoms, Instruction guide, Presentation gift box',
    materials: 'Cotton block-printed accents, Hand-dyed wool pompoms, Elastic cords, Wooden beads',
    dimensions: 'Rakhi: 8" length adjustable, Bracelet: 7" length adjustable',
    customization: 'Choice of 2 festive color palettes. Personalizable patch for brother/sister initials.',
    craftTime: '40–55 mins',
    difficulty: 'Easy (Ages 6+)'
  },
  {
    id: 3,
    name: 'Anukool Everyday Gratitude Journal Kit',
    category: 'Gifting & Fabric',
    price: 799,
    mrp: 1199,
    rating: 4.9,
    reviewsCount: 164,
    emoji: '📓',
    image: '/images/products/gratitude-kit-1.jpg',
    images: [
      '/images/products/gratitude-kit-1.jpg',
      '/images/products/gratitude-kit-2.jpg',
      '/images/products/gratitude-kit-3.jpg'
    ],
    video: '/anukool-assets/AQO7JPlzMe2F6dq0_65coQSh1HUC16BafNmwdM6byLEQcyCzE5-2huu-gkmBQU54RfhCXLvCB_kTxenx8pd4wUe_GkIf3WuAB7KODAA.mp4',
    color: '#c4b5fd',
    tag: 'Bestseller',
    stock: 32,
    description: 'Bind and cover your own fabric gratitude journal using heritage block prints from Rajasthan. Includes 120 smooth acid-free pages, a brass pen, and a handcrafted artisan tassel.',
    components: 'Hardcover journal core (120 pages, 100 GSM), Pre-cut Jaipur cotton cover, Metal craft pen, Cotton bookmark tassel, Brass keepsake charm, Ribbon closure, Illustrated booklet, Gift box',
    materials: 'Sanganer block-printed cotton, Recycled cotton pulp paper, Brass hardware',
    dimensions: '6" x 8" x 1" hardcover journal',
    customization: 'Choice of 2 botanical block print covers. Embossed title area for recipient name.',
    craftTime: '60–75 mins',
    difficulty: 'Beginner (No binding tools needed)'
  },
  {
    id: 4,
    name: 'Anukool Valentine Love Kit',
    category: 'Gifting & Fabric',
    price: 699,
    mrp: 999,
    rating: 4.7,
    reviewsCount: 76,
    emoji: '💕',
    image: '/images/products/wedding-kit-1.jpg',
    images: [
      '/images/products/wedding-kit-1.jpg',
      '/images/products/wedding-kit-2.jpg',
      '/images/products/wedding-kit-3.jpg'
    ],
    video: '/anukool-assets/AQN6YZEwB-XhNFwNM-N7l_KzIkycwvj4wzSCtEokTDqZapLEJD3mDF6YrpNfhe8vfkb_VwkBmqYacBp-gUMpkqBx3p5Mvlb6-X2xMcg.mp4',
    color: '#fbcfe8',
    tag: 'Made for two',
    stock: 28,
    description: 'Create matching couple accessories using coordinating Jaipur prints. Craft two keepsake keychains, fabric coasters, or zip pouches together on your next date night.',
    components: 'Pre-cut block-printed fabric components (2 sets), Metal keyrings, Natural cork coaster bases (2), Nylon zippers, Needle & embroidery thread, Instruction booklet, Gift box',
    materials: 'Block-printed cotton canvas, Natural Portuguese cork, Vintage brass hardware',
    dimensions: 'Variable by project (approx 3" to 4" each finished piece)',
    customization: 'Choose from 3 projects (Coasters, Keychains, or Pouches). Includes date tag stamps.',
    craftTime: '50–65 mins',
    difficulty: 'Date night friendly (Zero experience)'
  },
  {
    id: 5,
    name: "Anukool Mother's / Father's Day Kit",
    category: 'Gifting & Fabric',
    price: 749,
    mrp: 1049,
    rating: 4.8,
    reviewsCount: 88,
    emoji: '🎁',
    image: '/images/products/festival-kit-1.jpg',
    images: [
      '/images/products/festival-kit-1.jpg',
      '/images/products/festival-kit-2.jpg',
      '/images/products/festival-kit-3.jpg'
    ],
    color: '#fed7aa',
    tag: 'Heartfelt gift',
    stock: 24,
    description: 'Craft a personalized textile gift for mom or dad. Choose from an artisan chef apron, book tote bag, or handcrafted cushion cover with block-printed accents.',
    components: 'Pre-cut heavy cotton fabric components, Cotton webbing handles, Antique brass grommets, Embroidery thread, Cotton iron-on label, Instruction booklet, Gift presentation box',
    materials: 'Heavyweight organic cotton duck, Block-printed pocket trim, Brass hardware',
    dimensions: 'Finished piece: approx 14" x 16" (Tote) / 24" x 30" (Apron)',
    customization: 'Choice of 3 styles (Apron, Tote bag, or Cushion). Includes personalizable embroidered patch.',
    craftTime: '60–90 mins',
    difficulty: 'Beginner friendly'
  },
  {
    id: 6,
    name: 'Anukool House Warming Textile Kit',
    category: 'Gifting & Fabric',
    price: 649,
    mrp: 899,
    rating: 4.8,
    reviewsCount: 64,
    emoji: '🏡',
    image: '/images/products/wedding-kit-2.jpg',
    images: [
      '/images/products/wedding-kit-2.jpg',
      '/images/products/wedding-kit-3.jpg',
      '/images/products/wedding-kit-1.jpg'
    ],
    color: '#bbf7d0',
    tag: 'New home craft',
    stock: 25,
    description: 'Create an artistic home textile to celebrate a new dwelling. Make a wall hanging with turned wooden dowel, a dining table runner, or a 4-piece coaster set.',
    components: 'Pre-cut block-printed panels, Natural teakwood dowel rod, Cotton hanging cord, Brass rings, Glass beads, Tassels, Instruction guide, Presentation box',
    materials: 'Pure natural cotton, Indian teakwood dowel, 100% cotton cords',
    dimensions: 'Wall hanging: 12" x 18" / Coasters: 4" x 4"',
    customization: 'Choice of wall art or dining set. Personalizable date and house number tags.',
    craftTime: '45–60 mins',
    difficulty: 'Easy & relaxing'
  },
  {
    id: 7,
    name: 'Anukool Digital Pattern Subscription',
    category: 'Gifting & Fabric',
    price: 199,
    mrp: 299,
    rating: 4.6,
    reviewsCount: 112,
    emoji: '🖥️',
    image: '/images/product1.png',
    images: ['/images/product1.png'],
    color: '#bae6fd',
    tag: 'Monthly drops',
    stock: 999,
    description: 'Monthly access to exclusive Anukool heritage block-printed patterns (PDF) plus master artisan video tutorials and creative project guides.',
    components: 'High-resolution PDF printable patterns, 4K video masterclasses, Technique sheets, Community maker portal access',
    materials: 'Digital delivery (instant download)',
    dimensions: 'Printable A4 / US Letter templates',
    customization: 'Monthly updates with seasonal Indian festive themes.',
    craftTime: 'Self-paced',
    difficulty: 'All skill levels'
  },
  {
    id: 8,
    name: 'Anukool Project Refill Pack',
    category: 'Gifting & Fabric',
    price: 299,
    mrp: 449,
    rating: 4.7,
    reviewsCount: 83,
    emoji: '🔄',
    image: '/images/products/diwali-kit-2.jpg',
    images: [
      '/images/products/diwali-kit-2.jpg',
      '/images/products/diwali-kit-3.jpg',
      '/images/products/diwali-kit-1.jpg'
    ],
    color: '#e5e7eb',
    tag: 'Eco refill',
    stock: 60,
    description: 'Keep the creativity going! Replenish fabrics, tea lights, cords, and embellishments for your favourite Anukool kit without rebuying tools.',
    components: 'Fresh pre-cut block-printed fabric panels (2 sets), Plain lining, Decorative zari threads, 2 fresh LED lights, Extra embellishment pack',
    materials: 'Pure cotton fabric panels, LED lights, Decorative trims',
    dimensions: 'Matches original kit dimensions',
    customization: 'Available for Diwali, Rakhi, and Gratitude Journal kits.',
    craftTime: 'Replenishment pack',
    difficulty: 'Repeat makers'
  },
  {
    id: 9,
    name: 'Anukool Artisan Series — Jaipur Heritage',
    category: 'Gifting & Fabric',
    price: 899,
    mrp: 1299,
    rating: 4.9,
    reviewsCount: 52,
    emoji: '🎨',
    image: '/images/products/festival-kit-2.jpg',
    images: [
      '/images/products/festival-kit-2.jpg',
      '/images/products/festival-kit-3.jpg',
      '/images/products/festival-kit-1.jpg'
    ],
    color: '#fef3c7',
    tag: 'Limited edition',
    stock: 15,
    description: 'Exclusive, limited-run kit showcasing rare double-block printing from master artisans of Sanganer, Jaipur. Includes numbered certificate and artisan biography.',
    components: 'Numbered double-block printed Sanganeri fabric, Plant-dyed threads, Wooden needles, Story card, Certificate of Authenticity, Collector gift box',
    materials: 'Rare vegetable-dyed cotton, Hand-carved wooden tools',
    dimensions: '14" x 14" master collector panel',
    customization: 'Numbered limited run (batch of only 150 kits per season).',
    craftTime: '75–90 mins',
    difficulty: 'Collector level (Complete guide included)'
  },
  {
    id: 10,
    name: 'Anukool Quarterly Craft Box',
    category: 'Gifting & Fabric',
    price: 599,
    mrp: 899,
    rating: 4.8,
    reviewsCount: 94,
    emoji: '📦',
    image: '/images/product2.png',
    images: ['/images/product2.png', '/images/product1.png'],
    color: '#d1fae5',
    tag: 'Seasonal club',
    stock: 22,
    description: 'A seasonal curated box containing one premier Anukool craft kit, exclusive artisan textile samples, a mystery maker surprise, and access to live crafting circles.',
    components: 'Full premier kit, Seasonal fabric swatches (4), Surprise artisan craft bonus, Printed maker zine, Collectible postcard',
    materials: 'Varies with seasonal Indian festival theme',
    dimensions: '10" x 8" x 3" gift box',
    customization: 'Delivered every 3 months with new themes.',
    craftTime: 'Seasonal delight',
    difficulty: 'All makers'
  },
  // Creative Companion Kits (Rich real photos & videos from kitsters-fresh)
  {
    id: 11,
    name: 'DIY Mini Canvas Painting Kit',
    category: 'Art & Craft',
    price: 499,
    mrp: 699,
    rating: 4.8,
    reviewsCount: 71,
    emoji: '🖼️',
    image: '/anukool-assets/1_89c38a9b-e776-49f1-81c4-98775601e9be.png',
    images: ['/anukool-assets/1_89c38a9b-e776-49f1-81c4-98775601e9be.png'],
    color: '#f4d46b',
    tag: 'Bestseller',
    stock: 28,
    description: 'A pocket-sized painting adventure with wooden display easel, primed stretched canvas, acrylic paints, and fine detail brushes.'
  },
  {
    id: 12,
    name: 'DIY Light Bottle Painting Kit',
    category: 'Art & Craft',
    price: 999,
    mrp: 1399,
    rating: 4.9,
    reviewsCount: 86,
    emoji: '🏮',
    image: '/anukool-assets/1_7efc72d0-9cd2-419f-87e0-b70898ce994d.png',
    images: [
      '/anukool-assets/1_7efc72d0-9cd2-419f-87e0-b70898ce994d.png',
      '/anukool-assets/159-1_7efc72d0-9cd2-419f-87e0-b70898ce994d.png'
    ],
    video: '/anukool-assets/AQMrefUXDYZVP6oBAmEziscRXCPlGCoJ0e4zrcxvvdq40R_q7c7TdTwWR-S8G66nF98rfc_N-IFRdvVX142bxKxkly7k0hE4bXAHc2w.mp4',
    color: '#f7d9d4',
    tag: 'Maker favourite',
    stock: 16,
    description: 'Paint an upcycled glass bottle with translucent glass paints, add warm cork fairy lights, and make your cozy corner glow.'
  },
  {
    id: 13,
    name: 'DIY Clay Sculpting & Pottery Kit',
    category: 'Art & Craft',
    price: 1999,
    mrp: 2699,
    rating: 4.8,
    reviewsCount: 43,
    emoji: '🏺',
    image: '/anukool-assets/1_c534a052-cbca-4ca1-9001-271bfea19354.jpg',
    images: ['/anukool-assets/1_c534a052-cbca-4ca1-9001-271bfea19354.jpg'],
    color: '#d9d2ed',
    tag: 'Get hands-on',
    stock: 12,
    description: 'Air-dry pottery clay, sculpting tools, glossy waterproof sealant, and earthy mineral paints for beginner home ceramics with zero kiln required.'
  },
  {
    id: 14,
    name: 'DIY Floral Glow Jar Kit',
    category: 'Home Decor',
    price: 1299,
    mrp: 1799,
    rating: 4.9,
    reviewsCount: 57,
    emoji: '🌸',
    image: '/anukool-assets/1_9dd6693e-6528-4ff3-8faf-0a0551c90893.png',
    images: ['/anukool-assets/1_9dd6693e-6528-4ff3-8faf-0a0551c90893.png'],
    color: '#fbcfe8',
    tag: 'Glowing craft',
    stock: 18,
    description: 'Arrange dried botanicals, gold leaf accents, and micro fairy lights inside a fluted apothecary jar for a magical bedside glow.'
  },
  {
    id: 15,
    name: 'DIY Cotton Candy Maker Kit',
    category: 'Food',
    price: 2499,
    mrp: 3299,
    rating: 4.8,
    reviewsCount: 48,
    emoji: '🍭',
    image: '/anukool-assets/1_165a2177-216d-4196-9960-e46e329eb3a6.png',
    images: ['/anukool-assets/1_165a2177-216d-4196-9960-e46e329eb3a6.png'],
    color: '#cfe1c2',
    tag: 'Party hit',
    stock: 14,
    description: 'Spin fluffy carnival cotton candy at home with organic flavoured sugar crystals, safety splash guard, and reusable paper cones.'
  },
  {
    id: 16,
    name: 'DIY Cement & Terrazzo Coaster Kit',
    category: 'Home Decor',
    price: 1499,
    mrp: 1999,
    rating: 4.9,
    reviewsCount: 67,
    emoji: '🪴',
    image: '/anukool-assets/Homepage-diy-station-3.jpg',
    images: ['/anukool-assets/Homepage-diy-station-3.jpg'],
    color: '#c7d9df',
    tag: 'Make & keep',
    stock: 14,
    description: 'Cast modern geometric coasters with quick-set white cement, coloured mineral pigment chips, and silicone moulds.'
  },
  {
    id: 17,
    name: 'DIY Mini Desk Terrarium Kit',
    category: 'Gardening',
    price: 999,
    mrp: 1399,
    rating: 4.7,
    reviewsCount: 49,
    emoji: '🌿',
    image: '/anukool-assets/Homepage-diy-station-1.jpg',
    images: ['/anukool-assets/Homepage-diy-station-1.jpg'],
    color: '#cfe1c2',
    tag: 'Slow Sunday',
    stock: 25,
    description: 'Build a tiny living glass world with succulent cuttings, activated charcoal, river pebbles, and nutrient soil.'
  },
  {
    id: 18,
    name: 'DIY Wooden Fridge Magnet Craft Kit',
    category: 'Art & Craft',
    price: 1199,
    mrp: 1599,
    rating: 4.8,
    reviewsCount: 37,
    emoji: '🧲',
    image: '/anukool-assets/Homepage-diy-station-4.jpg',
    images: ['/anukool-assets/Homepage-diy-station-4.jpg'],
    color: '#f5c4ad',
    tag: 'Group activity',
    stock: 18,
    description: 'Pre-cut wooden shapes, strong neodymium magnets, vibrant acrylic paints, and markers for custom fridge art.'
  },
  {
    id: 19,
    name: 'DIY Botanical Perfume & Scent Kit',
    category: 'Home Decor',
    price: 3999,
    mrp: 4999,
    rating: 4.9,
    reviewsCount: 28,
    emoji: '🧴',
    image: '/anukool-assets/1_f9aff231-fa53-4683-9b31-c526813f6782.png',
    images: ['/anukool-assets/1_f9aff231-fa53-4683-9b31-c526813f6782.png'],
    color: '#ead6ec',
    tag: 'A little luxury',
    stock: 7,
    description: 'Explore natural essential oil notes, botanical fixatives, and glass dropper bottles to create a signature scent.'
  },
  {
    id: 20,
    name: 'Grow in a Can — Sacred Basil',
    category: 'Gardening',
    price: 549,
    mrp: 749,
    rating: 4.8,
    reviewsCount: 89,
    emoji: '🌱',
    image: '/anukool-assets/Homepage-diy-station-5.jpg',
    images: ['/anukool-assets/Homepage-diy-station-5.jpg'],
    color: '#d8e7c9',
    tag: 'Easy grow',
    stock: 35,
    description: 'Eco tin with organic basil seeds, nutrient vermiculite, and a cheerful windowsill self-watering wick.'
  },
  {
    id: 21,
    name: 'DIY Cotton Canvas Tote Bag Kit',
    category: 'Art & Craft',
    price: 1199,
    mrp: 1599,
    rating: 4.9,
    reviewsCount: 61,
    emoji: '👜',
    image: '/anukool-assets/1_e5a77f72-e00a-49e4-91e0-ed76eb649855.png',
    images: ['/anukool-assets/1_e5a77f72-e00a-49e4-91e0-ed76eb649855.png'],
    color: '#e9d9c4',
    tag: 'Wear your art',
    stock: 11,
    description: 'Heavy natural cotton tote with stencil set, fabric paints, and liner brush to create wearable everyday art.'
  },
  {
    id: 22,
    name: 'DIY Heritage Ice Gola Kit',
    category: 'Food',
    price: 1750,
    mrp: 2299,
    rating: 4.7,
    reviewsCount: 44,
    emoji: '🍧',
    image: '/anukool-assets/1_132ee380-6b14-4842-8257-2ca5f843e4a6.png',
    images: ['/anukool-assets/1_132ee380-6b14-4842-8257-2ca5f843e4a6.png'],
    color: '#cbe7ee',
    tag: 'Sweet nostalgia',
    stock: 19,
    description: 'Hand ice crusher, authentic kala khatta & khus syrups, wooden sticks, and glass bowls for vintage summer nostalgia.'
  }
];

// Community Maker Video Reels Data
const communityReels = [
  {
    id: 'reel-1',
    video: '/anukool-assets/AQMrefUXDYZVP6oBAmEziscRXCPlGCoJ0e4zrcxvvdq40R_q7c7TdTwWR-S8G66nF98rfc_N-IFRdvVX142bxKxkly7k0hE4bXAHc2w.mp4',
    title: 'Bottle Painting Magic',
    quote: '"My living room feels like a bohemian cafe now."',
    maker: '@diy_by_priya',
    kitId: 12
  },
  {
    id: 'reel-2',
    video: '/anukool-assets/AQPgteZXfjIl2gH48taBYpKjJyCUkHBv6drkPVt7sX6KzpA4yocr3EtZNP1Wq7NeGmOVCjj7KLaf2sxAa_0LD6RPLjydMe3fdI70Wmk.mp4',
    title: 'Sunday Craft Session',
    quote: '"No screens. Just pure hands-on creative fun."',
    maker: '@crafting_delhi',
    kitId: 1
  },
  {
    id: 'reel-3',
    video: '/anukool-assets/AQPWqTUbshCsjfNDLr6ncOuIYZjkyajk8M56wcJVsWcUxFmwLXxGFaeuQg1k5_dW1lc9cCuL2T028_kbj08ajh4NLe-d9Hf2Tq1gnz4.mp4',
    title: 'Unboxing The Jaipur Box',
    quote: '"The block print fabric smelled so authentic!"',
    maker: '@maker_manan',
    kitId: 3
  },
  {
    id: 'reel-4',
    video: '/anukool-assets/AQOxdeN6bVJequURyl0y12FuBT4zAUal3pKs59s5-bEG494PgXTWKw-0htYDviq9IHjZiLliXun96QVN6qMvyv1rNPxMZVRrOozk6Gw.mp4',
    title: 'Diwali Diya Glow',
    quote: '"Making our own fabric diyas together for the festive season."',
    maker: '@ananya_home',
    kitId: 1
  }
];


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
async function api(path, options = {}) {
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) };
  const response = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...options, headers });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}
function App() {
  const [products, setProducts] = useState(() => {
    const stored = readStore('ank_products_v2', null);
    if (!stored || !Array.isArray(stored) || stored.length < seedProducts.length) {
      return seedProducts;
    }
    return stored;
  });
  const [backendReady, setBackendReady] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [admin, setAdmin] = useState(null);
  const [adminSummary, setAdminSummary] = useState({ orders: 0, products: 0, unitsInStock: 0, revenue: 0 });
  const [adminLoginError, setAdminLoginError] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiQrSvg, setUpiQrSvg] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India' });
  const [cart, setCart] = useState(() => readStore('ank_cart', {}));
  const [orders, setOrders] = useState(() => readStore('ank_orders', []));
  const [page, setPage] = useState('store');
  const [viewingProduct, setViewingProduct] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All prices');
  const [sort, setSort] = useState('Featured');
  const [cartOpen, setCartOpen] = useState(false);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [currency, setCurrency] = useState(() => readStore('ank_currency', 'INR'));
  const [wishlisted, setWishlisted] = useState(() => readStore('ank_wishlist', []));
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const [adminTab, setAdminTab] = useState('Overview');
  const [editing, setEditing] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', category: 'Gifting & Fabric', price: '', stock: '', emoji: '🪔', color: '#fde68a', tag: 'New', rating: 4.8, description: '' });
  const [orderFilter, setOrderFilter] = useState('All orders');

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartItems = Object.entries(cart).map(([id, qty]) => ({ product: products.find(p => p.id === Number(id)), qty })).filter(x => x.product);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  function navigate(targetPage, prod = null) {
    runViewTransition(() => {
      if (targetPage === 'product' && prod) {
        setViewingProduct(prod);
        setPage('product');
        window.location.hash = `product/${prod.id}`;
      } else {
        setPage(targetPage);
        if (targetPage === 'store') {
          window.location.hash = '';
        } else {
          window.location.hash = targetPage;
        }
      }
      setMobileNav(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Handle URL hash changes
  useEffect(() => {
    function handleHash() {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('product/')) {
        const id = Number(hash.split('/')[1]);
        const found = products.find(p => p.id === id);
        if (found) {
          setViewingProduct(found);
          setPage('product');
          return;
        }
      }
      if (['story', 'howitworks', 'faq', 'shipping', 'contact', 'admin', 'press', 'brand-assets'].includes(hash)) {
        setPage(hash === 'brand-assets' ? 'press' : hash);
      } else if (!hash) {
        setPage('store');
      }
    }
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [products]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const csrf = await api('/api/csrf');
        const catalog = await api('/api/products');
        const session = await api('/api/auth/me');
        if (!alive) return;
        setCsrfToken(csrf.csrfToken || '');
        if (catalog.products && catalog.products.length > 0) {
          setProducts(catalog.products);
        }
        setAdmin(session.admin || null);
        setBackendReady(true);
        if (session.admin) {
          const [allProducts, orderData, summary] = await Promise.all([api('/api/products/admin/all'), api('/api/admin/orders'), api('/api/admin/orders/summary')]);
          if (alive) { setProducts(allProducts.products || []); setOrders(orderData.orders || []); setAdminSummary(summary); }
        }
      } catch (e) {
        if (alive) setBackendReady(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => { localStorage.setItem('ank_products_v2', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('ank_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('ank_wishlist', JSON.stringify(wishlisted)); }, [wishlisted]);
  useEffect(() => { localStorage.setItem('ank_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('ank_currency', currency); }, [currency]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // Phase 4: Accessibility keyboard trap & Escape key dismiss
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (showDispatchModal) setShowDispatchModal(false);
        else if (showInvoice) setShowInvoice(false);
        else if (studioOpen) setStudioOpen(false);
        else if (giftModalOpen) setGiftModalOpen(false);
        else if (cartOpen) setCartOpen(false);
        else if (checkoutOpen) setCheckoutOpen(false);
        else if (confirmedOrder) setConfirmedOrder(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studioOpen, giftModalOpen, cartOpen, checkoutOpen, confirmedOrder, showInvoice, showDispatchModal]);

  // Generate dynamic UPI QR Code vector SVG when checkout opens or subtotal changes
  useEffect(() => {
    if (checkoutOpen) {
      const cfg = getPaymentConfig();
      const grandTotal = subtotal + (subtotal >= 999 ? 0 : 99);
      const upiUrl = buildUpiUrl({
        pa: cfg.upiVpa || DEFAULT_VPA,
        pn: cfg.merchantName || 'Anukool Jaipur',
        amount: grandTotal,
        orderId: `ANK-${Date.now().toString().slice(-6)}`,
        note: 'Handmade Anukool Craft Kit'
      });
      generateUpiQrSvg(upiUrl).then(svg => setUpiQrSvg(svg));
    }
  }, [checkoutOpen, subtotal]);

  const categories = ['All', 'Gifting & Fabric', 'Art & Craft', 'Food', 'Home Decor', 'Gardening'];
  const filteredProducts = useMemo(() => {
    let list = products.filter(p =>
      p.active !== false &&
      (category === 'All' || p.category === category) &&
      `${p.name} ${p.category} ${p.tag}`.toLowerCase().includes(query.toLowerCase()) &&
      (priceRange === 'All prices' || (priceRange === 'Under ₹500' ? p.price < 500 : priceRange === '₹500–₹1,000' ? p.price >= 500 && p.price <= 1000 : p.price > 1000))
    );
    if (sort === 'Price: low to high') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'Price: high to low') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'Top rated') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, category, query, priceRange, sort]);

  function notify(message) { setToast(message); }
  function addToCart(id, quantity = 1) { setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + quantity })); notify('Added to your bag ✦'); }
  function toggleWishlist(id) { setWishlisted(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); notify(wishlisted.includes(id) ? 'Removed from saved kits.' : 'Saved for later ♡'); }
  function changeQty(id, delta) {
    setCart(prev => {
      const next = { ...prev, [id]: (prev[id] || 0) + delta };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }

  function checkout() {
    if (!cartItems.length) return;
    setCheckoutError('');
    setCheckoutOpen(true);
  }

  function buyNow(product, quantity = 1) {
    setCart(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + quantity }));
    setCheckoutError('');
    setCheckoutOpen(true);
  }

  async function submitCheckout(e) {
    e.preventDefault();
    setCheckoutBusy(true);
    setCheckoutError('');

    const orderNum = `ANK-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalAmount = subtotal + (subtotal >= 999 ? 0 : 99);
    const consignment = generateConsignmentRecord(orderNum, customer.postalCode || '302001');

    if (paymentMethod === 'upi' || !backendReady) {
      setTimeout(() => {
        const newOrder = {
          id: Date.now(),
          orderNumber: orderNum,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customer: { ...customer },
          items: cartItems.map(i => ({ name: i.product.name, price: i.product.price, qty: i.qty })),
          total: totalAmount,
          subtotal: subtotal,
          status: 'paid',
          paymentStatus: 'captured',
          paymentMethod: paymentMethod === 'upi' ? 'UPI Instant (NPCI Intent)' : 'Credit/Debit Card (Test)',
          consignment,
          createdAt: new Date().toISOString()
        };
        setOrders(prev => [newOrder, ...prev]);
        setConfirmedOrder(newOrder);
        setCart({});
        setCheckoutOpen(false);
        setCartOpen(false);
        setCheckoutBusy(false);
        notify(`Order ${orderNum} confirmed with Jaipur workshop!`);
      }, 700);
      return;
    }

    try {
      const created = await api('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'x-csrf-token': csrfToken },
        body: JSON.stringify({ items: cartItems.map(i => ({ productId: i.product.id, quantity: i.qty })), customer })
      });
      const scriptLoaded = await new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
      if (!scriptLoaded) throw new Error('Could not load Razorpay Checkout. Please check your network connection.');
      setCheckoutBusy(false);
      const razorpay = new window.Razorpay({
        key: created.keyId,
        amount: created.amount,
        currency: created.currency,
        name: 'Anukool',
        description: `Order ${created.orderNumber}`,
        order_id: created.razorpayOrderId,
        prefill: created.customer,
        theme: { color: '#2E3A8A' },
        modal: { ondismiss: () => setCheckoutBusy(false) },
        handler: async (response) => {
          setCheckoutBusy(true);
          try {
            const verified = await api('/api/checkout/verify-payment', {
              method: 'POST',
              headers: { 'x-csrf-token': csrfToken },
              body: JSON.stringify({
                orderId: created.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const newOrder = {
              id: Date.now(),
              orderNumber: verified.orderNumber,
              customerName: customer.name,
              customerEmail: customer.email,
              customerPhone: customer.phone,
              customer: { ...customer },
              items: cartItems.map(i => ({ name: i.product.name, price: i.product.price, qty: i.qty })),
              total: totalAmount,
              subtotal: subtotal,
              status: 'paid',
              paymentStatus: 'captured',
              paymentMethod: 'Razorpay Gateway',
              consignment,
              createdAt: new Date().toISOString()
            };
            setOrders(prev => [newOrder, ...prev]);
            setConfirmedOrder(newOrder);
            setCart({});
            setCheckoutOpen(false);
            setCartOpen(false);
            setCustomer({ name: '', email: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India' });
            notify(`Payment verified for ${verified.orderNumber}.`);
            try { const result = await api('/api/products'); setProducts(result.products || []); } catch {}
          } catch (err) {
            setCheckoutError(err.message);
            notify(`Payment verification pending: ${err.message}`);
          } finally {
            setCheckoutBusy(false);
          }
        }
      });
      razorpay.on('payment.failed', (response) => {
        setCheckoutError(response.error?.description || 'Payment failed. Please try again.');
        setCheckoutBusy(false);
      });
      razorpay.open();
    } catch (err) {
      setCheckoutError(err.message);
      setCheckoutBusy(false);
    }
  }

  function startNewProduct() {
    setEditing(null);
    setProductForm({ name: '', category: 'Gifting & Fabric', price: '', stock: '', emoji: '🪔', color: '#fde68a', tag: 'New', rating: 4.8, description: '' });
    setAdminTab('Products');
  }
  function editProduct(p) {
    setEditing(p.id);
    setProductForm({ ...p, price: String(p.price), stock: String(p.stock) });
    setAdminTab('Products');
  }
  async function saveProduct(e) {
    e.preventDefault();
    const product = { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock), rating: Number(productForm.rating), active: true };
    if (!product.name.trim() || !product.price || product.price < 1) return notify('Enter a product name and valid price.');
    if (backendReady) {
      try {
        const result = await api(editing ? `/api/products/${editing}` : '/api/products', { method: editing ? 'PATCH' : 'POST', headers: { 'x-csrf-token': csrfToken }, body: JSON.stringify(product) });
        if (editing) setProducts(prev => prev.map(p => p.id === editing ? result.product : p)); else setProducts(prev => [result.product, ...prev]);
        notify(editing ? 'Product updated in database.' : 'Product added to database.');
      } catch (err) { notify(err.message); }
    } else {
      if (editing) {
        setProducts(prev => prev.map(p => p.id === editing ? { ...p, ...product } : p));
        notify('Product updated locally.');
      } else {
        const newP = { ...product, id: Date.now() };
        setProducts(prev => [newP, ...prev]);
        notify('Product added locally.');
      }
    }
    setEditing(null);
    setProductForm({ name: '', category: 'Gifting & Fabric', price: '', stock: '', emoji: '🪔', color: '#fde68a', tag: 'New', rating: 4.8, description: '' });
  }
  async function deleteProduct(id) {
    if (!window.confirm('Deactivate this product in the catalogue?')) return;
    if (backendReady) {
      try {
        await api(`/api/products/${id}`, { method: 'DELETE', headers: { 'x-csrf-token': csrfToken } });
      } catch (err) { notify(err.message); }
    }
    setProducts(prev => prev.filter(p => p.id !== id));
    notify('Product deactivated.');
  }
  async function updateOrderStatus(id, status) {
    if (backendReady) {
      try {
        const result = await api(`/api/admin/orders/${id}/status`, { method: 'PATCH', headers: { 'x-csrf-token': csrfToken }, body: JSON.stringify({ status }) });
        setOrders(prev => prev.map(o => o.id === id ? result.order : o));
      } catch (err) { notify(err.message); }
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    }
    notify('Order status updated.');
  }
  async function loginAdmin(e) {
    e.preventDefault();
    setAdminLoginError('');
    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const password = form.get('password');
    if (backendReady) {
      try {
        const result = await api('/api/auth/login', { method: 'POST', headers: { 'x-csrf-token': csrfToken }, body: JSON.stringify({ email, password }) });
        setAdmin(result.admin);
        setCsrfToken(result.csrfToken);
        const [catalog, ordersResult, summary] = await Promise.all([api('/api/products/admin/all'), api('/api/admin/orders'), api('/api/admin/orders/summary')]);
        setProducts(catalog.products || []);
        setOrders(ordersResult.orders || []);
        setAdminSummary(summary);
      } catch (err) { setAdminLoginError(err.message); }
    } else {
      if (email && password) {
        setAdmin({ name: 'Store Owner', email });
        notify('Logged into demo admin portal.');
      } else {
        setAdminLoginError('Please enter email and password.');
      }
    }
  }
  async function logoutAdmin() {
    if (backendReady) {
      try { await api('/api/auth/logout', { method: 'POST', headers: { 'x-csrf-token': csrfToken } }); } catch {}
    }
    setAdmin(null);
    navigate('store');
  }

  return (
    <div className="app-shell">
      {page === 'store' ? (
        <>
          <div className="announcement">
            CRAFTED FOR CONNECTION <span>✦</span> FREE PAN-INDIA SHIPPING ON ORDERS OVER ₹999 <span>✦</span> BLOCK-PRINTED IN JAIPUR
          </div>
          <header className="site-header">
            <a className="brand" href="#" onClick={e => { e.preventDefault(); navigate('store'); }}>
              anu<span>kool</span><i>.</i>
            </a>
            <nav className={mobileNav ? 'main-nav mobile-open' : 'main-nav'}>
              <a href="#shop" onClick={() => { setMobileNav(false); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}>SHOP ALL</a>
              <a href="#" onClick={e => { e.preventDefault(); setMobileNav(false); setGiftModalOpen(true); }} style={{ color: '#C75B39', fontWeight: 800 }}>✦ GIFT CONCIERGE</a>
              <a href="#" onClick={e => { e.preventDefault(); setMobileNav(false); setStudioOpen(true); }} style={{ color: '#2E3A8A', fontWeight: 800 }}>🎨 TRY BLOCK PRINTING</a>
              <a href="#" onClick={e => { e.preventDefault(); navigate('howitworks'); }}>HOW IT WORKS</a>
              <a href="#gifting" onClick={() => { setMobileNav(false); document.getElementById('gifting')?.scrollIntoView({ behavior: 'smooth' }); }}>GIFTING</a>
              <a href="#" onClick={e => { e.preventDefault(); navigate('story'); }}>OUR STORY</a>
              <a href="#" onClick={e => { e.preventDefault(); navigate('faq'); }}>FAQS</a>
              <a href="#" onClick={e => { e.preventDefault(); navigate('contact'); }}>CONTACT</a>
            </nav>
            <div className="header-actions">
              <div className="currency-selector-wrap" title="Change currency">
                <select
                  className="currency-select"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  aria-label="Select currency"
                >
                  {Object.values(SUPPORTED_CURRENCIES).map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                  ))}
                </select>
                <ChevronDown size={11} className="currency-chevron" />
              </div>
              <button className="concierge-nav-button" onClick={() => setGiftModalOpen(true)} aria-label="Open AI Gift Concierge">
                <Sparkles size={14}/> GIFT CONCIERGE ✦
              </button>
              <button className="icon-button search-shortcut" aria-label="Search" onClick={() => { document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); setTimeout(() => document.getElementById('store-search')?.focus(), 350); }}><Search size={19}/></button>
              <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Shopping bag with ${cartCount} items`}><ShoppingBag size={16}/> BAG <span>{cartCount}</span></button>
              <button className="icon-button menu-button" aria-label="Toggle navigation" onClick={() => setMobileNav(!mobileNav)}>{mobileNav ? <X/> : <Menu/>}</button>
            </div>
          </header>

          <main>
            <section className="hero wrap">
              <div className="hero-copy">
                <div className="eyebrow"><Sparkles size={14}/> CRAFTED FOR CONNECTION ✦ JAIPUR ARTISAN KITS</div>
                <h1>The gift of making. <em>The joy of giving.</em></h1>
                <p>Guided block-printed textile craft kits from Jaipur. Create meaningful handmade gifts for Diwali, Rakhi, birthdays, and every moment worth celebrating.</p>
                <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                  <a className="button dark-button" href="#shop">EXPLORE THE KITS <ArrowUpRight size={16}/></a>
                  <button className="artisan-studio-trigger" onClick={() => setStudioOpen(true)}>
                    <Paintbrush size={14}/> TRY BLOCK PRINTING ✦
                  </button>
                  <button className="button" style={{border:'1px solid #2E3A8A',color:'#2E3A8A',background:'transparent'}} onClick={() => navigate('howitworks')}>HOW IT WORKS <ArrowUpRight size={16}/></button>
                </div>
                <div className="hero-proof"><span>★★★★★</span> Loved by mindful makers across India</div>
              </div>
              <div className="hero-art" aria-label="Creative craft kit illustration">
                <img className="hero-illustration" src="/anukool-hero.svg" alt="Illustration of an Anukool craft kit box, block prints, and maker supplies" />
                <div className="hero-caption">HERITAGE BLOCK PRINTS<br/>JAIPUR, RAJASTHAN ↗</div>
              </div>
            </section>

            <div className="trust-row wrap">
              <div><Paintbrush/><span>Block-printed in Jaipur</span></div>
              <div><Heart/><span>Gifter-approved kits</span></div>
              <div><Package/><span>Everything in the box</span></div>
              <div><Truck/><span>Pan-India free delivery over ₹999</span></div>
            </div>

            {/* Community Maker Video Reels Wall */}
            <section className="reels-section">
              <div className="wrap">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow muted">COMMUNITY OF MAKERS</div>
                    <h2>Watch Anukool in action.</h2>
                    <p style={{ fontSize: 13, color: '#666', marginTop: 6, margin: 0 }}>
                      Real makers. Real stories. See how hands across India turn our kits into heartfelt keepsakes.
                    </p>
                  </div>
                </div>

                <div className="reels-grid">
                  {communityReels.map(reel => (
                    <ReelCard
                      key={reel.id}
                      reel={reel}
                      onOpenKit={() => {
                        const target = products.find(p => p.id === reel.kitId);
                        if (target) navigate('product', target);
                      }}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="section wrap" id="moods">
              <div className="section-heading">
                <div>
                  <div className="eyebrow muted">FOR EVERY MOMENT</div>
                  <h2>Shop by occasion & mood.</h2>
                </div>
                <a href="#shop" className="text-link" onClick={() => setCategory('All')}>EXPLORE ALL KITS <ArrowUpRight size={15}/></a>
              </div>
              <div className="mood-grid">
                <button className="mood-card mood-saffron" onClick={() => { setCategory('Gifting & Fabric'); document.getElementById('shop')?.scrollIntoView({behavior:'smooth'}); }}>
                  <span className="mood-emoji">🎁</span>
                  <span><strong>Gifting & Fabric</strong><small>Jaipur block prints with love.</small></span>
                  <ArrowUpRight/>
                </button>
                <button className="mood-card mood-green" onClick={() => { setCategory('Art & Craft'); document.getElementById('shop')?.scrollIntoView({behavior:'smooth'}); }}>
                  <span className="mood-emoji">🎨</span>
                  <span><strong>Get creative</strong><small>Paint, carve, sculpt, repeat.</small></span>
                  <ArrowUpRight/>
                </button>
                <button className="mood-card mood-yellow" onClick={() => { setCategory('Food'); document.getElementById('shop')?.scrollIntoView({behavior:'smooth'}); }}>
                  <span className="mood-emoji">🍜</span>
                  <span><strong>Make something tasty</strong><small>Pasta, sushi & kitchen magic.</small></span>
                  <ArrowUpRight/>
                </button>
                <button className="mood-card mood-pink" onClick={() => { setCategory('Home Decor'); document.getElementById('shop')?.scrollIntoView({behavior:'smooth'}); }}>
                  <span className="mood-emoji">🕯️</span>
                  <span><strong>Slow it down</strong><small>Coasters, scents & calm spaces.</small></span>
                  <ArrowUpRight/>
                </button>
                <button className="mood-card mood-lilac" onClick={() => { setCategory('Gardening'); document.getElementById('shop')?.scrollIntoView({behavior:'smooth'}); }}>
                  <span className="mood-emoji">🌱</span>
                  <span><strong>Grow your own</strong><small>Terrariums & kitchen herbs.</small></span>
                  <ArrowUpRight/>
                </button>
              </div>
            </section>

            <section className="section shop-section" id="shop">
              <div className="wrap">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow muted">THE COLLECTION</div>
                    <h2>Meet your next project.</h2>
                  </div>
                  <span className="result-label">{filteredProducts.length} HANDMADE FINDS</span>
                </div>
                <div className="shop-toolbar">
                  <div className="search-field">
                    <Search size={17}/>
                    <input id="store-search" aria-label="Search craft kits" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Diwali, Rakhi, journal, fabric kits…"/>
                    {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15}/></button>}
                  </div>
                  <div className="toolbar-right">
                    <SlidersHorizontal size={16}/>
                    <select aria-label="Filter by price" value={priceRange} onChange={e => setPriceRange(e.target.value)}>
                      <option>All prices</option>
                      <option>Under ₹500</option>
                      <option>₹500–₹1,000</option>
                      <option>₹1,000+</option>
                    </select>
                    <select aria-label="Sort products" value={sort} onChange={e => setSort(e.target.value)}>
                      <option>Featured</option>
                      <option>Price: low to high</option>
                      <option>Price: high to low</option>
                      <option>Top rated</option>
                    </select>
                  </div>
                </div>
                <div className="category-tabs">
                  {categories.map(c => (
                    <button key={c} className={category === c ? 'category-tab active' : 'category-tab'} onClick={() => setCategory(c)}>
                      {c === 'All' ? 'All the good stuff' : c}
                    </button>
                  ))}
                </div>
                <div className="product-grid">
                  {filteredProducts.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAdd={() => addToCart(p.id)}
                      onOpen={() => navigate('product', p)}
                      saved={wishlisted.includes(p.id)}
                      onSave={() => toggleWishlist(p.id)}
                      currency={currency}
                    />
                  ))}
                </div>
                {filteredProducts.length === 0 && (
                  <div className="empty-results">
                    <span>🧺</span>
                    <h3>No kits found matching your search.</h3>
                    <p>Try searching for Diwali, Rakhi, painting, or clear active filters.</p>
                    <button className="button dark-button" onClick={() => { setQuery(''); setCategory('All'); setPriceRange('All prices'); }}>CLEAR FILTERS</button>
                  </div>
                )}
              </div>
            </section>

            <section className="gift-banner wrap" id="gifting">
              <div className="gift-copy">
                <div className="eyebrow muted">THOUGHTFUL GIFTING</div>
                <h2>Give them a story,<br/>not just a thing.</h2>
                <p>For festivals, anniversaries, date nights, and heartfelt thank-yous. Anukool kits turn an ordinary evening into something you made with your own hands.</p>
                <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                  <a href="#shop" onClick={() => setCategory('Gifting & Fabric')} className="button dark-button">SHOP GIFTABLE KITS <ArrowUpRight size={16}/></a>
                  <button className="button" style={{border:'1px solid #1a2060',color:'#1a2060',background:'transparent'}} onClick={() => navigate('story')}>OUR JAIPUR STORY <ArrowUpRight size={16}/></button>
                </div>
              </div>
              <div className="gift-art">
                <div className="gift-circle">✳</div>
                <span>🎁</span>
                <div className="gift-note">CRAFTED FOR<br/>CONNECTION</div>
              </div>
            </section>

            <section className="newsletter wrap">
              <div>
                <div className="eyebrow muted">FROM THE WORKSHOP</div>
                <h2>Good ideas & seasonal drops.</h2>
                <p>Get early access to festive craft kits, artisan video tutorials, and special Jaipur textile patterns.</p>
              </div>
              <Newsletter onSubscribe={() => notify('Welcome to the Anukool Maker Circle ✦')}/>
            </section>
          </main>

          <footer className="site-footer" id="story">
            <div className="wrap">
              <div className="footer-grid">
                <div className="footer-brand">
                  <a className="brand light-brand" href="#" onClick={e => { e.preventDefault(); navigate('store'); }}>
                    anu<span style={{color:'#C75B39'}}>kool</span><i>.</i>
                  </a>
                  <p>Block-printed DIY textile kits from Jaipur. Designed to bridge traditional craft and the joy of modern gifting.</p>
                  <div className="social-dots"><span>ig</span><span>wa</span><span>in</span></div>
                </div>
                <div>
                  <strong>THE GOOD STUFF</strong>
                  <a href="#shop" onClick={() => { setCategory('All'); document.getElementById('shop')?.scrollIntoView({behavior:'smooth'}); }}>Shop all kits</a>
                  <a href="#shop" onClick={() => { setCategory('Gifting & Fabric'); document.getElementById('shop')?.scrollIntoView({behavior:'smooth'}); }}>Gifting & Fabric</a>
                  <a href="#gifting" onClick={() => document.getElementById('gifting')?.scrollIntoView({behavior:'smooth'})}>Festival gifts</a>
                  <a href="#shop" onClick={() => { setSort('Top rated'); document.getElementById('shop')?.scrollIntoView({behavior:'smooth'}); }}>Maker favourites</a>
                </div>
                <div>
                  <strong>OUR STORY</strong>
                  <a href="#" onClick={e => { e.preventDefault(); navigate('story'); }}>About Anukool</a>
                  <a href="#" onClick={e => { e.preventDefault(); navigate('howitworks'); }}>How it works</a>
                  <a href="#" onClick={e => { e.preventDefault(); navigate('story'); }}>Jaipur artisans</a>
                  <a href="#" onClick={e => { e.preventDefault(); navigate('story'); }}>Sustainability</a>
                </div>
                <div>
                  <strong>HELP & POLICIES</strong>
                  <a href="#" onClick={e => { e.preventDefault(); navigate('contact'); }}>Contact us</a>
                  <a href="#" onClick={e => { e.preventDefault(); navigate('shipping'); }}>Shipping & returns</a>
                  <a href="#" onClick={e => { e.preventDefault(); navigate('faq'); }}>FAQs</a>
                  <a href="#" onClick={e => { e.preventDefault(); navigate('press'); }}>Press &amp; Brand Assets</a>
                  <a href="mailto:hello@anukool.in">hello@anukool.in</a>
                </div>
              </div>
              <div className="footer-bottom">
                <span>© 2026 ANUKOOL. CRAFTED FOR CONNECTION.</span>
                <span>V K ENTERPRISES ✦ JAIPUR, RAJASTHAN</span>
              </div>
            </div>
          </footer>

          <button className="admin-shortcut" onClick={() => { setPage('admin'); setCartOpen(false); window.scrollTo(0, 0); }}>
            <Settings size={15}/> Store admin
          </button>
        </>
      ) : (
        <Suspense fallback={<AnukoolLoadingSpinner />}>
          {page === 'product' && viewingProduct ? (
            <ProductPage
              product={viewingProduct}
              products={products}
              onBack={() => navigate('store')}
              onAddToCart={qty => addToCart(viewingProduct.id, qty)}
              onBuyNow={qty => buyNow(viewingProduct, qty)}
              onSelectRelated={prod => navigate('product', prod)}
              isWishlisted={wishlisted.includes(viewingProduct.id)}
              onToggleWishlist={() => toggleWishlist(viewingProduct.id)}
              cartCount={cartCount}
              onOpenCart={() => setCartOpen(true)}
              currency={currency}
            />
          ) : page === 'story' ? (
            <OurStoryPage onBack={() => navigate('store')} onNavigate={navigate} />
          ) : page === 'howitworks' ? (
            <HowItWorksPage onBack={() => navigate('store')} onNavigate={navigate} />
          ) : page === 'faq' ? (
            <FAQPage onBack={() => navigate('store')} onNavigate={navigate} />
          ) : page === 'shipping' ? (
            <ShippingPage onBack={() => navigate('store')} onNavigate={navigate} />
          ) : page === 'contact' ? (
            <ContactPage onBack={() => navigate('store')} onNavigate={navigate} />
          ) : page === 'press' ? (
            <BrandAssetsPage onBack={() => navigate('store')} onNavigate={navigate} />
          ) : page === 'admin' ? (
            <AdminSection
              admin={admin}
              adminLoginError={adminLoginError}
              onLogin={loginAdmin}
              onLogout={logoutAdmin}
              onBack={() => navigate('store')}
              summary={{ ...adminSummary, revenue: adminSummary.revenue ?? revenue }}
              products={products}
              orders={orders}
              tab={adminTab}
              onTab={setAdminTab}
              editing={editing}
              onStartEdit={editProduct}
              onStartNew={startNewProduct}
              onCancelEdit={() => setEditing(null)}
              onSaveProduct={saveProduct}
              form={productForm}
              onFormChange={setProductForm}
              onDeleteProduct={deleteProduct}
              orderFilter={orderFilter}
              onOrderFilter={setOrderFilter}
              onUpdateOrderStatus={updateOrderStatus}
              backendReady={backendReady}
            />
          ) : null}
        </Suspense>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          <button className="drawer-backdrop" aria-label="Close bag" onClick={() => setCartOpen(false)}></button>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Bag">
            <div className="drawer-heading">
              <div>
                <div className="eyebrow muted">YOUR SELECTIONS</div>
                <h2>Your bag <span>({cartCount})</span></h2>
              </div>
              <button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X/></button>
            </div>
            <div className="drawer-items">
              {cartItems.length ? cartItems.map(({ product: p, qty }) => (
                <div className="cart-line" key={p.id}>
                  <div className="cart-thumb" style={{ background: p.color }}>
                    {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7 }} /> : p.emoji}
                  </div>
                  <div className="cart-line-info">
                    <strong>{p.name}</strong>
                    <span>{money(p.price, currency)}</span>
                    <div className="qty-control">
                      <button onClick={() => changeQty(p.id, -1)} aria-label="Decrease quantity"><Minus size={12}/></button>
                      <span>{qty}</span>
                      <button onClick={() => changeQty(p.id, 1)} aria-label="Increase quantity"><Plus size={12}/></button>
                    </div>
                  </div>
                  <b>{money(p.price * qty, currency)}</b>
                </div>
              )) : (
                <div className="empty-bag">
                  <span>🧺</span>
                  <h3>Your bag is waiting for a project.</h3>
                  <p>Pick a kit that brings hands-on creativity into your week.</p>
                  <button className="button dark-button" onClick={() => { setCartOpen(false); navigate('store'); }}>EXPLORE KITS</button>
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="drawer-footer">
                <div className="shipping-note">
                  <Truck size={16}/>
                  {subtotal >= 999 ? '✦ You unlocked free pan-India shipping!' : `Add ${money(999 - subtotal, currency)} more for free delivery.`}
                </div>
                <div className="subtotal-row">
                  <span>Subtotal</span>
                  <strong>{money(subtotal, currency)}</strong>
                </div>
                <p>All taxes included. Free shipping applied above ₹999.</p>
                <button className="button dark-button checkout-button" onClick={checkout}>
                  PROCEED TO CHECKOUT <ArrowUpRight size={16}/>
                </button>
                <small className="demo-note">
                  <ShieldCheck size={13}/> {backendReady ? 'Encrypted checkout via Razorpay' : 'Instant test checkout enabled'}
                </small>
              </div>
            )}
          </aside>
        </>
      )}

      {/* Confirmation Backdrop */}
      {confirmedOrder && (
        <div className="checkout-modal-backdrop confirmation-backdrop">
          <section className="order-confirmation" role="dialog" aria-modal="true" aria-label="Order Confirmation">
            <div className="confirmation-check"><Check size={31}/></div>
            <div className="eyebrow muted">✦ ORDER PLACED SUCCESSFULLY</div>
            <h2>Good things are on their way.</h2>
            <p>Thank you for choosing to make something meaningful. Your Anukool craft kit is being prepared with care in Jaipur.</p>
            <div className="confirmation-order">
              <span>Order number</span>
              <strong>{confirmedOrder.orderNumber}</strong>
            </div>
            <div className="confirmation-order">
              <span>Total amount</span>
              <strong>{money(confirmedOrder.total, currency)}</strong>
            </div>
            <div className="confirmation-order">
              <span>Payment mode</span>
              <strong>{confirmedOrder.paymentMethod || 'UPI Instant (NPCI Intent)'}</strong>
            </div>
            <div className="confirmation-order">
              <span>Courier Partner</span>
              <strong>{confirmedOrder.consignment?.carrier || 'Delhivery Air'}</strong>
            </div>
            <div className="confirmation-order">
              <span>Tracking AWB</span>
              <strong>
                <a
                  href={confirmedOrder.consignment?.trackingUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2E3A8A', textDecoration: 'underline' }}
                >
                  {confirmedOrder.consignment?.awb || 'DL' + confirmedOrder.orderNumber}
                </a>
              </strong>
            </div>
            <div className="confirmation-order">
              <span>Estimated delivery</span>
              <strong>{confirmedOrder.consignment?.estimatedDelivery || '3–5 business days'}</strong>
            </div>
            <div className="confirmation-email">
              Confirmation and pan-India tracking details sent to <strong>{confirmedOrder.email}</strong>.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <button
                className="button"
                onClick={() => setShowDispatchModal(true)}
                style={{ background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px' }}
              >
                <Truck size={16}/> VIEW COURIER LABEL & WHATSAPP MOCKUP
              </button>

              <button
                className="button"
                onClick={() => setShowInvoice(true)}
                style={{ background: '#2E3A8A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px' }}
              >
                <FileText size={16}/> DOWNLOAD OFFICIAL TAX INVOICE (GST)
              </button>

              <a
                className="button"
                href={buildWhatsAppDispatchUrl({
                  customerName: confirmedOrder.customerName,
                  customerPhone: confirmedOrder.customerPhone,
                  orderId: confirmedOrder.orderNumber,
                  awb: confirmedOrder.consignment?.awb,
                  carrier: confirmedOrder.consignment?.carrier,
                  kitName: confirmedOrder.items?.[0]?.name,
                  estimatedDelivery: confirmedOrder.consignment?.estimatedDelivery,
                  trackingUrl: confirmedOrder.consignment?.trackingUrl
                })}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', textDecoration: 'none' }}
              >
                <MessageSquare size={16}/> GET WHATSAPP DISPATCH ALERTS
              </a>

              <button className="button checkout-button" style={{ background: '#F8F4E9', color: '#2E3A8A', border: '1px solid #2E3A8A' }} onClick={() => setConfirmedOrder(null)}>
                CONTINUE SHOPPING <ArrowUpRight size={16}/>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="checkout-modal-backdrop">
          <section className="checkout-modal" role="dialog" aria-modal="true" aria-label="Anukool Checkout">
            <div className="drawer-heading">
              <div>
                <div className="eyebrow muted">ANUKOOL CHECKOUT</div>
                <h2>Shipping & Payment details</h2>
              </div>
              <button className="icon-button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X/></button>
            </div>
            <form className="checkout-form" onSubmit={submitCheckout}>
              <label>Full recipient name
                <input required minLength="2" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} placeholder="e.g. Aditi Rao"/>
              </label>
              <div className="checkout-two">
                <label>Email address
                  <input type="email" required value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} placeholder="aditi@example.com"/>
                </label>
                <label>Contact phone number
                  <input required minLength="8" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} placeholder="+91 98765 43210"/>
                </label>
              </div>
              <label>Delivery street address
                <input required minLength="3" value={customer.addressLine1} onChange={e => setCustomer({ ...customer, addressLine1: e.target.value })} placeholder="Apartment, building, street"/>
              </label>
              <label>Locality / Landmark (optional)
                <input value={customer.addressLine2} onChange={e => setCustomer({ ...customer, addressLine2: e.target.value })} placeholder="Near Central Park"/>
              </label>
              <div className="checkout-two">
                <label>City
                  <input required value={customer.city} onChange={e => setCustomer({ ...customer, city: e.target.value })} placeholder="Jaipur / Mumbai / Bengaluru"/>
                </label>
                <label>State
                  <input required value={customer.state} onChange={e => setCustomer({ ...customer, state: e.target.value })} placeholder="Rajasthan / Maharashtra"/>
                </label>
              </div>
              <label>PIN Code
                <input required value={customer.postalCode} onChange={e => setCustomer({ ...customer, postalCode: e.target.value })} placeholder="302001"/>
              </label>

              {/* Dual Payment Selector */}
              <div style={{ margin: '14px 0 6px' }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#2E3A8A', letterSpacing: '0.8px', marginBottom: 8 }}>
                  PAYMENT METHOD
                </label>
                <div className="payment-selector">
                  <button
                    type="button"
                    className={`payment-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <QrCode size={18} />
                    <span>Instant UPI (GPay / PhonePe / QR)</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard size={18} />
                    <span>Card / NetBanking / Razorpay</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div className="upi-qr-card">
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#2E3A8A', marginBottom: 8, letterSpacing: '0.5px' }}>
                    ✦ SCAN & PAY VIA ANY UPI APP
                  </div>
                  {upiQrSvg ? (
                    <div dangerouslySetInnerHTML={{ __html: upiQrSvg }} />
                  ) : (
                    <div style={{ padding: 20 }}>Generating UPI QR…</div>
                  )}
                  <p style={{ fontSize: 11, color: '#555', margin: '4px 0 10px' }}>
                    UPI ID: <strong>{getPaymentConfig().upiVpa || DEFAULT_VPA}</strong> (NPCI Verified)
                  </p>
                  <a
                    href={buildUpiUrl({
                      pa: getPaymentConfig().upiVpa || DEFAULT_VPA,
                      pn: getPaymentConfig().merchantName || 'Anukool Jaipur',
                      amount: subtotal + (subtotal >= 999 ? 0 : 99),
                      orderId: 'ANK-PAY'
                    })}
                    className="button"
                    style={{
                      background: '#2E3A8A',
                      color: '#fff',
                      fontSize: 11,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: 6
                    }}
                  >
                    PAY ₹{subtotal + (subtotal >= 999 ? 0 : 99)} IN UPI APP <ArrowUpRight size={14}/>
                  </a>
                </div>
              )}

              <div className="checkout-total">
                <span>Items subtotal ({cartCount} {cartCount === 1 ? 'kit' : 'kits'})</span>
                <strong>{money(subtotal, currency)}</strong>
              </div>
              <div className="checkout-total">
                <span>Shipping fee</span>
                <strong>{subtotal >= 999 ? 'FREE' : money(99, currency)}</strong>
              </div>
              <div className="checkout-total final">
                <span>Grand total (incl. GST)</span>
                <strong>{money(subtotal + (subtotal >= 999 ? 0 : 99), currency)}</strong>
              </div>

              {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
              <button className="button dark-button checkout-button" type="submit" disabled={checkoutBusy}>
                {checkoutBusy ? 'PROCESSING ORDER…' : paymentMethod === 'upi' ? `CONFIRM UPI PAYMENT (${money(subtotal + (subtotal >= 999 ? 0 : 99), currency)})` : backendReady ? 'PAY SECURELY WITH RAZORPAY' : 'PLACE TEST ORDER'} <ArrowUpRight size={16}/>
              </button>
              <small>
                {paymentMethod === 'upi'
                  ? 'Scan the dynamic QR code using Google Pay, PhonePe, Paytm, or BHIM, then click Confirm.'
                  : backendReady
                  ? 'All payments are encrypted via Razorpay (UPI, Cards, NetBanking).'
                  : 'Running in local preview mode. Placing an order will immediately verify the complete order confirmation flow.'}
              </small>
            </form>
          </section>
        </div>
      )}

      {/* Official Tax Invoice Modal */}
      {showInvoice && confirmedOrder && (
        <Suspense fallback={null}>
          <InvoiceModal
            order={confirmedOrder}
            onClose={() => setShowInvoice(false)}
          />
        </Suspense>
      )}

      {/* Dispatch Center Modal for Live WhatsApp Mockup & Thermal AWB Label */}
      {showDispatchModal && confirmedOrder && (
        <Suspense fallback={null}>
          <DispatchCenterModal
            order={confirmedOrder}
            onClose={() => setShowDispatchModal(false)}
          />
        </Suspense>
      )}

      {/* TypeSafe System One Gift Concierge Modal */}
      <Suspense fallback={null}>
        <GiftConciergeModal
          isOpen={giftModalOpen}
          onClose={() => setGiftModalOpen(false)}
          catalog={products}
          onSelectProduct={p => navigate('product', p)}
          onAddToCart={(id, qty) => {
            addToCart(id, qty);
            notify('Added to bag ♡');
          }}
        />
      </Suspense>

      {/* Jaipur Hand Block-Printing Interactive Studio Modal */}
      <Suspense fallback={null}>
        <BlockPrintSimulatorModal
          isOpen={studioOpen}
          onClose={() => setStudioOpen(false)}
          onExploreKits={() => {
            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </Suspense>

      {toast && <div className="toast-message" role="status" aria-live="polite"><Check size={16}/>{toast}</div>}
    </div>
  );
}

// Reel Card Component with Video Hover / Click
function ReelCard({ reel, onOpenKit }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  function togglePlay() {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <div
      className="reel-card"
      onClick={togglePlay}
      onMouseEnter={() => {
        if (videoRef.current && !playing) {
          videoRef.current.play();
          setPlaying(true);
        }
      }}
      onMouseLeave={() => {
        if (videoRef.current && playing) {
          videoRef.current.pause();
          setPlaying(false);
        }
      }}
    >
      <video
        ref={videoRef}
        src={reel.video}
        className="reel-video"
        loop
        muted
        playsInline
      />
      <div className="reel-overlay">
        <span className="reel-badge">{reel.title}</span>
        {!playing && (
          <div className="reel-play-icon">
            <Play size={22} fill="#2E3A8A"/>
          </div>
        )}
        <div className="reel-footer">
          <div className="reel-quote">{reel.quote}</div>
          <div className="reel-maker">{reel.maker}</div>
          <button
            className="reel-kit-btn"
            onClick={e => {
              e.stopPropagation();
              onOpenKit();
            }}
          >
            VIEW KIT <ArrowUpRight size={13}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
