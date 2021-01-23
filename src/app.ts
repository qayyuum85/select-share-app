import axios from 'axios';
import { GoogleGeoCodingResponse } from './types';
const gmap = require('load-google-maps-api');

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

const apiKey = process.env.GOOGLE_API_KEY!;

// Load the map
gmap({ key: apiKey })
  .then(function (googleMaps: any) {
    new googleMaps.Map(document.querySelector('#map')!, {
      center: {
        lat: 40.7484405,
        lng: -73.9944191,
      },
      zoom: 12,
    });
  })
  .catch(function (error: unknown) {
    console.error(error);
  });

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;
  axios
    .get<GoogleGeoCodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${apiKey}`
    )
    .then((response) => {
      if (response.data.status !== 'OK') {
        throw new Error('Could not fetch location!');
      }

      const coordinates = response.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById('map')!, {
        center: coordinates,
        zoom: 16,
      });

      new google.maps.Marker({
        position: coordinates,
        map: map,
      });
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener('submit', searchAddressHandler);
