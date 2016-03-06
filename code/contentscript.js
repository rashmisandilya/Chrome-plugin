var link = window.location.href;
//sending request to get JSON data
function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'https://s3.amazonaws.com/restoscrapper/restaurants.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

//parsing and displaying data to webpage
 function init() {
 loadJSON(function(response) {
  // Parse JSON string into object
    var actual_JSON = JSON.parse(response);
    var index;
    var yelp_rating, ta_rating, fs_rating;
    var yelp_link_found = 0;
    var ta_link_found = 0;
    var fs_link_found = 0;
    for(index in actual_JSON.restaurants) {
    	data = actual_JSON.restaurants[index];
    	for (res_key in data) {
    		var yelp_url = data[res_key]['data']['yelp']['url'];
    		var yelp_count = parseInt(data[res_key]['data']['yelp']['count']);
    		var ta_url = data[res_key]['data']['tripadvisor']['url'];
    		var ta_count = parseInt(data[res_key]['data']['tripadvisor']['count']);
    		var fs_url = data[res_key]['data']['foursquare']['url'];
    		var fs_count = parseInt(data[res_key]['data']['foursquare']['count']);
    		//calculate aggregate rating
    		var aggregate_rating;
    		console.log("Y: "+yelp_count+"T: "+ta_count+"F: "+fs_count);
    		yelp_rating = parseFloat(data[res_key]['data']['yelp']['rating']);
    		ta_rating = parseFloat(data[res_key]['data']['tripadvisor']['rating']);
    		fs_rating = parseFloat(data[res_key]['data']['foursquare']['rating']);
    		console.log("YR: "+yelp_rating+"TR: "+ta_rating+"FR: "+fs_rating);
    		var total_count = parseInt(ta_count) + parseInt(fs_count) + parseInt(yelp_count);
    		aggregate_rating = ((ta_rating*ta_count) + ((fs_rating/2)*fs_count) + (yelp_rating*yelp_count))/total_count;
    		aggregate_rating_precise = aggregate_rating.toFixed(1);

    		//detecting the type of link
    		console.log("Aggregate: "+aggregate_rating);
    		if (link.includes(yelp_url)||yelp_url.includes(link)&&Math.abs(yelp_url.length - link.length)<8) {
    			yelp_link_found = 1;
    		}
    		else if (link.includes(ta_url)||ta_url.includes(link)&&Math.abs(ta_url.length - link.length)<8) {
    			ta_link_found = 1;
    		}
    		else if (link.includes(fs_url)||fs_url.includes(link)&&Math.abs(fs_url.length - link.length)<8) {
    			fs_link_found = 1;
    		}
    	}
    	if (yelp_link_found == 1 || ta_link_found == 1|| fs_link_found == 1) {
    		break;
    	}
	 }
	 if (yelp_link_found == 1) {
	 	
	 	var display_text = '<div  id="topbar"><h3>TripAdvisor Rating: ' + ta_rating +'\t|    \tFourSquare Rating: '+ fs_rating +'\t|    \tAggregate Rating: '+aggregate_rating_precise+'</h3></div >';
	 	$(document.body).prepend(display_text);
	 	//alert("TripAdvisor Rating: " + ta_rating +"\n\nFourSquare Rating: "+fs_rating +"\n\nAggregate: "+aggregate_rating);
	 }
	 else if (ta_link_found == 1) {
	 	var display_text = '<div  id="topbar"><h3>Yelp Rating: ' + yelp_rating +'\t|    \tFourSquare Rating: '+ fs_rating +'\t|    \tAggregate Rating: '+aggregate_rating_precise+'</h3></div >';
	 	$(document.body).prepend(display_text);
	 	//alert("Yelp Rating:  "+ yelp_rating+"\n\nFourSquare Rating: "+fs_rating+"\n\nAggregate: "+aggregate_rating);
	 }
	 else if (fs_link_found == 1) {
	 	var display_text = '<div  id="topbar"><h3>Yelp Rating: ' + yelp_rating +'\t|    \tTripAdvisor Rating: '+ ta_rating +'\t|     \tAggregate Rating: '+aggregate_rating_precise+'</h3></div >';
	 	$(document.body).prepend(display_text);
	 	//alert("Yelp Rating:  "+yelp_rating+"\n\nTripAdvisor Rating: "+ta_rating+"\n\nAggregate: "+aggregate_rating);
	 }


 });
}

init();
