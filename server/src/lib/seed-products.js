import 'dotenv/config';
import { pool } from './db.js';
const products=[
['DIY Mini Painting Kit','diy-mini-painting-kit','Art & Craft','A pocket-sized painting adventure with everything you need to make something lovely.',49900,28,4.8,'🖼️','#f4d46b','Bestseller'],
['DIY Light Bottle Painting Kit','diy-light-bottle-painting-kit','Art & Craft','Paint a bottle, add warm lights, and make your space feel a little more you.',99900,16,4.9,'🏮','#f7d9d4','Maker favourite'],
['DIY Clay Sculpting Kit','diy-clay-sculpting-kit','Art & Craft','A beginner-friendly sculpting kit for making something by hand.',199900,12,4.8,'🏺','#d9d2ed','Get hands-on'],
['DIY Handmade Pasta Kit','diy-handmade-pasta-kit','Food','Turn an evening into a delicious, flour-dusted kitchen adventure.',399900,9,5.0,'🍝','#f4dca6','Date night'],
['DIY Sushi Making Kit','diy-sushi-making-kit','Food','Roll, fill, slice, and share your own sushi night at home.',129900,21,4.6,'🍣','#cfe1c2','Crowd pleaser'],
['DIY Cement Coaster Kit','diy-cement-coaster-kit','Home Decor','Create a set of modern coasters for your coffee table.',149900,14,4.9,'🪴','#c7d9df','Make & keep'],
['DIY Mini Terrarium Kit','diy-mini-terrarium-kit','Gardening','Build a tiny green world and bring nature to your desk.',99900,25,4.7,'🌿','#cfe1c2','Slow Sunday'],
['DIY Fridge Magnet Kit','diy-fridge-magnet-kit','Art & Craft','Make colourful little keepsakes for your fridge or your favourite people.',119900,18,4.8,'🧲','#f5c4ad','Group activity'],
['DIY Perfume Kit','diy-perfume-kit','Home Decor','Explore fragrance notes and create a scent of your own.',399900,7,4.9,'🧴','#ead6ec','A little luxury'],
['Grow in a Can — Basil','grow-in-a-can-basil','Gardening','A cheerful starter kit for growing fresh basil in a small space.',54900,35,4.8,'🌱','#d8e7c9','Easy grow'],
['DIY Tote Bag Painting Kit','diy-tote-bag-painting-kit','Art & Craft','Make a one-of-a-kind tote with fabric paints and imagination.',119900,11,4.9,'👜','#e9d9c4','Wear your art'],
['DIY Ice Gola Kit','diy-ice-gola-kit','Food','Bring a nostalgic summer treat home and make colourful gola together.',175000,19,4.7,'🍧','#cbe7ee','Sweet nostalgia']
];
try{for(const p of products)await pool.query(`INSERT INTO products(name,slug,category,description,price_paise,stock,rating,emoji,color,tag) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(slug) DO NOTHING`,p);console.log(`Seeded ${products.length} demo products (existing slugs unchanged).`);}catch(e){console.error(e);process.exitCode=1;}finally{await pool.end();}
