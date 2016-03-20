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

// document.addEventListener('DOMContentLoaded', function() {
//   var checkPageButton = document.getElementById('checkPage');
//   checkPageButton.addEventListener('click', function() {

//     chrome.tabs.getSelected(null, function(tab) {
//       d = document;

//       var f = d.createElement('form');
//      // var url = tabs[0].url;
//       f.action = 'http://pacific-forest-32636.herokuapp.com';
//     //  d.getElementById('uh-search-box').value = "YAHOO";
//       f.method = 'post';
//       var i = d.createElement('input');
//       i.type = 'hidden';
//       i.name = 'url';
//       i.value = tab.url;
//       f.appendChild(i);
//       d.body.appendChild(f);
//       f.submit();
//       var i = d.getElementById('query_url');
//       i.value = tabs[0].url;

//     });
//   }, false);
// }, false);

	function loaded(){

	//myframe.document.getElementById("query_url").value = "hello";
	//var fames = document.getElementsByTagName('myframe')[0];
	//var myframes = document.getElementById('query_url');
	//fames.value = "testing";
	//alert(tabs[0].url);
	//document.getElementById('query_submit').click();
	//alert(document.tabs[0].url);
	//document.myframe.getElementById('query_url').value = chrome.tabs[0].url;
}
