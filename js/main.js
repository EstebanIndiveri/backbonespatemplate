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
	const singlePedido=(id)=>{
		let url=`https://gateway.marvel.com/v1/public/characters/${id}?&ts=1000&apikey=1ae821724d4abc71869f7eb192ac0797&hash=06fc9542db116b673080212346ca12b8`;
		return url;
	}
	

var Vehicle = Backbone.Model.extend({
	idAttribute: "registrationNumber",
	idAttribute:'imagen',
	validate: function(attrs){
		if (!attrs.registrationNumber)
			return "supeheore is not valid.";
	},
	start: function(){
		console.log("started.");
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
		"click .back" : "onBack",
	},
	render: function async() {
		$('#titleSuper').show();
		$('#titleSuper').html('<h1>Best Superheroes of galaxy</h1>')
		var source = $("#vehicleTemplate").html();
		var template = _.template(source);
		this.$el.html(template(this.model.toJSON()));
		this.$el.attr("data-color", this.model.get("color"));
		this.$el.addClass(this.model.get('className'));
		var showm=$('.next').show();
		// console.log(showm)
		return this;
	},
	onBack:function(){
		Backbone.history.navigate('superheroe',{trigger:true});
		console.log('atras');
	},
	onDelete: function(){
		let id=this.model.toJSON().id;
		Backbone.history.navigate(`superheroe/${id}`,{trigger:true});
	},
	onBack:function(){
		Backbone.history.navigate('superheroe',{trigger:true});
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
	events: {
		"click .back" : "onBack",
	},
	onBack:function(){
		Backbone.history.navigate('superheroe',{trigger:true});
		console.log('atras');
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
			vehicles.push(new Car({ registrationNumber: item.name,registrationImage:item.thumbnail.path+'.jpg', color: "test",id:item.id })),
			this.loadView(new VehiclesView({ collection: vehicles }));
			})
		});
		console.log(vehicles);
	},
	viewSuperheroe:async function(id){
		var vehicles = new Vehicles([]);

		fetch(singlePedido(id))
		.then(response=>response.json())
		.then(json=>{
			json.data.results.map(async item=>{
			vehicles.push(new Car({ registrationNumber:item.name,registrationImage:item.thumbnail.path+'.jpg', color: "blue",id:item.id,className:'SingleDiv',className:'bluex' })),
			this.loadView(new VehiclesView({ collection: vehicles }));
			$('.next').hide();
			// console.log(item.stories,item.series.items.map);
			let series=[];
			$('.text').append(`
								<h3>Stories:</h3>
								<ul class="liststories"></ul>`);
			item.stories.items.map(item=>{
				series.push(item.name);
				$('.liststories').append(`<li>${item.name}</li>`)
			})
			// console.log(series)
			let elemento=await document.querySelector('.bluex');
			let algo = elemento.parentElement;	
			algo.style.display='flex';
			$(".delete").hide();
			$('#titleSuper').html(`<h1>${item.name}</h1>`)
			$("#titleSuper").append(`<button><a class="back">Superheroes</a></button/>`)
			$('.back').on('click',function(){
				Backbone.history.navigate('superheroes',{trigger:true});
				// console.log('algo');
			})
			})
		});

		
		// this.loadView(new HomeView());
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