// MIT License
//
// Copyright (c) 2019 YuigaWada
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.



const session = sessionStorage.getItem('visitedCodeDayUrl')
const selector = '#submitForm > div > div.col-xs-12.col-md-4.side-right > div:nth-child(4) > div.panel-body > span > a'
const editPageTemplate = 'https://publish.codeday.me/post/publist?site=jp&id='

$(document).ready( function(){ // ** MAIN ** //
  console.log('FuckCodeDay is loaded correctly.')
  var shapedUrl = removeQuery(window.location)

  var hasVisited = session == shapedUrl
  if (hasVisited) {
    sessionStorage.removeItem('visitedCodeDayUrl')
    return
  } else {
    sessionStorage.setItem('visitedCodeDayUrl', shapedUrl)
    displayLoading()
  }



  var isEditingPage = window.location.origin == 'https://publish.codeday.me'
  if (!isEditingPage) { // Assumes that this page is like https://codeday.me/jp/qa/〜
    var postId = getPostId(shapedUrl)

    var editPageUrl = editPageTemplate + postId
    $.ajax({
        url: editPageUrl
      })
      .then(
        //success
        function(raw_html) {
          var targetUrl = simulateQuerySelector(raw_html, selector).getAttribute('href')
          jump2Target(targetUrl)
        },
        //false
        function() {
          alert("FuckCodeDay: Failed to get target url.")
        })
  } else {
    jump2Target(document.querySelector(selector))
  }
})

function displayLoading() {
  document.getElementsByTagName('html')[0].innerHTML
  = "<div align=\"center\"><h1>Redirecting...</h1>" +
    "<p>FuckCodeDay by <a href=\"https://twitter.com/yuigawda\">Yuiga Wada</a></p></div>"
}

function removeQuery(urlInfo) {
  var newUrl = urlInfo.origin + urlInfo.pathname

  return newUrl
}

function getPostId(url) {
  var matchResult = url.match(/[0-9]+\.html/)

  return matchResult.length != 0 ? matchResult[0].slice(0, -5) : null
}

function simulateQuerySelector(raw_html, selector) { // ** HACK ** //
  var div = document.createElement('div')

  div.innerHTML = raw_html // converts to innner html in order to simulate .querySelector() function.
  div.style.display = 'none'
  document.body.appendChild(div)

  var result = document.querySelector(selector)

  document.body.removeChild(div)

  return result
}

function jump2Target(url) {
  location.href = url
}
