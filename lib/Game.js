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

//start new battle function (will be called within the intiliaze function if a player and/or enemy is still alive)
Game.prototype.startNewBattle = function() {
    //starts the game based on whomever's agility is higher
    if (this.player.agility > this.currentEnemy.agility) {
      this.isPlayerTurn = true;
    } else {
      this.isPlayerTurn = false;
    }

    //display player's stats at the beginning of the new battle
    console.log('Your stats are as follows:');
    console.table(this.player.getStats());
    console.log(this.currentEnemy.getDescription());

    //responsible for each individual's turn in the round
    this.battle()
};

//function to battle - called in the startNewBattle function to begin
Game.prototype.battle = function() {
    if (this.isPlayerTurn) {
        inquirer
        .prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['Attack', 'Use potion']
        })
        .then(({ action }) => {
            if (action === 'Use potion') {
                //check to see if there inventory is empty or not
                if (!this.player.getInventory()) {
                  console.log("You don't have any potions!");
                  return this.checkEndOfBattle();
                }
                
                //if not empty prompt the inquirer
                inquirer
                  .prompt({
                    type: 'list',
                    message: 'Which potion would you like to use?',
                    name: 'action',
                    choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                })
                //splits the index and potion name to get back to the correct position in the array as it corresponds with the potion.js file
                .then(({ action }) => {
                    const potionDetails = action.split(': ');
                
                    this.player.usePotion(potionDetails[0] - 1);
                    console.log(`You used a ${potionDetails[1]} potion.`);
                    this.checkEndOfBattle();
                  });
            } else {
              const damage = this.player.getAttackValue();
              this.currentEnemy.reduceHealth(damage);
      
              console.log(`You attacked the ${this.currentEnemy.name}`);
              console.log(this.currentEnemy.getHealth());
              this.checkEndOfBattle();
            }
        });
    } else {
      const damage = this.currentEnemy.getAttackValue();
      this.player.reduceHealth(damage);
  
      console.log(`You were attacked by the ${this.currentEnemy.name}`);
      console.log(this.player.getHealth());
      this.checkEndOfBattle();
    }
};

//function to check if the battle has ended - called after potion inventory is checked, after potion is used, after player attacks, and after enemy attacks
Game.prototype.checkEndOfBattle = function() {
    if (this.player.isAlive() && this.currentEnemy.isAlive()) {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
    } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        console.log(`You've defeated the ${this.currentEnemy.name}`);
      
        this.player.addPotion(this.currentEnemy.potion);
        console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);
      
        this.roundNumber++;
      
        if (this.roundNumber < this.enemies.length) {
          this.currentEnemy = this.enemies[this.roundNumber];
          this.startNewBattle();
        } else {
          console.log('You have defeated all the enemies! You win!');
        }
      } else {
        console.log("You've been defeated by the enemies and have lost the game!");
      }
};


module.exports = Game;