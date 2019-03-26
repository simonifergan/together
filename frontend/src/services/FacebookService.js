function loadScript() {
  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  return Promise.resolve();
}
function getStatus() {
  return new Promise((resolve, reject) => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: '594742284326154',
        cookie: true,
        xfbml: true,
        version: 'v3.2'
      });

      FB.AppEvents.logPageView();

      FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
      });

      function statusChangeCallback(response) {
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
          // Logged into your app and Facebook.
          useAPI();
        } else {
          resolve(false);
        }
      }

      function useAPI() {
        FB.api('/me', 'GET', { fields: 'first_name, last_name, name, id, email, picture.width(300).height(300)' }, function (response) {
          resolve(response);
        });
      }
    };
  })

}




async function getUserInfo() {
  // return 
  await loadScript();
  const userFBInfo = await getStatus();
  return userFBInfo;
}

export default {
  getUserInfo,

}

// How to start and check if someone is already logged in to facebook
// RESPONSE OBJECT:
// {
//     status: 'connected',
//     authResponse: {
//         accessToken: '...',
//         expiresIn:'...',
//         signedRequest:'...',
//         userID:'...'
//     }
// }