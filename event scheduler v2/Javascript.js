// ***    Make sure to change the directory paths for 
//        the javascript functions for running locally .  
//		  URLs are spread around the code and it might 
//        need to be replaced in more than one line.    ***

var urlBase = '/api/event/';
var extension = 'php';
var userId = 0;
var user = "";
var usersJson = null;

// Creates an account for the new user.
function doSignUp()
{
	userId = 0;
	var userName = document.getElementById("newUserName").value;
	var password = document.getElementById("newPassword").value;

	if (!userName || userName.length === 0 || !password || password.length === 0)
	{
		document.getElementById("signUpResult").innerHTML = "Please enter a username and password.";
		return;
	}

	// var hash = md5( password );

	document.getElementById("signUpResult").innerHTML = "";
	var jsonPayload = '{"username" : "' + userName + '", "password" : "' + password + '"}';
	var url = "./api/user/create.php";
	var xhr = new XMLHttpRequest();
	// edit path to create.php if necessary
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.withCredentials = false;
	var createdFlag = false;
	try
	{
		xhr.onreadystatechange = function()
		{
		    // API returns 409 if account was not able to be created
            if (this.status == 409)
            {
                document.getElementById("signUpResult").innerHTML = "User could not be created";
                return; // return seems to not do anything in this context
            }

			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("signUpResult").innerHTML = "User has been added"; // Remove msg when working
				createdFlag = true;
			}
		};

		xhr.send(jsonPayload);

	}
	catch(err)
	{
		document.getElementById("signUpResult").innerHTML = err.message;
	}

	// if account is created, go to logged in page
	if (createdFlag)
	{
	    saveCookie();
        window.location.href = "index.html";
	}
}

// gets all the events from an admin
function getAdminEvents(){
	document.getElementById("eventResult").innerHTML = "";
	document.getElementById("eventsOrganized").innerHTML = "";
	var username = document.getElementById("uname").value;
	if(!username || username.length === 0){
		document.getElementById("eventResult").innerHTML = "Please enter a username.";
		return;
	}

	var jsonPayload = '{"username" : "'+ username + '"}';
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/event/createdByUser.php", false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.withCredentials = false;

	try{
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		if(jsonObject.error){
			document.getElementById("eventResult").innerHTML = "User could not be found.";
			return;
		}
		console.log(jsonObject);

		var col = ["Title", "Description", "URL", "StartDate", "EndDate", "Address", "Username", "City"];
		var table = document.createElement("table");
		var tableRow = table.insertRow(-1);

		for(var i = 0; i < col.length; i++){
			var tc = document.createElement("th");
			tc.innerHTML = col[i];
			tableRow.appendChild(tc);
		}
		for(var i = 0; i < jsonObject.length; i++){
			tableRow = table.insertRow(-1);
			for(var j = 0; j < col.length; j++){
				var tc = tableRow.insertCell(-1);
				tc.innerHTML = jsonObject[i][col[j].toLowerCase()];
			}
		}
		document.getElementById("eventsOrganized").innerHTML = "";
		document.getElementById("eventsOrganized").appendChild(table);
	}
	catch(err){
		document.getElementById("eventResult").innerHTML = err;
		document.getElementById("eventResult").style = "color: red;";
		console.log(err);
	}
}

// gets events for users
function getUserEvents(){
	document.getElementById("userEvent").innerHTML = "";
	document.getElementById("eventAttendance").innerHTML = "";
	var username = document.getElementById("username").value;
	if(!username || username.length === 0){
		document.getElementById("eventAttendance").innerHTML = "Please enter a username.";
		return;
	}

	var jsonPayload = '{"username" : "'+ username + '"}';
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/enrollment/userEnrollments.php", false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.withCredentials = false;

	try{
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		if(jsonObject.length == 0){
			document.getElementById("eventAttendance").innerHTML = "User could not be found.";
			return;
		}
		console.log(jsonObject);

		var col = ["Username","Title"];
		var table = document.createElement("table");
		var tableRow = table.insertRow(-1);

		for(var i = 0; i < col.length; i++){
			var colName = document.createElement("th");
			colName.innerHTML = col[i];
			tableRow.appendChild(colName);
		}
		for(var i = 0; i < jsonObject.length; i++){
			tableRow = table.insertRow(-1);
			for(var j = 0; j < col.length; j++){
				var tc = tableRow.insertCell(-1);
				tc.innerHTML = jsonObject[i][col[j].toLowerCase()];
			}
		}
		document.getElementById("userEvent").innerHTML = "";
		document.getElementById("userEvent").appendChild(table);
	}
	catch (err){
		document.getElementById("eventAttendance").innerHTML = err;
		document.getElementById("eventAttendance").style = "color: red;";
		console.log(err);
	}


}

