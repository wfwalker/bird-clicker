var Scoreboard = Backbone.View.extend({
  id: "scoreboard",

  initialize: function() {
    this.listenTo(this.model, "change", this.render);
    var increment = this.model.get("eggIncrement");
    var step = 0;

    var interval = setInterval(() => {
    	var n = this.model.get("eggs") + (increment / 10) * (++step);
    	
    	if (step == 20) {
    		step = 0;
    		increment = this.model.get("eggIncrement");
    	}

    	$("#eggs").text(Math.round(n).formatNumber());
    }, 50);
  },

  render: function() {
    document.title = this.model.get("eggs").formatNumber() + " eggs - Twitcher";
    
    $("#increment").text("Laying " + (Math.round(game.player.calculateEggsPerSecond() * 1000) / 1000).formatNumber() + " eggs per second");
  },

});