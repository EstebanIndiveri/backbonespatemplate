$(document).ready(function(){
	const pedido=(pagePrev,pageNext)=>{
		let url=`https://gateway.marvel.com:443/v1/public/characters?limit=${pagePrev}&offset=${pageNext}&ts=1000&apikey=1ae821724d4abc71869f7eb192ac0797&hash=06fc9542db116b673080212346ca12b8`;
		console.log(url)
		return url;
	}
	$('.next').on('click',function () {
		console.log('FOO!')
		pedido(8,8);
	});

var Vehicle = Backbone.Model.extend({
	idAttribute: "registrationNumber",
	idAttribute:'imagen',
	validate: function(attrs){
		if (!attrs.registrationNumber)
			return "Vehicle is not valid.";
	},
	start: function(){
		console.log("Vehicle started.");
	}
});

var Vehicles = Backbone.Collection.extend({
	Model: Vehicle,
});

var Car = Vehicle.extend({
	start: function(){
		console.log("Car with registration number " + this.get("registrationNumber") + " started.");
	}
});

var VehicleView = Backbone.View.extend({
	tagName: "article",
	initialize: function(){
		this.model.on("change", this.render, this);
	},
	events: {
		"click .delete": "onDelete",
		"click .prevPag": "onPrev",
		"click .next" : "onNext",

	},
	render: function() {
		$('#titleSuper').show();
		$('#titleSuper').html('<h1>Best Superheroes of galaxy</h1>')
		var source = $("#vehicleTemplate").html();
		var template = _.template(source);
		this.$el.html(template(this.model.toJSON()));
		this.$el.attr("data-color", this.model.get("color"));
		$('.next').show();
		return this;
	},
	onDelete: function(){
		let id=this.model.toJSON().id;
		Backbone.history.navigate(`superheroe/${id}`,{trigger:true});
	},
	onNext:function(){
	},
	onPrev:function(){
	}
});

var VehiclesView = Backbone.View.extend({
	id: "grid",
	tagName: "div",
	initialize:function(){
		bus.on("newVehicle", this.onNewVehicle, this);
	},

	render: function(){
		this.collection.each(function(vehicle){
			var vehicleView = new VehicleView({ model: vehicle });
			this.$el.append(vehicleView.render().$el);
		}, this); 
		return this;
	},
	onNewVehicle: function(registrationNumber){
		var car = new Car({ registrationNumber: registrationNumber });
		var vehicleView = new VehicleView({ model: car });
		this.$el.prepend(vehicleView.render().$el);
	}
});

var NewVehicleView = Backbone.View.extend({
	events: {
		"click .add": "onAdd"
	},
	render: function(){
		var source = $("#newVehicleTemplate").html();
		var template = _.template(source);

		this.$el.html(template());

		return this;
	},
	onAdd: function(){
		var input = this.$el.find(".registration-number");

		var registrationNumber = input.val();
		bus.trigger("newVehicle", registrationNumber);

		// It's the responsibility of this view to clear its text box
		input.val("");
	}
});
var HomeView = Backbone.View.extend({
	render: function(){
		$('#titleSuper').hide();
		$('.next').hide();

		this.$el.html(
			`<div>
				<h1 class="titleHomeScreen">Marvel App</h1>
				<h5 class="subtitleHomeScreen">Create with Backbone.js</h5>
			</div>`
			);
		return this;
	}
});
var AppRouter = Backbone.Router.extend({
	routes: {
		"": "viewHome",
		"superheroes": "viewCars",
		"populars": "viewBoats",
		"superheroe/:id": "viewSuperheroe",
		"*other": "defaultRoute"
	},

	viewCars: function(){
		var vehicles = new Vehicles([]);
		fetch(pedido(8,0))
		.then(response=>response.json())
		.then(json=>{
			json.data.results.map(item=>{
			vehicles.push(new Car({ registrationNumber: item.name, color: "Blue",id:item.id })),
			this.loadView(new VehiclesView({ collection: vehicles }));
			})
		});
	},
	viewSuperheroe:function(id){
		 console.log('estamos en la siglepage',id);
		this.loadView(new HomeView());
		// let songs=new 
	},
	viewBoats: function(){
	
		var vehicles = new Vehicles([
			new Car({ registrationNumber: "AAA", color: "Blue" }),
			new Car({ registrationNumber: "BBB", color: "Blue" }),
			new Car({ registrationNumber: "CCC", color: "Gray" })
		]);

		this.loadView(new VehiclesView({ collection: vehicles }));
	},

	viewHome: function(){
		this.loadView(new HomeView());
	},
	loadView: function(view){
		if (this._currentView) {
			this._currentView.remove();
		}
		$("#container").html(view.render().$el);
		this._currentView = view;
	},
	defaultRoute: function(){
	}
});
var bus = _.extend({}, Backbone.Events);

var router = new AppRouter();
Backbone.history.start();

var NavView = Backbone.View.extend({
	events: {
		"click": "onClick"
	},
	onClick: function(e){
		var $li = $(e.target);
		router.navigate($li.attr("data-url"), { trigger: true });
	}
});
var navView = new NavView({ el: "#nav" });



		
	
	console.log('up');
})