// Logs existing user into account.
function doLogin()
{
	userId = 0;

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	// var hash = md5( password );

	user = login;

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"username" : "' + login + '", "password" : "' + password + '"}';
	var url = 'http://vh1/api/user/login.' + extension; //needs to be modified 
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.withCredentials = false;
	// console.log(jsonPayload);
	try
	{
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		userId = jsonObject.id;

		// console.log(jsonObject['status']);

		if( jsonObject['status'] != true )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		sessionStorage.setItem('userId', login);

		saveCookie();
		var usertype = "";
		usertype = getRole();
		console.log(usertype);

		if(usertype == "admin"){
			console.log("user is admin");
			window.location.href = "dashboard.html";
		}

		else if (usertype == "superadmin")
			window.location.href = "superadmin.html";

	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

// gets role of a user when logging in 
function getRole()
{
	userId = "";
	var login = document.getElementById("loginName").value;
	// var hash = md5( password );

	user = login;

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"username" : "' + login + '"}';
	var url = "http://vh1/api/user/getRole.php" //needs to be modified
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.withCredentials = false;
	// console.log(jsonPayload);
	try
	{

		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		// console.log(jsonObject);
		userId = jsonObject.user_type;
		// console.log(userId);
		return userId;
		// console.log(jsonObject['status']);

		if( jsonObject['status'] != true )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

// saves cookies for login
function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "userId=" + userId + ";expires=" + date.toGMTString();
}

// read cookies for login
function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		//document.getElementById("userId").innerHTML = "Logged in as " + userId;
	}
}

//returns to login
function returnToLogin()
{
	window.location.href = "index.html";
}

//moves to signUp page
function moveToSignUp()
{
	window.location.href = "signUp.html";
}

// displays all the events. adding searchBox as BOOL for focusing lists only in main box
function renderEvents(titles, descriptions, urls, dates, endDates, addresses, citys, eventIds, button, searchBox){

	if (descriptions == null){
		var list = document.createElement('ul');
		list.setAttribute("class", 'eventsCreated');
	} else{
		var list = document.createElement('ul');
	}



	for(let i = 0; i < titles.length; i++){
		var item = document.createElement('li');

		// console.log(titles[i]);

		if(searchBox) {
			item.setAttribute("class", "event-search");
			item.setAttribute("id", titles[i]);
			item.setAttribute("data-title", citys[i]); // Represents City for filter
			item.setAttribute("text", dates[i]); // Represents Start Date for filter
			item.setAttribute("value", endDates[i]); // Represents End Date for filter
		} else {
			item.setAttribute("class", "event-list");
		}

		var title = document.createElement('p');
		var t = document.createTextNode(titles[i]);
		title.appendChild(t);

		if (descriptions != null){
			var description = document.createElement('p');
			var t = document.createTextNode(descriptions[i]);
			description.appendChild(t);
		}

		var url = document.createElement('p');
		var t = document.createTextNode(urls[i]);
		url.appendChild(t);

		if (descriptions != null){
			var date = document.createElement('p');
			var t = document.createTextNode(dates[i]);
			date.appendChild(t);

			var endDate = document.createElement('p');
			var t = document.createTextNode(endDates[i]);
			endDate.appendChild(t);

			var address = document.createElement('p');
			var t = document.createTextNode(addresses[i]);
			address.appendChild(t);

			var city = document.createElement('p');
			var t = document.createTextNode(citys[i]);
			city.appendChild(t);
		}

		if (button == 1){
			var button1 = document.createElement('button');
			button1.textContent = "Enroll";
			button1.setAttribute("onclick", "enroll('" + titles[i] + "', '" + descriptions[i] + "', '" + urls[i] + "', '"  + dates[i] + "', '" + endDates[i] + "' , '" + addresses[i] + "', '" + citys[i] + "', '" + eventIds[i] + "')");
		}

			// var button2 = document.createElement('button');
			// button2.textContent = "Info";
			// button2.setAttribute("onclick", "alert('get info')");

		item.appendChild(title);

		if (descriptions != null){
			item.appendChild(date);
			item.appendChild(description);
		}
		item.appendChild(url);
		if (descriptions != null){
			item.appendChild(address);
			item.appendChild(city);
			item.appendChild(endDate);
		}

		if (button == 1){
			item.appendChild(button1);
		}

		// item.appendChild(button2);

		list.appendChild(item);

	}



	return list;
}

