var Bird = Backbone.Model.extend({
  name: null,
  description: null,
  image: null,
  cost: 1, // unit: eggs
  rewardPerTick: 1, // unit: eggs
  showAfterEggCount: 1,
});