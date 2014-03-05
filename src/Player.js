var Player = Backbone.Model.extend({
  defaults: {
    eggs: 0,
    eggIncrement: 1, // per lay
    manualClicks: 0,
    manualClickIncrement: 1,
  },

  nests: null,
  birds: null, // or perhaps birds only need to be referenced by nests?
  badges: null,

  initialize: function(game) {
    this.game = game;
    this.nests = new Nests;
    this.nests.add(new Nest);
  },

  lay: function() {
    this.set("eggs", this.get("eggs") + this.get("eggIncrement"));
  },

  buyNest: function (nest) {
    if (this.get("eggs") < nest.get("cost")) {
      console.warn(this.get("eggs") + " eggs isn't enough to buy a nest for " + nest.get("cost") + ".");
      return;
    }

    this.nests.add(nest);
    this.set("eggs", this.get("eggs") - nest.get("cost"));
  },

  buyBird: function (bird) {
    if (this.get("eggs") < bird.get("cost")) {
      console.warn(this.get("eggs") + " eggs isn't enough to buy a bird for " + bird.get("cost") + ".");
      return false;
    }

    for (var i = 0; i < this.nests.length; ++i) {
      var nest = this.nests.at(i);
      if (!nest.atCapacity()) {
        nest.addBird(bird);

        this.set("eggIncrement", this.get("eggIncrement") + bird.get("rewardPerTick"));
        this.set("eggs", this.get("eggs") - bird.get("cost"));

        return nest;
      }
    }

    return false;
  },

  sellBird: function (bird) {
    this.set("eggIncrement", this.get("eggIncrement") - bird.get("rewardPerTick"));
    this.set("eggs", this.get("eggs") + bird.get("cost") * DEPRECIATION | 0);
    bird.nest.removeBird(bird);
  },
  
  performClick: function() {
    this.set("manualClicks", this.get("manualClicks") + 1);
    this.set("eggs", this.get("eggs") + this.get("manualClickIncrement"));
  }
});
