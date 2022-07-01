//pulls in info from the inquirer, enemy, and player files and npm(inquirer). Potions isn't needed since it is tied to enemy's.
const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

//creates the starting variables for the game function
function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
  }

  //initializes the game
  Game.prototype.initializeGame = function() {
    //adds all enemys to the above enemy array (in Game)
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));

    //keeps track of which enemy is currently fighting
    this.currentEnemy = this.enemies[0];

    //prompt inquirer npm to gather information
    inquirer
    .prompt({
    type: 'text',
    name: 'name',
    message: 'What is your name?'
    })
    // destructure name from the prompt object
    .then(({ name }) => {
    this.player = new Player(name);

    this.startNewBattle();
    });

};



module.exports = Game;