const originalLocation = window.location.href;

setInterval(function() {
  if (window.location.href !== originalLocation) {
    console.warn("Possible hijacking detected! Location changed to " + window.location.href);
  }
}, 1000);


if (localStorage.length > 0) {
    console.log("Local Storage data detected:");
    for (let i = 0; i < localStorage.length; i++) {
      console.log(localStorage.key(i) + ": " + localStorage.getItem(localStorage.key(i)));
    }
}
  


const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function() {
    console.warn("Canvas Fingerprinting detected");
    return originalToDataURL.apply(this, arguments);
};
