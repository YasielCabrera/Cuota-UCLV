var users = new Users();
users.load();

var backgroudP = chrome.extension.getBackgroundPage();

$(document).ready(function(){
	console.log("adding option event");
	$("#options-button").click(function(e){
		e.preventDefault();
		window.open("options.html");
	});

	console.log("adding users to combo...");
	var selected = localStorage.getItem("selected");
	for (var i = 0; i < users.length(); i++){
		var us = users.get(i);
		if(us.active){
			$("#user-list").append('<option '+((selected!=undefined && selected == us.name)?'selected':'')+'>'+us.name+'</option>');
		}
	}

	console.log("adding combo's change event");
	$("#user-list").change(function(){
		//guardo el usuario que acabo de seleccionar...
		localStorage.setItem("selected", $(this).val());
		changeValues();
	});

	console.log("getting all user's data");
	users = backgroudP.updateValues();



	function changeValues(){
		users = backgroudP.updateValues();
		var name = $("#user-list").val();
		var userSelected;
		for (var i = 0; i < users.length(); i++){
			var us = users.get(i);
			if(us.name == name){
				userSelected = us;
				break;
			}
		}
		
		if(userSelected != null && userSelected != undefined){
			console.log("settin values...");
			$("#cuota").text(userSelected.cuota.toFixed(2)+"Mb");
			$("#consumido-cuota").text(userSelected.consumidoCuota.toFixed(2)+"Mb");
			$("#consumido-cuota-percent").text(userSelected.consumidoPorciento().toFixed(2)+"%");
			$("#cuotaMes").text(userSelected.cuotaMensual.toFixed(2)+"Mb");
			$("#consumido-ciclo").text(userSelected.consumidoCuotaMensual.toFixed(2)+"Mb");
			$("#consumido-ciclo-percent").text(userSelected.consumidoMensualPorciento().toFixed(2)+"%");

			$("#consumido-cuota").removeClass("bg-success");
			$("#consumido-cuota-percent").removeClass("bg-success");
			$("#consumido-ciclo").removeClass("bg-success");
			$("#consumido-ciclo-percent").removeClass("bg-success");

			$("#consumido-cuota").removeClass("bg-danger");
			$("#consumido-cuota-percent").removeClass("bg-danger");
			$("#consumido-ciclo").removeClass("bg-danger");
			$("#consumido-ciclo-percent").removeClass("bg-danger");

			if(userSelected.consumidoCuota >= userSelected.cuota){
				$("#consumido-cuota").addClass("bg-danger");
				$("#consumido-cuota-percent").addClass("bg-danger");
			}else{
				$("#consumido-cuota").addClass("bg-success");
				$("#consumido-cuota-percent").addClass("bg-success");
			}
			if(userSelected.consumidoCuotaMensual >= userSelected.cuotaMensual){
				$("#consumido-ciclo").addClass("bg-danger");
				$("#consumido-ciclo-percent").addClass("bg-danger");
			}else{
				$("#consumido-ciclo").addClass("bg-success");
				$("#consumido-ciclo-percent").addClass("bg-success");
			}
		}
	}
	changeValues();
});