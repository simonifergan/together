import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true
})

const API_KEY = 'AIzaSyAXeo5fckdLgf_cfKs78MtTsARYWluZM7U';
var connecting = false

export default {
    getGoogleLocation,
    connectGoogleApi
}

function connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyAXeo5fckdLgf_cfKs78MtTsARYWluZM7U';

    let elGooglePlacesApi = document.querySelector('.google');
    if (!elGooglePlacesApi) {
        // console.log('nogoogle')
        elGooglePlacesApi = document.createElement('script');
        elGooglePlacesApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
        elGooglePlacesApi.async = true;
        elGooglePlacesApi.classList.add('google')
        document.body.append(elGooglePlacesApi);
    }
    return new Promise((resolve, reject) => {
        elGooglePlacesApi.onload = resolve;
        elGooglePlacesApi.onerror = () => reject('Google script failed to load')
    })
}

async function getGoogleLocation(query) {
    const elImg = document.createElement('img')
    var request = {
        query,
        fields: ['photos'],
    };
    const service = new google.maps.places.PlacesService(elImg);
    return new Promise((res, rej) => {
        service.findPlaceFromQuery(request, (results, status) => {
            if (results) res(results[0].photos[0].getUrl())
            else res(null)
        })
    })

}