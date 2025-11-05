const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const htmlPath = 'file://' + path.resolve(__dirname, 'index.html');
  const outputPath = path.join(__dirname, 'vibebrowser-pitch.pdf');

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Loading presentation...');
  await page.goto(htmlPath, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for Swiper library and initialization
  await page.waitForFunction(() => {
    return typeof Swiper !== 'undefined';
  }, { timeout: 10000 });

  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Check if swiper instance exists
  const swiperInfo = await page.evaluate(() => {
    // Try to find swiper from window or DOM
    const swiperEl = document.querySelector('.mySwiper');
    return {
      hasSwiperClass: typeof Swiper !== 'undefined',
      hasElement: !!swiperEl,
      hasSwiper: !!window.swiper,
      slideCount: document.querySelectorAll('.swiper-slide').length
    };
  });

  console.log('Swiper info:', swiperInfo);

  const slideCount = swiperInfo.slideCount;
  console.log(`Found ${slideCount} slides`);

  const slides = [];

  // Navigate through each slide
  for (let i = 0; i < slideCount; i++) {
    console.log(`Processing slide ${i + 1}/${slideCount}...`);
    
    // Try different methods to navigate
    const navigated = await page.evaluate((index) => {
      // Method 1: Use global swiper variable
      if (window.swiper) {
        window.swiper.slideTo(index, 0);
        return 'window.swiper';
      }
      
      // Method 2: Get swiper from element
      const swiperEl = document.querySelector('.mySwiper');
      if (swiperEl && swiperEl.swiper) {
        swiperEl.swiper.slideTo(index, 0);
        return 'element.swiper';
      }
      
      // Method 3: Manually set active class
      const allSlides = document.querySelectorAll('.swiper-slide');
      allSlides.forEach((slide, idx) => {
        slide.classList.remove('swiper-slide-active', 'swiper-slide-prev', 'swiper-slide-next');
        if (idx === index) {
          slide.classList.add('swiper-slide-active');
        }
      });
      return 'manual';
    }, i);

    console.log(`  Navigation method: ${navigated}`);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get slide content
    const slideData = await page.evaluate((expectedIndex) => {
      const allSlides = document.querySelectorAll('.swiper-slide');
      let activeSlide = document.querySelector('.swiper-slide-active');
      
      // If no active slide, get by index
      if (!activeSlide && allSlides[expectedIndex]) {
        activeSlide = allSlides[expectedIndex];
      }
      
      if (!activeSlide) return { html: '<p>ERROR: No slide found</p>', index: -1 };
      
      const content = activeSlide.querySelector('.slide-content');
      const html = content ? content.innerHTML : activeSlide.innerHTML;
      
      // Determine actual index
      let actualIndex = -1;
      allSlides.forEach((slide, idx) => {
        if (slide === activeSlide) actualIndex = idx;
      });
      
      return {
        html: html,
        index: actualIndex,
        preview: html.substring(0, 80).replace(/<[^>]*>/g, '').trim()
      };
    }, i);

    console.log(`  -> Captured slide ${slideData.index}, preview: "${slideData.preview}"`);

    slides.push(slideData.html);
  }

  await browser.close();

  console.log('\nValidating captured slides...');
  const uniqueSlides = new Set(slides);
  console.log(`Unique slides: ${uniqueSlides.size} / ${slides.length}`);

  if (uniqueSlides.size < slideCount * 0.8) {
    console.error('❌ WARNING: Many duplicate slides detected!');
  }

  console.log('\nCreating PDF...');

  const browser2 = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });

  const page2 = await browser2.newPage();
  await page2.setViewport({ width: 1920, height: 1080 });

  const printHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    .slide-page {
      width: 1122px;
      height: 794px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 60px 80px;
      text-align: center;
      page-break-after: always;
      page-break-inside: avoid;
      background: white;
    }
    .slide-page:last-child { page-break-after: auto; }
    .slide-content { max-width: 1000px; width: 100%; }
    h1 { font-weight: 700; margin: 0 0 16px 0; font-size: 3em; }
    h2 { margin: 0 0 24px 0; font-weight: 600; font-size: 2.2em; }
    h3 { font-size: 1.5em; margin-bottom: 12px; }
    h4 { font-size: 1.2em; font-weight: 600; margin: 8px 0; }
    p { color: #222; margin: 12px 0; font-size: 20px; line-height: 1.5; text-align: center; }
    ul, ol { text-align: left; display: inline-block; max-width: 100%; }
    li { color: #222; margin: 10px 0; font-size: 20px; line-height: 1.5; }
    .muted { color: #6b6b6b; font-size: 20px; }
    .accent { color: #0a84ff; }
    .cols { display: flex; gap: 32px; justify-content: center; align-items: flex-start; width: 100%; margin-top: 20px; }
    .col { flex: 1; text-align: left; }
    a { color: #0a84ff; text-decoration: none; }
    .timeline { position: relative; max-width: 900px; margin: 0 auto; padding: 20px 0; text-align: left; }
    .timeline::before { content: ''; position: absolute; left: 30px; top: 40px; bottom: 40px; width: 3px; background: #0a84ff; }
    .timeline-item { position: relative; padding-left: 70px; margin-bottom: 40px; }
    .timeline-item:last-child { margin-bottom: 0; }
    .timeline-dot { position: absolute; left: 20px; top: 8px; width: 20px; height: 20px; border-radius: 50%; background: #0a84ff; border: 3px solid white; box-shadow: 0 0 0 3px #0a84ff; z-index: 2; }
    .timeline-content { text-align: left; }
    .timeline-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 16px; }
    .timeline-header strong { font-size: 22px; color: #222; font-weight: 600; }
    .timeline-time { font-size: 18px; color: #6b6b6b; font-weight: 500; white-space: nowrap; }
    .timeline-content ul { margin: 12px 0 0 0; padding-left: 20px; }
    .timeline-content li { margin: 8px 0; font-size: 18px; line-height: 1.5; }
    table { font-size: 14px; margin: 20px auto; border-collapse: collapse; width: 100%; max-width: 800px; }
    table th, table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #ddd; }
    table th { font-weight: 600; background: #f5f5f5; }
    .mobile-show { display: none; }
    .carousel { display: none; }
  </style>
</head>
<body>
${slides.map((slide, i) => `
  <div class="slide-page">
    <div class="slide-content">
      ${slide}
    </div>
  </div>
`).join('')}
</body>
</html>
`;

  await page2.setContent(printHtml, { waitUntil: 'load', timeout: 60000 });
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page2.pdf({
    path: outputPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser2.close();

  console.log('\n✓ PDF generated successfully!');
  console.log('→', outputPath);
})();
