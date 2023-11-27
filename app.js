const express = require('express');
const app = express();
const path = require('path');
var puppeteer = require('puppeteer-core');
const http = require('http').createServer(app);
const cors = require('cors');
const mongoose = require('mongoose');


if (process.env.PORT){
	puppeteer = require('puppeteer');
}




mongoose.connect('mongodb+srv://kzhccric:2FQHi2IPGWdllW21@cluster0.v6byg.mongodb.net/kzhcCric?retryWrites=true&w=majority');
 
// get reference to database
var db = mongoose.connection;
 
db.on('error', console.error.bind(console, 'connection error:'));

var matchLink = mongoose.Schema({
      link:String,
      ad:String
    });
 
    // compile schema to model
    var Link = mongoose.model('Link', matchLink, 'linkstore');






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







let updatedValues ={}

var intervalId;


const startInterval = (page, selectors) => {
 
 
let pinfo =true;
let previousValue='';
 
  let intervalId = setInterval(async () => {

      const imageSrc = await page.$eval('div.team-img img', (img) => img.src);
      updatedValues.Team1Logo = imageSrc;

      if (selectors.Status) {
        if (pinfo) {
          await page.click('.ptnr-info');
          pinfo = false;
        }

        const partnerShipDataElement = await page.$('.partner-ship-data');
        const pshipVal = await partnerShipDataElement.evaluate((element) => element.textContent);

        const B1imageSrc = await page.$eval(
          'app-match-live-player div.batsmen-partnership:nth-child(1) div.playerProfileDefault > div:nth-child(1) > img',
          (img) => img.src
        );

        const BimgJ = await page.$eval(
          'app-match-live-player div.batsmen-partnership:nth-child(1) div.playerProfileDefault > div:nth-child(2) > img',
          (img) => img.src
        );

        const B2imageSrc = await page.$eval(
          'app-match-live-player > div > div:nth-child(3) div.playerProfileDefault > div:nth-child(1) > img',
          (img) => img.src
        );

        const BLimageSrc = await page.$eval(
          'app-match-live-player > div > div:nth-child(4) div.playerProfileDefault > div:nth-child(1) > img',
          (img) => img.src
        );

        const BLimgJ = await page.$eval(
          'app-match-live-player > div > div:nth-child(4) div.playerProfileDefault > div:nth-child(2) > img',
          (img) => img.src
        );

        updatedValues.B1img = B1imageSrc;
        updatedValues.B2img = B2imageSrc;
        updatedValues.BJ = BimgJ;
        updatedValues.BLimg = BLimageSrc;
        updatedValues.BLJ = BLimgJ;

        let result = await page.evaluate(() => {
          let topDiv = document.querySelector('app-match-commentary div#topDiv');
          let childDivs = topDiv.querySelectorAll('div');

          for (let i = 0; i < childDivs.length; i++) {
            let spanComment = childDivs[i].querySelector('span.cm-b-comment-c2');
            let spanOver = childDivs[i].querySelector('span.cm-b-over');
            let spanEvent = childDivs[i].querySelector('span.cm-b-ballupdate');

            if (spanComment && spanOver) {
              let commentValue = spanComment.textContent.trim();
              let overValue = spanOver.textContent.trim();
              if (commentValue !== '' && overValue !== '') {
                let eventValue = spanEvent ? spanEvent.textContent.trim() : '';
                let lbElement = document.querySelector('div.live-data div.overs');
                let rrElement = document.querySelector('div.live-score-card div.team-run-rate');
                let lbValue = lbElement ? lbElement.textContent.trim() : '';
                let rrValue = rrElement ? rrElement.textContent.trim() : '';

                return {
                  comment: commentValue,
                  over: overValue,
                  LBs: lbValue,
                  RR: rrValue,
                  Event: eventValue,
                };
              }
            }
          }

          return null;
        });


        if (result !== null) {



        updatedValues.LBs = result.LBs;
        updatedValues.RR = result.RR;
        updatedValues.pship = pshipVal;


          if (result.comment !== previousValue) {
            console.log('Comment:', result.comment);
            console.log('Over:', result.over);
            console.log('Event:', result.Event);
            previousValue = result.comment;
            updatedValues.Comment = result.comment;
            updatedValues.ComOver = result.over;
            updatedValues.ComEvent = result.Event;
          }
        } else {
          console.log('No non-empty value found in child divs');
        }
      }

  }, 1000);
  return intervalId;
};

