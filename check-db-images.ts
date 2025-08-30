import { db } from './server/db';
import { templates } from './shared/schema';

async function checkDatabaseImages() {
  console.log("🔍 Checking database image URLs...\n");
  
  try {
    const allTemplates = await db.select().from(templates);
    
    console.log(`Found ${allTemplates.length} templates in database:\n`);
    
    for (const template of allTemplates) {
      console.log(`👤 User ${template.userId} (${template.agentName}):`);
      console.log(`  🖼️  Hero Image: ${template.heroImageUrl || 'None'}`);
      console.log(`  🎥  Hero Video: ${template.heroVideoUrl || 'None'}`);
      console.log(`  👤  Agent Image: ${template.agentImageUrl || 'None'}`);
      console.log(`  🏢  Logo: ${template.logoUrl || 'None'}`);
      console.log('');
    }
    
    // Check for broken URLs
    console.log("🔧 Checking for broken S3 URLs...");
    
    const s3Files = [
      'agents/user-1/1756571875000-IMG_2104.jpg',
      'agents/user-1/agent-photo.jpg',
      'agents/user-3/1756583078699-55929607.png',
      'agents/user-4/1756583275011-IMG_9086.PNG',
      'heroes/user-1/1756573382155-IMG_2104.jpg',
      'heroes/user-1/hero-background.jpg',
      'heroes/user-1/hero-video.mp4',
      'heroes/user-3/1756583058103-1756535366323-IMG_1810.jpg',
      'heroes/user-3/1756582023688-Web_page_video_1753809980517-3GYeuQrV.mp4',
      'heroes/user-4/1756583262983-Web_page_video_1753809980517-3GYeuQrV.mp4',
      'logos/user-1/1756578179134-mikelogo.png',
      'logos/user-3/1756583061913-Mandy_Visty_headshot__1__1753818758165-DoMSI8CY.jpg',
      'logos/user-4/1756583249377-1756535363294-IMG_2104.jpg'
    ];
    
    for (const template of allTemplates) {
      const urls = [template.heroImageUrl, template.heroVideoUrl, template.agentImageUrl, template.logoUrl];
      
      for (const url of urls) {
        if (url && url.includes('s3.us-east-2.amazonaws.com')) {
          const s3Key = url.split('.amazonaws.com/')[1];
          if (s3Key && !s3Files.includes(decodeURIComponent(s3Key))) {
            console.log(`❌ BROKEN: ${url}`);
            console.log(`   Expected in S3: ${decodeURIComponent(s3Key)}`);
          }
        }
      }
    }
    
  } catch (error) {
    console.error("❌ Error checking database:", error);
  }
}

checkDatabaseImages();
