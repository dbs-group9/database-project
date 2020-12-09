// var urlBase = 'http://knightacts.ueuo.com'; //http://vh1/api/event/eventsApproved.php
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
	var url = "http://eventscheduler/api/user/create.php";
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
	var url = 'http://vh1/api/user/login.' + extension;
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

function getRole()
{
	userId = "";
	var login = document.getElementById("loginName").value;
	// var hash = md5( password );

	user = login;

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"username" : "' + login + '"}';
	var url = "http://vh1/api/user/getRole.php"
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

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "userId=" + userId + ";expires=" + date.toGMTString();
}

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

function doLogout()
{
	userId = 0;
	document.cookie = "userId= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function returnToLogin()
{
	window.location.href = "index.html";
}

function moveToSignUp()
{
	window.location.href = "signUp.html";
}

function returnToContactPage()
{
	window.location.href = "contactPage.html";
	getAllContacts();
}

function getTitle()
{
    readCookie();
    var url = urlBase + '/api/user/get/' + userId;

    var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
		    json = JSON.parse( xhr.responseText );

			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("userNameTitle").innerHTML = json.Login + "'s  Knightacts";
			}
			else
			{
			    document.getElementById("userNameTitle").innerHTML = "My Knightacts";
			}
		};
		xhr.send(null);
	}
	catch(err)
	{
		document.getElementById("userNameTitle").innerHTML = "My Knightacts";
	}
}

function goToAddContact()
{
	window.location.href = "createNewContact.html";
}

// Creates a new contact
function addContact()
{
	readCookie();

	var firstName = document.getElementById("firstNameText").value;
	var lastName = document.getElementById("lastNameText").value;
	var emailContact = document.getElementById("emailContact").value;
	var phoneNumber = document.getElementById("phoneNumber").value;
	var addressContact = document.getElementById("addressContact").value;
	var notesContact = document.getElementById("notesContact").value;
	document.getElementById("contactAddResult").innerHTML = "";

	if (firstName == '' || lastName == '')
	{
		document.getElementById("contactAddResult").innerHTML = "Please enter the required fields.";
		return;
	}


	else
	{
		var jsonPayload = '{"FirstName" : "' + firstName + '", "LastName" : "' +lastName+ '", "Email" : "' +emailContact+ '", "PhoneNumber" : "' +phoneNumber+ '", "Address" : "' +addressContact+ '", "AdditionalNotes" : "' +notesContact+ '", "UserID" : ' + userId + '}';
		var url = urlBase + '/api/contact/create.' + extension;

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					document.getElementById("contactAddResult").innerHTML = "Knightact has been Added";

					setTimeout(returnToContactPage, 1000);
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactAddResult").innerHTML = err.message;
		}
	}
}

// SearchContacts2() is what is currently being called in contactPage.html. It does a "live" search
// based on tag name. Needs to instead go off of firstName, lastName of the contact objects - which I don't think
// are being stored. Also needs to be connected to the API.

// TODO : Change to read from var usersJson - json object
function searchContacts()
{
	var srch = document.getElementById("searchBar").value;
	var contactList = "";
	var input, filter, ul, li, a, i, txtValue;

    if (srch == '')
    {
        hideAllContacts();
        return;
    }


	// This block of code does a "live"
    input = document.getElementById("searchBar");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if ((txtValue.toUpperCase().indexOf(filter) > -1) && (a.id != "message")) {
            li[i].style.display = "";
        } else {
			li[i].style.display = "none";
	 	}
    }
}

function loadEditPage()
{
	var urlParams = new URLSearchParams(window.location.search);

	var firstName = document.getElementById("firstNameText");
	var lastName = document.getElementById("lastNameText");
	var emailContact = document.getElementById("emailContact");
	var phoneNumber = document.getElementById("phoneNumber");
	var addressContact = document.getElementById("addressContact");
	var notesContact = document.getElementById("notesContact");

	var jsonPayload = null;
	var url = urlBase + '/api/contact/get/' + Number(urlParams.get('id'));

	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{

			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );

				firstName.value = jsonObject.contact.FirstName;
				lastName.value = jsonObject.contact.LastName;
				emailContact.value = jsonObject.contact.Email;
				phoneNumber.value = jsonObject.contact.PhoneNumber;
				addressContact.value = jsonObject.contact.Address;
				notesContact.value = jsonObject.contact.AdditionalNotes;

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
}

