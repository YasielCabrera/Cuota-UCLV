
var options = new Options();
options.load();
var users = new Users();
users.load();

var TIME_UPDATE_INTERVAL = [5000, 10000, 15000, 20000, 25000, 30000];

$(document).ready(function(){
	//set saved data...
	function initPage(){
		var ch = options.allow_notifications;
		$("#allow-notifications").attr("checked", ch)
		if(ch){
			$("#consumo-interval-wraper").removeClass("hidden");

			var opt = $("#consumo-interval option");
			for (var i = 0; i < opt.length; i++) {
				opt[i].selected = (opt[i].value == options.notif_every)? true : false;
			}
			//select the item
		}
		ch = options.notif_left;
		$("#notif-left").attr("checked", ch)
		var p = 0;
		for(var i = 0; i < TIME_UPDATE_INTERVAL.length; i++){
			if(TIME_UPDATE_INTERVAL[i] == options.update_interval){
				p = i;
				break;
			}
		}
		$("#update-interval option")[p].selected = true;
	}
	(function(){
		initPage();
	})();

	//eventos...
	//evento de permitir notificaciones
	$("#allow-notifications").change(function(){
		if( $(this).is(':checked') ){
			$("#consumo-interval-wraper").removeClass("hidden");
			options.allow_notifications = true;
		}else{
			$("#consumo-interval-wraper").addClass("hidden");
			options.allow_notifications = false;
		}
	});
	//evento para select de notificar cada x MB
	$("#consumo-interval").change(function(){
		var opt = $("#consumo-interval option");
		for (var i = 0; i < opt.length; i++) {
			if(opt[i].selected){
				options.notif_every = opt[i].value;
				break;
			}
		}
	});
	//evento de chackbox notificar cuando quede...
	$("#notif-left").change(function(){
		if( $(this).is(':checked') ){
			options.notif_left = true;
		}else{
			options.notif_left = false;
		}
	});
	//evento de intervalo de actualizacion
	$("#update-interval").change(function(){
		var sel = $("#update-interval option");
		for(var i = 0; i < sel.length; i++){
			if(sel[i].selected){
				options.update_interval = TIME_UPDATE_INTERVAL[i];
				break;
			}
		}
	});
	//evento boton restore
	$("#restore-option").click(function(){
		options = new Options();
		options.save();
		initPage();
	});

	//***************************
	//usuarios...	
	//***************************
	function updateTable(){
		if(users !== null){
			for(var i = 0; i < users.length(); i++){
				var us = users.get(i);
				insertUserIntoTable(us.name, us.active);
			}
		}
		
	}
	(function(){
		updateTable();
	})();

	function insertUserIntoTable(username, active){
		var id_row = 'ident-'+Math.floor(Date.now()*Math.random());;
		var id_check_active = 'active-'+Math.floor(Date.now()*Math.random());
		var id_button_remove = 'remove-'+Math.floor(Date.now()*Math.random());

		$("#user-table tr:last").after('<tr id="'+id_row+'">\
									    <td><div class="checkbox"><label><input id="'+id_check_active+'" type="checkbox" value="" '+(active?'checked':'')+'></label></div>\
									    </td><td>'+username+'</td>\
									    <td><button id="'+id_button_remove+'"class="btn btn-danger"><i class="glyphicon glyphicon-trash"></i></button></td></tr>');
		//adding listeners...
		addListenersIntoTable(id_check_active, id_button_remove, username);
	}

	function addListenersIntoTable(id_check_active, id_remove, username){
		$("#"+id_check_active).change(function(){
			users.changeActive(username);
			console.log('changing active to user '+username);
		});
		$("#"+id_remove).click(function(e){
			e.preventDefault();
			$(this).closest('tr').remove();
			users.remove(username);
		});
	}

	function createNewUser(username){
		if(users.add(username, true)){
			insertUserIntoTable(username, true);
		}		
	}

	$("#new_user_button").click(function(e){
		e.preventDefault();
		var new_user = $("#new_user_text").val().trim();

		if(new_user.length != 0){
			createNewUser(new_user);
			$("#new_user_text").val('');
		}else{
			console.log("nothing has been writen");
		}

		
	});

});