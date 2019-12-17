const request = require('request');

module.exports = {
  geocode,
  forecast
};

function geocode(address, callback) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&limit=1`;
  console.log(url);
  request(
    {
      url,
      json: true
    },
    (error, { body }) => {
      if (error) {
        callback('Unable to connect to location services', undefined);
      } else if (body.features === undefined) {
        callback('Unable to find location, try another search', undefined);
      } else if (body.features.length === 0) {
        callback('Unable to find location, try another search', undefined);
      } else {
        console.log(body);
        console.log(body.features);
        console.log(body.features[0]);
        const data = {
          latitude: body.features[0].center[1],
          longitude: body.features[0].center[0],
          location: body.features[0].place_name
        };

        callback(undefined, data);
      }
    }
  );
}

function forecast(latitude, longitude, callback) {
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_SECRET_KEY}/${latitude},${longitude}`;

  request(
    {
      url,
      json: true
    },
    (error, { body }) => {
      if (error) {
        callback('Unable to connect to weather service', undefined);
      } else if (body.error) {
        callback('Unable to find weather location', undefined);
      } else {
        const { currently, daily } = body;
        const { temperature, precipProbability, precipType } = currently;

        const data = {
          summary: daily.data[0].summary,
          temperature,
          precipProbability,
          precipType
        };
        callback(undefined, data);
      }
    }
  );
}
