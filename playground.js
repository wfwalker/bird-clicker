Backbone.$ = $;

// The global singleton representing the game as a whole.  Initializes game,
// dispatches events between views and models, just generally runs the show.
var game;
var nestDataMap = {};
var birdDataMap = {};
var awardDataMap = {};
var upgradeDataMap = {};

var doSave = true;

document.onready = function() {
  $("#clearbutton").click(function () {
    if (window.localStorage) {
      delete localStorage.data;
      doSave = false;
      location.reload();
      $.notify("Save cleared!", "error")
    }
  });

	//delete localStorage.data;
  for (var i = 0; i < birdData.length; ++i) {
    birdDataMap[birdData[i].name] = birdData[i];
  }

  for (i = 0; i < nestData.length; ++i) {
    nestDataMap[nestData[i].name] = nestData[i];
  }

  for (i = 0; i < awardData.length; ++i) {
    awardDataMap[awardData[i].id] = awardData[i];
  }
  for (i = 0; i < upgradeData.length; ++i) {
    upgradeDataMap[upgradeData[i].id] = upgradeData[i];
  }

  game = new Game();
  game.load();
  
  new TreeView();
  new StoreView();
  new PurchasedUpgradesListView();

  game.start();

  $("#layButton").click((event) => game.trigger("layButtonClick", event));
  $("#buyNestButton").click(() => game.trigger("buyNest"));
  $("#buyBirdButton").click(() => game.trigger("buyBird"));

  if (window.localStorage) {
    if (localStorage.data) {
      game.parse(JSON.parse(localStorage.data));
      game.trigger("dataRestored");
    }

    setInterval(function () {
      $.notify("Game Saved", "success");

      localStorage.data = JSON.stringify(game.toJSON());
    }, 60 * 1000);
  }
}

$(window).unload(function() {
  // Save game state so the user can start up where they left off next time!
  if (window.localStorage && doSave) {
    localStorage.data = JSON.stringify(game.toJSON());
  }
});