// test function 
function createEventt(){
	alert("Hello World!");
}

// function for enrolling events
function enroll(title, description, url, startdate, enddate, address, city, event_id){

	var username = sessionStorage.getItem('userId');
	// var jsonPayload = {"username": username, "eventID": eventID.toString()};
	var jsonPayload = '{"username" : "' + username + '", "eventID" : "' + event_id + '"}';
	var url = "http://vh1/api/enrollment/enroll.php"; //needs to be changed
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	console.log(jsonPayload);
	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		console.log(jsonObject);

		document.getElementById('eventResult').innerHTML = "User attended successfully!";
		document.getElementById("eventResult").style = "color: red;";


		// document.getElementById('enrolled').appendChild(renderEvents([title], [description], [url], [startdate], [enddate], [address], [city], [event_id], 0, 0));
		location.reload();


	} catch (err){
		document.getElementById('eventResult').innerHTML = err;
		document.getElementById("eventResult").style = "color: red;";
		console.log(err);
	}
}

// sorts events by city
function sortByCity() {
	filter = document.getElementById('fname').value;
	var event_list = document.querySelectorAll('.event-search');
	var isFound = 0;
	[].slice.call(event_list).forEach(function(temp) {
		if (temp.getAttribute('data-title').toLowerCase() == filter.toLowerCase()) {
			temp.parentNode.appendChild(temp);
			isFound = 1;
		} else {
			temp.parentNode.appendChild(temp);
			temp.setAttribute('style','display:none');
		}
	});
	if (!isFound) {
		alert("No city under that name found");
		showAllEvents();
	}
	document.getElementById('fname').value = "";
}

// sorts events by date
function sortByDate() {
	sDate = document.getElementById('sDate').value;
	eDate = document.getElementById('eDate').value;

	if(sDate > eDate) {
		alert("Start date is later than End Date");
		document.getElementById('sDate').value = "";
		document.getElementById('eDate').value = "";
		showAllEvents();
		return;
	}

	var event_list = document.querySelectorAll('.event-search');
	var isFound = 0;
	[].slice.call(event_list).forEach(function(temp) {
		var tempStartDate = temp.getAttribute('text');
		var tempEndDate = temp.getAttribute('value');
		if (tempStartDate >= sDate && tempEndDate <= eDate && tempEndDate >= tempStartDate) {
			temp.parentNode.appendChild(temp);
			isFound = 1;
		} else {
			temp.parentNode.appendChild(temp);
			temp.setAttribute('style','display:none');
		}
	});
	if (!isFound) {
		alert("No event found during that date");
		showAllEvents();
	}

	document.getElementById('sDate').value = "";
	document.getElementById('eDate').value = "";
}

// shows all the events
function showAllEvents() {
	var event_list = document.querySelectorAll('.event-search');
	[].slice.call(event_list).forEach(function(temp) {
		temp.setAttribute('style','display:flex');
	});
}

