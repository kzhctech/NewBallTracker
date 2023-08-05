const express = require('express');
const app = express();
const path = require('path');
var puppeteer = require('puppeteer-core');
const http = require('http').createServer(app);
const cors = require('cors');


if (process.env.PORT){
	puppeteer = require('puppeteer');
}


const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;


const { kStringMaxLength } = require('buffer'); 
const bodyParser = require('body-parser');
   
    app.use(express.json());
    
    app.use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }));



app.use('/static', express.static('public'))

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//let updatedValues ={}

app.get('/', (req, res) => {
  res.render('index1');
});






function createMainFunction() {
  const updatedValues = {}; // Each instance gets its own separate updatedValues





const navigateWithRetries = async (page, url, timeout, maxDuration) => {
  const startTime = Date.now();

  while (true) {
    try {
      await page.goto(url, { timeout });
      return;
    } catch (error) {
      console.error(`Retry failed: ${error.message}`);
    }

    const elapsedTime = Date.now() - startTime;
    if (maxDuration && elapsedTime >= maxDuration) {
      throw new Error(`Navigation timed out after ${maxDuration} milliseconds.`);
    }
  }
};






const getInitialValues = async (page, selectors) => {
 const initialValues = {};

 for (const [label, selector] of Object.entries(selectors)) {
  if (Array.isArray(selector)) {
   initialValues[label] = {};

   for (const item of selector) {
    const {
     label: subLabel,
     selector: subSelector
    } = item;
    await page.waitForSelector(subSelector);
    const element = await page.$(subSelector);
    const value = await page.evaluate((el) => el.textContent.trim(), element);
    initialValues[label][subLabel] = value;
   }
  } else {
   await page.waitForSelector(selector);
   const element = await page.$(selector);
   const value = await page.evaluate((el) => el.textContent.trim(), element);
   initialValues[label] = value;
  }
 }

 Object.assign(updatedValues, initialValues);

 return initialValues;
};

const observeElementChanges = async (page, selectors) => {
 for (const [label, selector] of Object.entries(selectors)) {
  if (Array.isArray(selector)) {
   for (const item of selector) {
    const {
     label: subLabel,
     selector: subSelector
    } = item;
    await page.evaluate(
     (subLabel, subSelector) => {
      const observer = new MutationObserver((mutations) => {
       for (const mutation of mutations) {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
         const newValue = mutation.target.textContent.trim();
         observeElmData({
          label: subLabel, newValue
         });
        }
       }
      });

      observer.observe(document.querySelector(subSelector),
       {
        characterData: true,
        subtree: true,
        attributes: true,
       });
     },
     subLabel,
     subSelector
    );
   }
  } else {
   await page.evaluate(
    (label, selector) => {
     const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
       if (mutation.type === 'characterData') {
        const newValue = mutation.target.textContent.trim();
        observeElmData({
         label, newValue
        });
       }
      }
     });

     observer.observe(document.querySelector(selector),
      {
       characterData: true,
       subtree: true,
       attributes: true,
      });
    }, label,
    selector
   );
  }
 }
};

const observeElements = async (page, selectors) => {
 const initialValues = await getInitialValues(page, selectors);
 await observeElementChanges(page, selectors);
 return initialValues;
};











