import StorageService from './StorageService.js'

// const API_KEY = 'AIzaSyAXeo5fckdLgf_cfKs78MtTsARYWluZM7U';  // YANAI KEY
const API_KEY = 'AIzaSyCHshynsRoN_NeY7RLOs8wZv9AOgUGHi2A';  // simon key

export default {
    getGoogleLocation,
    connectGoogleApi,
    getAutocomplete,
    getPlaceDetails
}

function connectGoogleApi() {
    if (window.google) return Promise.resolve()
    let elGooglePlacesApi = document.querySelector('.google');
    if (!elGooglePlacesApi) {
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

async function getAutocomplete(query, types) {
    const service = new google.maps.places.AutocompleteService()
    const requestCity = { input: query, types }
    return new Promise((res, rej) => {
        service.getPlacePredictions(requestCity, results => {
            if (results) res(results)
            else res(null)
        })
    })
}

async function getPlaceDetails(placeId) {

    const elImg = document.createElement('img')
    var request = {
        placeId,
        fields: ['address_components']
    };
    const service = new google.maps.places.PlacesService(elImg);
    return new Promise((res, rej) => {
        service.getDetails(request, (results, status) => {
            if (results) {
                const country = results.address_components.find(component => component.types.some(type => type === 'country'))
                res(country.short_name)
            } else res(null)
        })
    })
}

async function getGoogleLocation(query, fields) {
    const elImg = document.createElement('img')
    var request = {
        query,
        fields,
    };
    const service = new google.maps.places.PlacesService(elImg);
    return new Promise((res, rej) => {
        service.findPlaceFromQuery(request, (results, status) => {
            if (results && results[0].photos) {
                const photoSrc = results[0].photos[0].getUrl()
                res(photoSrc)
            }
            else res(null)
        })
    })
}