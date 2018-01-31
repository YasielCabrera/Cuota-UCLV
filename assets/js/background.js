var user, options;

function getData(userObj, users){
	console.log("getting data for user "+userObj.name);
	$.get('http://api.uclv.edu.cu/user_proxy_quota/'+userObj.name, function(data) {
		var cuota = data[0]['cuota'];
		if(cuota != null && cuota != undefined){
			userObj.cuota  = cuota/1000.0/1000.0;
		}
		var total = data[0]['total'];
		if(total != null && total != undefined){
			userObj.consumidoCuota  = total/1000.0/1000.0;
		}
		var cuota2 = data[0]['cuota2'];
		if(cuota2 != null && cuota2 != undefined){
			userObj.cuotaMensual  = cuota2/1000.0/1000.0;
		}
		var total30 = data[0]['total30'];
		if(total30 != null && total30 != undefined){
			userObj.consumidoCuotaMensual = total30/1000.0/1000.0;
		}
		users.save();
	});
}

function updateValues(){
	var users = new Users();
	users.load();

	for(var i = 0; i < users.length(); i++){
		getData(users.get(i), users);
	}
	//users.save();
	return users;
}

function loadOptions(){
	options = new Options();
	options.load();
}

function showNotif(msg, title, time){
	var options = {
	    body: msg,
	    icon: "assets/img/icon_max.png"
	};
	 
	var notif = new Notification(title, options);
	setTimeout(notif.close, time);
}

function pickUser(list, name){
	for(var i = 0; i < list.length(); i++){
		var u = list.get(i);
		if(u.name == name){
			return u;
		}
	}
	return null;
}

function check(){
	var updatedUsers = updateValues();
	loadOptions();

	if(options.allow_notifications){
		var selectedName = localStorage.getItem("selected");
		var updatedUser = pickUser(updatedUsers, selectedName);
		var unUpdatedUser = pickUser(user, selectedName);

		console.log((updatedUser.consumidoCuota - unUpdatedUser.consumidoCuota)/1000000.0);
		console.log(updatedUser.consumidoCuota);
		console.log(unUpdatedUser.consumidoCuota);
		console.log((updatedUser.consumidoCuota - unUpdatedUser.consumidoCuota));

		if(options != null && options != undefined && updatedUser != null && unUpdatedUser != null 
			&& options.notif_every <= (updatedUser.consumidoCuota - unUpdatedUser.consumidoCuota)){

			showNotif("Cuota: "+updatedUser.cuota+"Mb\n"+"Consumido: "+updatedUser.consumidoCuota+"Mb", selectedName, 3000);
			user = updatedUsers;
		}
	}

	var interval = options.update_interval;
	setTimeout(check, interval);
}

function init(){
	user = updateValues();
	check();
}



init();

/*
var options = {
	    body: "Este es le cuerpo de la notificación",
	    icon: "imgs/logoNotifs.png"
	};
	 
	var notif = new Notification("Hello desde background", options);
	setTimeout(notif.close, 500);
*/