function editPage()
{
    var urlParams = new URLSearchParams(window.location.search);

	readCookie();

	var firstName = document.getElementById("firstNameText").value;
	var lastName = document.getElementById("lastNameText").value;
	var emailContact = document.getElementById("emailContact").value;
	var phoneNumber = document.getElementById("phoneNumber").value;
	var addressContact = document.getElementById("addressContact").value;
	var notesContact = document.getElementById("notesContact").value;

	if (firstName == '' || lastName == '')
	{
		document.getElementById("contactEditResult").innerHTML = "Please enter the required fields.";
		return;
	}

	else
	{
		//This will allow the change
		var jsonPayload = '{"FirstName" : "' + firstName + '", "LastName" : "' +lastName+ '", "Email" : "' +emailContact+ '", "PhoneNumber" : "' +phoneNumber+ '", "Address" : "' +addressContact+ '", "AdditionalNotes" : "' +notesContact+ '", "ID" : ' + Number(urlParams.get('id')) + '}';
		var url = urlBase + '/api/contact/update';

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{

				if (this.readyState == 4 && this.status == 200)
				{
					document.getElementById("contactEditResult").innerHTML = "Knightact has been Updated";

					setTimeout(returnToContactPage, 1000);

				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactEditResult").innerHTML = err.message;
		}
	}
}


function goToEditPage(id)
{
	window.location.href = "editContact.html?id=" + Number(id);
}

function deleteContact()
{
    var urlParams = new URLSearchParams(window.location.search);

	readCookie();

	var prompt = confirm("Are you sure you want to delete this Knightact?");
	if(prompt)
	{
		var url = urlBase + '/api/contact/delete/' + Number(urlParams.get('id'));
		var jsonPayload = null;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
		    xhr.onreadystatechange = function()
			{

				if (this.readyState == 4 && this.status == 200)
				{

				    window.location.href = "contactPage.html";
				}
			}
			xhr.send(jsonPayload);

		}
		catch(err)
		{
			document.getElementById("contactEditResult").innerHTML = err.message;
		}
	}
}

function getAllContacts()
{
	readCookie();

    getAllContactsUser(userId);
}

function getAllContactsUser(id)
{
	var url = urlBase + '/api/contact/getUserContacts/' + Number(id);

	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
		    var div = document.getElementById("myUL");
		    usersJson = JSON.parse( xhr.responseText );

			if (usersJson.status)
			{
			    var content = document.createElement("a");
				content.id = "message";
				content.setAttribute("onclick", "showAllContacts();");

				content.innerHTML = "Start a search to show your contacts<br>click me to show all of your contacts";

				var contact = document.createElement("li");
				contact.style.display = "";
				contact.appendChild(content);

				div.appendChild(contact);


			    for (i = 0; i < usersJson.contacts.length; i++)
			    {
			        var content = document.createElement("a");
			        content.id = "contact";
			        content.setAttribute("onclick", "goToEditPage(" + usersJson.contacts[i].ID + ");");

			        content.innerHTML = usersJson.contacts[i].FirstName + " " + usersJson.contacts[i].LastName;

			        var contact = document.createElement("li");
			        contact.style.display = "none";
	                contact.appendChild(content);

	                div.appendChild(contact);
			    }
			}
			else
			{
				var content = document.createElement("a");
				content.id = "message";

				content.innerHTML = "No contacts found";

				var contact = document.createElement("li");
				contact.style.display = "";
				contact.appendChild(content);

				div.appendChild(contact);
			}
		}
		xhr.send(null); // sending null since get request
	}
	catch(err)
	{
		//document.getElementById("editResult").innerHTML = err.message;
		alert(err.message);
	}
}

function showAllContacts()
{
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        var a = li[i].getElementsByTagName("a")[0];
        if (a.id != "message")
        {
            li[i].style.display = "";
        }
        else
        {
            li[i].style.display = "none";
        }
    }
}

function hideAllContacts()
{
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        var a = li[i].getElementsByTagName("a")[0];
        if (a.id == "message")
        {
            li[i].style.display = "";
        }
        else
        {
            li[i].style.display = "none";
        }
    }
}

// Adding searchBox as BOOL for focusing lists only in main box
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

function createEventt(){
	alert("Hello World!");
}

function enroll(title, description, url, startdate, enddate, address, city, event_id){

	var username = sessionStorage.getItem('userId');
	// var jsonPayload = {"username": username, "eventID": eventID.toString()};
	var jsonPayload = '{"username" : "' + username + '", "eventID" : "' + event_id + '"}';
	var url = "http://vh1/api/enrollment/enroll.php";
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
		showAllEvents();
	}

	document.getElementById('sDate').value = "";
	document.getElementById('eDate').value = "";
}

function showAllEvents() {
	var event_list = document.querySelectorAll('.event-search');
	[].slice.call(event_list).forEach(function(temp) {
		temp.setAttribute('style','display:flex');
	});
}

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

function displayCreateForm(){

	if(document.getElementById("creationArea").style.display == 'flex')
		document.getElementById("creationArea").style.display = "none";

	else if(document.getElementById("creationArea").style.display == 'none')
		document.getElementById("creationArea").style.display = 'flex';
}

function createEvent(){

	var title = document.getElementById("etitle").value;
	var description = document.getElementById("edesc").value;
	var url = document.getElementById("eurl").value;
	var startdate = document.getElementById("esd").value;
	var enddate = document.getElementById("eed").value;
	var address = document.getElementById("eadd").value;
	var city = document.getElementById("ecity").value;

	var jsonPayload = '{"title" : "' + title + '", "description" : "' + description +  '", "url" : "' + url +  '", "startdate" : "' + startdate +  '", "enddate" : "' + enddate +  '", "address" : "' + address +  '", "username" : "' + sessionStorage.getItem('userId') +  '", "city" : "' + city +  '"}';


	var url = "http://vh1/api/event/create.php";
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