// function that renders everything in the main dashboards. 
window.onload = function() {

	if(window.location.pathname == "/dashboard.html"){
		// get all active events

		// var jsonPayload = '{"eId" : "' + eId + '"}';
		var jsonPayload = {};
		var url = urlBase + '/eventsApproved.' + extension;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, false);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.withCredentials = false;
		try {
			xhr.send(jsonPayload);
			var jsonObject = JSON.parse( xhr.responseText );
			// console.log(jsonObject);
			// console.log(jsonObject[0]['event_id']);
			// console.log(jsonObject[1]);

			var event_id = [];
			var title = [];
			var description = [];
			var url = [];
			var startdate = [];
			var enddate = [];
			var address = [];
			var is_approved = [];
			var username = [];
			var city = [];

			for (let i = 0; i < jsonObject.length; i++){

				event_id[i] = jsonObject[i]['event_id'];
				title[i] = jsonObject[i]['title'];
				description[i] = jsonObject[i]['description'];
				url[i] = jsonObject[i]['url'];
				startdate[i] = jsonObject[i]['startdate'];
				enddate[i] = jsonObject[i]['enddate'];
				address[i] = jsonObject[i]['address'];
				is_approved[i] = jsonObject[i]['is_approved'];
				username[i] = jsonObject[i]['username'];
				city[i] = jsonObject[i]['city'];
			}

			// send these events to be rendered
			// titles, descriptions, urls, dates, endDates, addresses, citys, eventIds
			document.getElementById('availableEvents').appendChild(renderEvents(title, description, url, startdate, enddate, address, city, event_id, 1, 1));


		} catch (err){
			console.log(err);
			var jsonObject = JSON.parse( xhr.responseText );
		}

		// get events attending
		var jsonPayload = '{"username" : "' + sessionStorage.getItem("userId") + '"}';
		console.log(jsonPayload);
		var url = "http://vh1/api/enrollment/test.php";
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, false);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.withCredentials = false;


		try {
			xhr.send(jsonPayload);

			var jsonObject = JSON.parse( xhr.responseText );
			// console.log(jsonObject);

			var event_id = [];
			var title = [];
			var description = [];
			var url = [];
			var startdate = [];
			var enddate = [];
			var address = [];
			var is_approved = [];
			var username = [];
			var city = [];

			for (let i = 0; i < jsonObject.length; i++){

				event_id[i] = jsonObject[i]['event_id'];
				title[i] = jsonObject[i]['title'];
				description[i] = jsonObject[i]['description'];
				url[i] = jsonObject[i]['url'];
				startdate[i] = jsonObject[i]['startdate'];
				enddate[i] = jsonObject[i]['enddate'];
				address[i] = jsonObject[i]['address'];
				is_approved[i] = jsonObject[i]['is_approved'];
				username[i] = jsonObject[i]['username'];
				city[i] = jsonObject[i]['city'];
			}
			// console.log(title);

			document.getElementById("enrolled").appendChild(renderEvents(title, description, url, startdate, enddate, address, city, event_id, 0, 0));


		} catch (err) {
			console.log(err);
		}

		// get events created
		var jsonPayload = '{"username" : "' + sessionStorage.getItem("userId") + '"}';
		console.log(jsonPayload);
		var url = "http://vh1/api/event/createdByUser.php";
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, false);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.withCredentials = false;

		try {
			// console.log(jsonPayload);
			xhr.send(jsonPayload);
			var jsonObject = JSON.parse( xhr.responseText );
			console.log(jsonObject);

			var title = [];
			var url = [];

			for (let i = 0; i < jsonObject.length; i++){

				title[i] = jsonObject[i]['title'];
				url[i] = jsonObject[i]['url'];
			}

			document.getElementById("newevents").appendChild(renderEvents(title, null, url, null, null, null, null, null, 0, 0));

		} catch (err) {
			console.log(err);
		}
	}

}

// displays the form for creating aan event
function displayCreateForm(){

	if(document.getElementById("creationArea").style.display == 'flex')
		document.getElementById("creationArea").style.display = "none";

	else if(document.getElementById("creationArea").style.display == 'none')
		document.getElementById("creationArea").style.display = 'flex';
}

// takes user input to create events
function createEvent(){

	var title = document.getElementById("etitle").value;
	var description = document.getElementById("edesc").value;
	var url = document.getElementById("eurl").value;
	var startdate = document.getElementById("esd").value;
	var enddate = document.getElementById("eed").value;
	var address = document.getElementById("eadd").value;
	var city = document.getElementById("ecity").value;

	var jsonPayload = '{"title" : "' + title + '", "description" : "' + description +  '", "url" : "' + url +  '", "startdate" : "' + startdate +  '", "enddate" : "' + enddate +  '", "address" : "' + address +  '", "username" : "' + sessionStorage.getItem('userId') +  '", "city" : "' + city +  '"}';


	var url = "http://vh1/api/event/create.php"; //needs to be changed
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.withCredentials = false;


	try {
		// console.log(jsonPayload);
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );

		title = document.getElementById("etitle").value = "";
		description = document.getElementById("edesc").value = "";
		url = document.getElementById("eurl").value = "";
		startdate = document.getElementById("esd").value = "";
		enddate = document.getElementById("eed").value = "";
		address = document.getElementById("eadd").value = "";
		city = document.getElementById("ecity").value = "";

		displayCreateForm();

	} catch (error) {
		console.log(error);
	}
}

function theLogout(){

	sessionStorage.clear();
	window.location.href = "index.html";
}