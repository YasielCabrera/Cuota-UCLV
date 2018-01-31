//constants...
var STORAGE_OPTION_VAR_NAME = "options_data";
var STORAGE_USERS_VAR_NAME  = "users_data";

class Options{

	constructor (){
		this._allow_notifications = true;
		this._notif_every = 5;
		this._notif_left = true;
		this._update_interval = 5000;
	}

	save(){
		//prepare array
		var data = [this._allow_notifications, this._notif_every, this._notif_left, this._update_interval];
		var str = JSON.stringify(data);//convert array to string
		localStorage.setItem(STORAGE_OPTION_VAR_NAME, str);//save...
	}

	load(){
		var data = JSON.parse(localStorage.getItem(STORAGE_OPTION_VAR_NAME));//get data
		if(data != null && data != undefined){
			this._allow_notifications = data[0];
			this._notif_every = data[1];
			this._notif_left = data[2];
			this._update_interval = data[3];	
		}		
	}

	//setters and getters
	get allow_notifications(){
		return this._allow_notifications;
	}
	set allow_notifications(value){
		this._allow_notifications = value;
		this.save();
	}

	get notif_every(){
		return this._notif_every;
	}
	set notif_every(value){
		this._notif_every = value;
		this.save();
	}	

	get notif_left(){
		return this._notif_left;
	}
	set notif_left(value){
		this._notif_left = value;
		this.save();
	}

	get update_interval(){
		return this._update_interval;
	}
	set update_interval(value){
		this._update_interval = value;
		this.save();
	}		
}

class UserCache{
	constructor(){
		this._name = "";
		this._active = true;
		this._cuota = 0.0;
		this._consumidoCuota = 0.0;
		this._cuotaMensual = 0.0;
		this._consumidoCuotaMensual = 0.0;
	}

	consumidoPorciento(){
		if(this._cuota == 0)return 0;
		return this._consumidoCuota*100/this._cuota;
	}
	consumidoMensualPorciento(){
		if(this._cuotaMensual == 0)return 0;
		return this._consumidoCuotaMensual*100/this._cuotaMensual;
	}

	get name(){
		return this._name;
	}
	set name(value){
		this._name = value;
	}

	get active(){
		return this._active;
	}
	set active(value){
		this._active = value;
	}

	get cuota(){
		return this._cuota;
	}
	set cuota(value){
		this._cuota = value;
	}

	get consumidoCuota(){
		return this._consumidoCuota;
	}
	set consumidoCuota(value){
		this._consumidoCuota = value;
	}

	get cuotaMensual(){
		return this._cuotaMensual;
	}
	set cuotaMensual(value){
		this._cuotaMensual = value;
	}

	get consumidoCuotaMensual(){
		return this._consumidoCuotaMensual;
	}
	set consumidoCuotaMensual(value){
		this._consumidoCuotaMensual = value;
	}
}

class Users{
	constructor(){
		this._usr = [];
	}

	//cantidad de elementos
	length(){
		return this._usr.length;
	}

	//devuelve el usuario i-esimo
	get(index){
		return this._usr[index];
	}

	//guarda los datos en el almacenamiento local
	save(){
		console.log("saving users data...");
		var data = [];
		for (var i = 0; i < this.length(); i++){
			data.push(this._usr[i].name);
			data.push(this._usr[i].active);
			data.push(this._usr[i].cuota);
			data.push(this._usr[i].consumidoCuota);
			data.push(this._usr[i].cuotaMensual);
			data.push(this._usr[i].consumidoCuotaMensual);
		}
		var strData = JSON.stringify(data);//convert array to string
		localStorage.setItem(STORAGE_USERS_VAR_NAME, strData);
	}

	//carga los datos del almacenamiento local
	load(){
		var data = JSON.parse(localStorage.getItem(STORAGE_USERS_VAR_NAME));//get data

		var users = [];
		var step = 6;//cantidad de atributos por cada user
		var carri = 0;
		for (var i = 0; i < data.length/step; i++){
			var newU = new UserCache();
			newU.name = data[i*step+carri++];
			newU.active = data[i*step+carri++];
			newU.cuota = data[i*step+carri++];
			newU.consumidoCuota = data[i*step+carri++];
			newU.cuotaMensual = data[i*step+carri++];
			newU.consumidoCuotaMensual = data[i*step+carri++];
			users.push(newU);
			carri = 0;
		}
		this._usr = users;
	}

	//adiciona un nuevo usuario
	add(name, active){
		var exist = false;
		for (var i = 0; i < this.length(); i++){
			if(this._usr[i].name == name){
				exist = true;
				break;
			}
		}
		if(!exist){
			var newU = new UserCache();
			newU.name = name;
			newU.active = active;
			this._usr.push(newU);
			this.save();
			return true;
		}else{
			return false;
		}
	}

	//elimina un usuario
	remove(name){
		for (var i = 0; i < this.length(); i++){
			if( this._usr[i].name == name ){
				this._usr.splice(i, 1);
				this.save();
				break;
			}
		}
	}

	//activa o inactiva un usuario
	changeActive(name, value){
		for(var i = 0; i < this.length(); i++){
			if(this._usr[i].name == name){
				this._usr[i].active = value;
				this.save();
				break;
			}
		}
	}

	//activa o inactiva un usuario
	changeActive(name){
		for(var i = 0; i < this.length(); i++){
			if(this._usr[i].name == name){
				this._usr[i].active = !this._usr[i].active;
				this.save();
				break;
			}
		}
	}
}