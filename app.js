const ejs = require('ejs')
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'));

app.use(cookieParser());

var blankCookie = {
  "cookies": {
      "chocolateChip": 0,
      "oatmeal": 0,
      "sugar": 0
    }
};

app.get('/', (req, res) => {
  // check if the cookie cookie exists, if so render based on the values of the
  // cookie, if not render home with blank cookie.
  if (req.cookies.cookies) {
    var getCookie = JSON.parse(req.cookies.cookies);
    return res.render('home', {
      newCookie:getCookie
    });
  }

  res.cookie('cookies', JSON.stringify(blankCookie), {
    maxAge: 9000000
  });

  return res.render('home',{newCookie:blankCookie})
});

app.post('/newCookie/:cookie', (req, res) => {
  // on post get the type of cookie from the request parameter, use that to identify
  // the object in the dictionary and add one to its count. Then overwrite the
  // old cookie with a new cookie containing new information. Only one cookie
  // of a given name can exist at once, cookie parser overwrites it automatically

  // name of cookie
  thisCookie = req.params.cookie;

  // cookie cookie contents
  let cookieContainer = JSON.parse(req.cookies.cookies);

  cookieContainer["cookies"][thisCookie]++;
  let newCookie = JSON.stringify(cookieContainer);
  res.cookie('cookies', newCookie, {maxAge:9000000});
  res.redirect('/');
});

app.post('/reset',(req,res)=>{
  res.cookie('cookies', JSON.stringify(blankCookie), {
    maxAge: 9000000
  });
  var x = JSON.parse(req.cookies.cookies);
  return res.redirect('/');
})

app.listen(8080, function() {
  console.log('cookies ready!');
});