const stopInterval = (intervalId) => {
  clearInterval(intervalId);
};






app.get('/link', async (req, res) => {
    try {
        const links = await Link.find({});
        res.render('link', {
            link: links[0]
        });
    } catch (err) {
        console.error(err);
        // Handle any errors here
        res.status(500).send('Internal Server Error');
    }
});




app.post('/live', async (req, res) => {
  res.render("index1");     
  const links = await Link.find({});
  console.log('It us',req.body.url);
//	await browser.close();
	 stopInterval(intervalId);
	 updatedValues ={};
	 main(req.body.url);



try {                                                               const updatedLink = await Link.findByIdAndUpdate(                   links[0]._id,                                                    {                                                                   link: req.body.url,                                            ad: links[0].ad                                           },                                                              { new: true }
);                                                                                                                              if (updatedLink) {                                                //  res.redirect('/');       
} else {                                                            res.status(404).send('Link not found');
}                                                           }

catch (err) {                                                     console.error(err);                                             res.status(500).send('Internal Server Error');                                                    }









 });



app.post('/link',(req,res) => {  

  console.log(req.body.link);
  console.log(req.body.ad);

    // a document instance

    var link1 = new Link({ link: req.body.link });
 
    // save model to database

    link1.save(function (err, book) {
      if (err) return console.error(err);
      console.log(req.body.link + " saved to link collection.");
	res.redirect('/');
    });



})





app.post('/linkup', async (req, res) => {
    try {
        const updatedLink = await Link.findByIdAndUpdate(
            req.body.id,
            {
                link: req.body.link,
                ad: req.body.ad
            },
            { new: true } // This option returns the updated document
        );

        if (updatedLink) {
            res.redirect('/link');
        } else {
            res.status(404).send('Link not found'); // Handle the case when the link is not found
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error'); // Handle any errors here
    }
});






app.get('/', async (req, res) => {
  res.render("index1"); 

})










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







async function waitForSelectorWithRetry(page, selector, interval) {
  while (true) {
    try {
      await page.waitForSelector(selector);
      const element = await page.$(selector);
      if (element) {
        return element;
      }
    } catch (error) {
      console.log(`Selector '${selector}' not found. Retrying in 1 minute...`);
      await page.waitForTimeout(interval);
    }
  }
}











let browser = null; // Declare a variable to store the browser instance
let page = null; // Declare a variable to store the page instance

const main = async (url) => {
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-gpu'],
      });
    }

    if (page) {
      await page.close();// Close the existing page
	    page = null;
    }


  page = await browser.newPage();
  await page.setViewport({
   width: 420,
   height: 980,
  });




  await page.exposeFunction('observeElmData', (data) => {
   updatedValues[data.label] = data.newValue;
   //   console.log(data);
   console.log('Updated values:',
    updatedValues);
  });

  const startUrl = url;

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





intervalId = startInterval(page, selectors);




  //  await browser.close();
  } catch (err) {
    console.log(err);
  }
};

async function go () {
try {
        const links = await Link.find({});
        main(links[0].link);
            console.log(links[0]);                              
    } catch (err) {
        console.error(err);
        // Handle any errors here
        res.status(500).send('Internal Server Error');              }
}

go();



io.on('connection', (socket) => {
  setInterval(()=>socket.emit('updatedValues', updatedValues),1000);
});


// Start the server
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

