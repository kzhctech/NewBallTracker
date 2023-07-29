const puppeteer = require('puppeteer-core');
const PuppeteerVideoRecorder = require('puppeteer-video-recorder');

const main = async () => {
 try {
  const browser = await puppeteer.launch({
   headless: true, args: ["--no-sandbox", "--disable-gpu",]
  });
  
  const recorder = new PuppeteerVideoRecorder();

  const page = await browser.newPage()              
  
  const startUrl = 'https://www.crex.live/scoreboard/IM5/1BQ/Final/Q/O/ind-vs-aus-final-icc-world-test-championship-final-2023/live'
  
  await recorder.init(page, 'screenshots');
  await recorder.start();
  await page.goto(startUrl)                       
  console.log("going");

  var elm = '.live-score-card .font3';
  await page.waitForSelector(elm, {
   timeout: 120000
  });

   
  await recorder.stop();
  
  
  await page.close();
  await browser.close();

 } catch (err) {
  console.log(err);
 }
}                                
main()
