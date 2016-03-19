/*$(function() {
  $('#s').click(function() {
     chrome.tabs.query({'active':true, 'lastFocusedWindow':true}, function(tabs){
     var url = tabs[0].url;
     chrome.tabs.create({url: 'http://www.google.com'});
     var textbox = document.getElementById("lst-ib");
     alert("HI");
     textbox.value = textbox.value + url;
    });
  });
});

document.addEventListener('DOMContentLoaded');*/

document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      d = document;

      var f = d.createElement('form');
      f.action = 'http://www.yahoo.com';
    //  d.getElementById('uh-search-box').value = "YAHOO";
      f.method = 'post';
      var i = d.createElement('input');
      i.type = 'hidden';
      i.name = 'url';
      i.value = tab.url;
      f.appendChild(i);
      d.body.appendChild(f);
      f.submit();
    });
  }, false);
}, false);