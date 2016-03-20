document.addEventListener("DOMContentLoaded", function(event) { 
  //do work
	chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

	 // since only one tab should be active and in the current window at once
	 // the return variable should only have one entry
	 var activeTab = arrayOfTabs[0];
	 if(activeTab.url){
			 document.getElementById('myframe').src += "/?search=" + activeTab.url;
	 }

});
});
