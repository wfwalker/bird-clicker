var Player = Backbone.Model.extend({
  defaults: {
    totalEggs: 0,
    eggs: 0,
    eggIncrement: 1, // per lay
    eggMultiplier: 1,
    manualClicks: 0,
    birdCount: 0,
    nestCount: 0,
    challengesCompleted: 0,
    totalTimePlayed: 0,
    rewardedAwards: 0
  },

  nests: null,
  badges: null,

  load: function({ nest }) {
    this.nests = new Nests;
    this.nests.init();
    this.nests.add(nest);

    this.on("lay", () => {
      this.performLay();
    });
  },

  inc: function (prop, diff) {
    this.set(prop, this.get(prop) + diff);
  },

  dec: function (prop, diff) {
    this.inc(prop, -diff);
  },

  lay: function() {
    this.trigger("lay");
  },

  performLay: function() {
    this.inc("totalEggs", this.get("eggIncrement") * this.get("eggMultiplier"));
    this.inc("eggs", this.get("eggIncrement") * this.get("eggMultiplier"));
  },

  buyNest: function (nest) {
    if (this.get("eggs") < nest.get("cost")) {
      $.notify(this.get("eggs") + " eggs isn't enough to buy a nest that costs " + nest.get("cost") + " eggs!");
      return;
    }

    this.nests.add(nest);
    this.dec("eggs", nest.get("cost"));

    var nestObject = game.nests.findWhere({name:nest.get("name")});
    nestObject.set("cost", Math.round(nestObject.get("cost") * 1.5));
  },

  buyBird: function (bird) {
    console.log("Try to purchase bird for", bird.get("cost"));
    if (this.get("eggs") < bird.get("cost")) {
      $.notify(this.get("eggs") + " eggs isn't enough to buy a bird that costs " + bird.get("cost") + " eggs!");
      return false;
    }

    for (var i = 0; i < this.nests.length; ++i) {
      var nest = this.nests.at(i);
      if (!nest.atCapacity()) {
        nest.addBird(bird);

        this.inc("eggIncrement", bird.get("rewardPerTick"));
        this.dec("eggs", bird.get("cost"));

        var birdObject = game.birds.findWhere({"name":bird.get("name")});
        birdObject.set("cost", Math.round(birdObject.get("cost") * 1.5));

        return nest;
      }
    }

    $.notify("Your nests are already full of birds!");
    return false;
  },

  sellBird: function (bird) {
    this.dec("eggIncrement", bird.get("rewardPerTick"));
    this.inc("eggs", bird.get("cost") * DEPRECIATION | 0);
    bird.nest.removeBird(bird);
  },

  manualLay: function() {
    this.inc("manualClicks", 1);
    this.lay();
  }
});