async function main(url) {
 try {
  const browser = await puppeteer.launch({
   headless: true,
   args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({
   width: 420,
   height: 980,
  });

  await page.exposeFunction('observeElmData', (data) => {
   updatedValues[url][data.label] = data.newValue;
   //   console.log(data);
   console.log('Updated values:',
    updatedValues[url]);
  });

  const startUrl = url;

 await navigateWithRetries(page, startUrl, 5000, Infinity);


  await page.goto(startUrl);
  console.log('Going');









  const selectors = {
   Last: 'div.result-box > span',
   Name: 'div > h1.name-wrapper > span',
   Status: 'div.final-result.m-none',
   Team1Name:'div.team-content > div.team-name ',
   Run: 'div.team-score span:nth-child(1)',
   Over: 'div.team-score span:nth-child(2)',
   B1name: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.batsmen-name',
   B1run: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.batsmen-score p:nth-child(1)',
   B1Ball: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.batsmen-score p:nth-child(2)',
   B1Four: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.strike-rate:nth-child(1) span:nth-child(2)',
   B1Six: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.strike-rate:nth-child(2) span:nth-child(2)',
   B1SR: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.strike-rate:nth-child(3) span:nth-child(2)',
   B2name: 'app-match-live-player > div > div:nth-child(3) div.batsmen-name',
   B2run: 'app-match-live-player > div > div:nth-child(3) div.batsmen-score p:nth-child(1)',
   B2Ball: 'app-match-live-player > div > div:nth-child(3) div.batsmen-score p:nth-child(2)',
   B2Four: 'app-match-live-player > div > div:nth-child(3) div.strike-rate:nth-child(1) span:nth-child(2)',
   B2Six: 'app-match-live-player > div > div:nth-child(3) div.strike-rate:nth-child(2) span:nth-child(2)',
   B2SR: 'app-match-live-player > div > div:nth-child(3) div.strike-rate:nth-child(3) span:nth-child(2)',
   BLname: 'app-match-live-player > div > div:nth-child(4) div.batsmen-name',
   BLWkRun: 'app-match-live-player > div > div:nth-child(4) div.batsmen-score p:nth-child(1)',
   BLOver: 'app-match-live-player > div > div:nth-child(4) div.batsmen-score p:nth-child(2)',
   //BLEco: 'app-match-live-player > div > div:nth-child(4) div.strike-rate:nth-child(3) span:nth-child(2)'
  };
  




	 for (const key in selectors) {
    if (Object.prototype.hasOwnProperty.call(selectors, key)) {
      const selector = selectors[key];
      const elementExists = await page.$(selector);
      if (!elementExists) {
        console.log(`Element with selector '${selector}' (key: '${key}') does not exist on the page.`);
        delete selectors[key];
      }
    }
  }





  
  const initialValues = await observeElements(page, selectors);
    Object.assign(updatedValues, initialValues);

    console.log('Initial values:', initialValues);
    console.log('Updated values:', updatedValues);

    let previousValue = '';
	 let pinfo = true;








    setInterval(async () => {



const imageSrc = await page.$eval('div.team-img img', (img) => img.src);

updatedValues.Team1Logo = imageSrc;


if (selectors.Status){

if (pinfo){                                                           await page.click('.ptnr-info');
	pinfo = false;

}

const partnerShipDataElement = await page.$('.partner-ship-data');
    const pshipVal = await partnerShipDataElement.evaluate(element => element.textContent);

  //  console.log('Pship:', textInsidePartnerShipData);





//const imageSrc = await page.$eval('div.team-img img', (img) => img.src);

const B1imageSrc = await page.$eval('app-match-live-player div.batsmen-partnership:nth-child(1) div.playerProfileDefault > div:nth-child(1) > img', (img) => img.src);

const BimgJ = await page.$eval('app-match-live-player div.batsmen-partnership:nth-child(1) div.playerProfileDefault > div:nth-child(2) > img', (img) => img.src);


const B2imageSrc = await page.$eval('app-match-live-player > div > div:nth-child(3)  div.playerProfileDefault > div:nth-child(1) > img', (img) => img.src);

const BLimageSrc = await page.$eval('app-match-live-player > div > div:nth-child(4)  div.playerProfileDefault > div:nth-child(1) > img', (img) => img.src);

const BLimgJ = await page.$eval('app-match-live-player > div > div:nth-child(4)  div.playerProfileDefault > div:nth-child(2) > img', (img) => img.src);

    // Output the image source URL
   // console.log('Image source:', B1imageSrc,B2imageSrc,BimgJ,BLimageSrc,BLimgJ);


//updatedValues[url].Team1Logo = imageSrc;

updatedValues.B1img = B1imageSrc;
updatedValues.B2img = B2imageSrc;
updatedValues.BJ = BimgJ;

updatedValues.BLimg = BLimageSrc;
updatedValues.BLJ = BLimgJ;


      let result = await page.evaluate(() => {                                                                                                       let topDiv = document.querySelector('app-match-commentary div#topDiv');
        let childDivs = topDiv.querySelectorAll('div');

        for (let i = 0; i < childDivs.length; i++) {
          let spanComment = childDivs[i].querySelector('span.cm-b-comment-c2');
          let spanOver = childDivs[i].querySelector('span.cm-b-over');

		let spanEvent = childDivs[i].querySelector('span.cm-b-ballupdate');

          if (spanComment && spanOver) {
            let commentValue = spanComment.textContent.trim();
	    let overValue =  spanOver.textContent.trim();
            if (commentValue !== '' && overValue !== '') {
              

		    let eventValue = spanEvent ? spanEvent.textContent.trim() : '';

let lbElement = document.querySelector('div.live-data div.overs');
let rrElement = document.querySelector('div.live-score-card div.team-run-rate');

        let lbValue = lbElement ? lbElement.textContent.trim() : '';                                                                                 let rrValue = rrElement ? rrElement.textContent.trim() : '';



              return {
                comment: commentValue,
                over: overValue,
                LBs: lbValue,
                RR: rrValue,
		Event:eventValue
              };
            }
          }
        }

        return null;
      });




updatedValues.LBs = result.LBs;       
updatedValues.RR = result.RR;        
updatedValues.pship = pshipVal;


      if (result !== null) {
        if (result.comment !== previousValue) {
          console.log('Comment:', result.comment);
          console.log('Over:', result.over);
	  console.log('Event:', result.Event);
          previousValue = result.comment;




                // Update the updatedValues[url] variable with the new values
        updatedValues.Comment = result.comment;
        updatedValues.ComOver = result.over;
        updatedValues.ComEvent = result.Event;
        //  console.log('Updated values:', updatedValues[url]);

        }
      } else {
        console.log('No non-empty value found in child divs');
      }


}
    }, 1000);







  //  await browser.close();
  } catch (err) {
    console.log(err);
  }
}

return { main, updatedValues };
}




const mainInstances = new Map();
const urlUsersMap = new Map();


          
//main("https://crex.live/scoreboard/KJ0/1FV/2nd-ODI/O/V/ind-vs-wi-2nd-odi-india-tour-of-west-indies-2023/live");



io.on('connection', (socket) => {
  console.log('A client connected.');
 const instanceId = socket.id;

  socket.on('url', (url) => {
    console.log(`Received URL: ${url} for instance ${instanceId}`);

    if (!mainInstances.has(instanceId)) {
      mainInstances.set(instanceId, createMainFunction());
      console.log(`Created main instance with instanceId: ${instanceId}`);
    }

    const { main, updatedValues } = mainInstances.get(instanceId);

    if (updatedValues[url]) {
      // If it exists, emit the updatedValues back to the user
   
setInterval(()=>socket.emit('updatedValues', updatedValues),1000);
    } else {
      main(url);
      // After the main function is called, emit the updatedValues back to the use
	    setInterval(()=>socket.emit('updatedValues', updatedValues),1000);
    }

    // Track connected users for each URL
    if (!urlUsersMap.has(url)) {
      urlUsersMap.set(url, new Set());
    }
    urlUsersMap.get(url).add(socket.id);

    // Handle user disconnection
    socket.on('disconnect', () => {
      urlUsersMap.get(url).delete(socket.id);
      if (urlUsersMap.get(url).size === 0) {
        // If there are no users left for this URL, close the main instance and remove it
        mainInstances.delete(instanceId);
        console.log(`Closed main instance with instanceId: ${instanceId}`);
      }
    });
  });
});




/*
 *
io.on('connection', (socket) => {
  setInterval(()=>socket.emit('updatedValues', updatedValues),1000);
});

*/

// Start the server
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

