function decode(s) {
  return decodeURIComponent(s.split("+").join(" "));
}

var urlVars = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {

  urlVars[decode(arguments[1])] = decode(arguments[2]);

  console.log(urlVars);

});
