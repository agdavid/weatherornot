const path = require('path');
const express = require('express');
const hbs = require('hbs');
const env = require('dotenv').config({ path: '../.env' });

const app = express();
const port = process.env.PORT;

const { geocode, forecast } = require('./utils.js');

// define pathes for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// setup handlebars
app.set('view engine', 'hbs'); // set templating engine
app.set('views', viewsPath); // point to custom views directory instead of /views
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Node Weather or Not App',
    name: 'Thomas'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    name: 'Thomas'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'Thomas',
    message: "We'll help you right away!"
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address'
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error
        });
      }
      console.log(`Got latitude: ${latitude}`);
      console.log(`Got longitude: ${longitude}`);
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error
          });
        }
        res.send({
          forecast: forecastData,
          location: location,
          address: req.query.address
        });
      });
    }
  );
});

// add wildcard for sub-route of /help
app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Thomas',
    message: 'Help article not found'
  });
});

// add wildcard route as catch-all for 404
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Thomas',
    message: 'Page not found'
  });
});

app.listen(port, () => {
  console.log(`Server is up on Port ${port}`);
});
