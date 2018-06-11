'use strict';

var log = args => false && console.log(...args);

var init = () => {
  const root = document.getElementById('irc_cc');
  if (root) {
    const shares = [...root.querySelectorAll('.irc_mmc [role="button"][jsaction="irc.sh"]')];
    if (shares) {
      shares.forEach((share, index) => {
        const button = share.cloneNode(false);
        button.appendChild(Object.assign(document.createElement('span'), {
          textContent: 'View Image'
        }));
        button.removeAttribute('jsaction');
        button.removeAttribute('href');

        button.addEventListener('click', () => {
          const images = document.querySelectorAll('#irc_cc img.irc_mi');
          chrome.runtime.sendMessage({
            method: 'open',
            url: images[index].src
          });
        });
        share.parentNode.insertBefore(button, share);
      });
    }
    else {
      log('share buttons are not found');
    }
  }
  else {
    log('no root');
  }
};

window.addEventListener('message', function _(e) {
  if (e.data.method === 'ggl-mgs-rdy') {
    window.removeEventListener('message', _);
    init();
  }
});
// Detect the load of the first image
// this module unloads itself when the first load is detected.
var script = document.createElement('script');
script.textContent = `  {
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    open.apply(this, arguments);
    if (url.indexOf('/async/imgrc') !== -1) {
      XMLHttpRequest.prototype.open = open;
      window.postMessage({
        method: 'ggl-mgs-rdy'
      }, '*');
    }
  }
}`;
document.documentElement.appendChild(script);
document.documentElement.removeChild(script);
