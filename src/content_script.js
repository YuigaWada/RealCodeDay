const session = sessionStorage.getItem('visitedCodeDay')

const selector = '#submitForm > div > div.col-xs-12.col-md-4.side-right > div:nth-child(4) > div.panel-body > span > a'
const editPageTemplate = 'https://publish.codeday.me/post/publist?site=jp&id='

var hasLoaded = false

window.onload = function() { // ** MAIN ** //
  console.log('FuckCodeDay is loaded correctly.')

  var fromCodeDay = session == 'yes'
  sessionStorage.setItem('visitedCodeDay', fromCodeDay ? 'no' : 'yes');

  if(fromCodeDay) {
    sessionStorage.removeItem('visitedCodeDay');
    return
  }




  var isEditingPage = window.location.origin == 'https://publish.codeday.me'
  if (!isEditingPage) { // Assumes that this page is like https://codeday.me/jp/qa/〜
    var shapedUrl = removeQuery(window.location)
    var postId = getPostId(shapedUrl)

    var ediPageUrl = editPageTemplate + postId
    $.ajax({
        url: ediPageUrl
      })
      .then(
        //success
        function(raw_html) {
          var targetUrl = simulateQuerySelector(raw_html, selector).getAttribute('href')
          jump2Target(targetUrl)
        },
        //false
        function() {
          alert("FuckCodeDay: Failed to get target url.");
        });
  } else {
    jump2Target(document.querySelector(selector))
  }
};


function removeQuery(urlInfo) {
  var newUrl = urlInfo.origin + urlInfo.pathname

  return newUrl
}

function getPostId(url) {
  var matchResult = url.match(/[0-9]+\.html/);

  return matchResult.length != 0 ? matchResult[0].slice(0, -5) : null;
}

function simulateQuerySelector(raw_html, selector) { // ** HACK ** //
  var div = document.createElement('div')

  div.innerHTML = raw_html // converts to innner html in order to simulate .querySelector() function.
  div.style.display = 'none'
  document.body.appendChild(div)

  var result = document.querySelector(selector)

  document.body.removeChild(div);

  return result
}

function jump2Target(url) {
  location.href = url
}
