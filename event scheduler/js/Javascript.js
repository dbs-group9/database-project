var urlBase = 'http://knightacts.ueuo.com';
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

	var hash = md5( password );

	document.getElementById("signUpResult").innerHTML = "";
	var jsonPayload = '{"username" : "' + userName + '", "password" : "' + hash + '"}';
	var url = urlBase + '/api/user/create';

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

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
        window.location.href = "contactPage.html";
	}
}

// Logs existing user into account.
function doLogin()
{
	userId = 0;

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	user = login;

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/api/user/login.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		userId = jsonObject.id;

		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		saveCookie();
		window.location.href = "contactPage.html";
		getAllContacts();
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
