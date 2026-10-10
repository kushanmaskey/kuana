#!/usr/bin/env node
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Pool } = require('pg');

const SPEAKERS = [
  { name: 'Prof. Achyut Prasad Wagle', role: 'Vice Chancellor', org: 'Kathmandu University', bio: "Delivering the keynote address on Day 1 evening program. As Vice Chancellor of Kathmandu University, Prof. Wagle brings visionary leadership and deep insights into KU's academic future.", photo_url: 'https://kuana.org/assets/img/speakers/keynote.jpg', tag: 'Keynote', tag_color: 'bg-[#ffc31d] text-[#0e1b4d]', year: 2025, facebook_url: 'https://www.facebook.com/kathmanduniversity', linkedin_url: 'https://www.linkedin.com/in/achyut-wagle-a9b1537a/', instagram_url: null, is_featured: true, sort_order: 0 },
  { name: 'Saurav Basnet', role: 'CEO & Co-Founder, Associate Professor', org: 'InnoSTEMLab · Wentworth Institute of Technology', bio: 'Entrepreneur and educator bridging the worlds of innovation, STEM education, and academia.', photo_url: 'https://kuana.org/assets/img/speakers/saurav_basnet.jpg', tag: 'Speaker', tag_color: 'bg-[#0e1b4d] text-white', year: 2025, facebook_url: 'https://www.facebook.com/saurav.m.basnet', linkedin_url: 'https://www.linkedin.com/in/smsbasnet/', instagram_url: null, is_featured: false, sort_order: 1 },
  { name: 'Sajan Gautam', role: 'General Partner', org: 'MOMO VC', bio: 'Technology practitioner-turned startups advisor and investor. General Partner at MOMO VC.', photo_url: 'https://kuana.org/assets/img/speakers/Sajan_momoVC.jpg', tag: 'Speaker', tag_color: 'bg-[#0e1b4d] text-white', year: 2025, facebook_url: 'https://www.facebook.com/sajan.gautam', linkedin_url: 'https://www.linkedin.com/in/sajan-gautam-27a4125/', instagram_url: 'https://www.instagram.com/gautam.sajan/', is_featured: false, sort_order: 2 },
  { name: 'Shubash Lohani', role: 'Senior Director — Global Conservation Initiatives', org: 'The Pew Charitable Trusts', bio: 'Leading global conservation efforts at The Pew Charitable Trusts.', photo_url: 'https://kuana.org/assets/img/speakers/Shubash_Lohani.jpg', tag: 'Speaker', tag_color: 'bg-[#0e1b4d] text-white', year: 2025, facebook_url: 'https://www.facebook.com/sclohani', linkedin_url: 'https://www.linkedin.com/in/shubash-lohani-14533b1/', instagram_url: null, is_featured: false, sort_order: 3 },
  { name: 'Rohini Shrestha', role: 'Owner & CEO', org: 'Success on the Spectrum — Langhorne, PA', bio: 'Passionate autism advocate and special needs mom. CEO of Success on the Spectrum.', photo_url: 'https://kuana.org/assets/img/speakers/Rohini_Shrestha.jpg', tag: 'Speaker', tag_color: 'bg-[#0e1b4d] text-white', year: 2025, facebook_url: 'https://www.facebook.com/rohini.shrestha.9', linkedin_url: 'https://www.linkedin.com/in/rohini-shrestha/', instagram_url: null, is_featured: false, sort_order: 4 },
  { name: 'Rajan Rijal', role: 'Moderator', org: '', bio: "Brings a strong record of civic engagement and academic experience to his role as moderator.", photo_url: '/assets/img/gallery/2025/R6_B9793.jpg', tag: 'Moderator', tag_color: 'bg-gray-600 text-white', year: 2025, facebook_url: 'https://www.facebook.com/rajan.rijal.7', linkedin_url: 'https://www.linkedin.com/in/rajan-rijal-0715b1b4/', instagram_url: 'https://www.instagram.com/rajan.rijal.7/', is_featured: false, sort_order: 5 },
  { name: 'Bhola Thapa', role: 'Keynote Speaker', org: '', bio: '', photo_url: '/assets/img/speakers/bhola_thapa.jpg', tag: 'Keynote', tag_color: 'bg-[#ffc31d] text-[#0e1b4d]', year: 2023, facebook_url: 'https://www.facebook.com/bhola.thapa.399', linkedin_url: 'https://www.linkedin.com/in/bhola-thapa-51666221/', instagram_url: 'https://www.instagram.com/bhola_thapa__/', is_featured: true, sort_order: 0 },
  { name: 'Deepesh Shrestha', role: 'Speaker', org: '', bio: '', photo_url: '/assets/img/gallery/2025/R6_B0034.jpg', tag: 'Speaker', tag_color: 'bg-[#0e1b4d] text-white', year: 2023, facebook_url: null, linkedin_url: null, instagram_url: null, is_featured: false, sort_order: 1 },
];

async function seed(url) {
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  const { rows: existing } = await pool.query('SELECT COUNT(*) FROM speakers');
  if (parseInt(existing[0].count) > 0) {
    console.log('  already seeded, skipping');
    await pool.end();
    return;
  }
  for (const s of SPEAKERS) {
    await pool.query(
      `INSERT INTO speakers (name, role, org, bio, photo_url, tag, tag_color, year, facebook_url, linkedin_url, instagram_url, is_featured, is_published, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,true,$13)`,
      [s.name, s.role||null, s.org||null, s.bio||null, s.photo_url||null, s.tag, s.tag_color, s.year, s.facebook_url||null, s.linkedin_url||null, s.instagram_url||null, s.is_featured, s.sort_order]
    );
  }
  console.log(`  seeded ${SPEAKERS.length} speakers`);
  await pool.end();
}

async function main() {
  const envs = { dev: process.env.DEV_DATABASE_URL, staging: process.env.STAGING_DATABASE_URL, prod: process.env.PROD_DATABASE_URL };
  for (const [name, url] of Object.entries(envs)) {
    if (!url) { console.log(`${name}: no URL, skipping`); continue; }
    process.stdout.write(`${name}: `);
    await seed(url);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
