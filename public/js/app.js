console.log('Client side JS file loaded');

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-one');
const messageTwo = document.querySelector('#message-two');

weatherForm.addEventListener('submit', e => {
  e.preventDefault();
  const location = search.value;
  messageOne.textContent = 'Fetching weather...';
  messageTwo.textContent = '';
  fetchWeather(location);
});

const fetchWeather = location => {
  fetch(`http://localhost:3000/weather?address=${location}`).then(response => {
    response.json().then(data => {
      if (data.error) {
        messageOne.textContent = data.error;
      } else {
        messageOne.textContent = data.location;
        messageTwo.textContent = `${data.forecast.summary} The temperature is ${data.forecast.temperature} degrees and a ${data.forecast.precipProbability}% chance of precipitation.`;
      }
    });
  });
};
