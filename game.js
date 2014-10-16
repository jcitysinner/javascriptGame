var Game = function () { 

	//This is the player's basic prototype
	var Hero = function () {

		//Hero stats.
		this.maxHP       = 100;
		this.currentHP   = 100;

		this.maxMp       = 100;
		this.currentMP   = 100;

		this.maxOD       = 100;
		this.currentOD   = 0;
		this.ODActive    = false;
		this.ODCount     = 0;

		this.power       = 10;

		this.totalBlock  = 0;
		this.block       = 0;

		this.skills      = ['Heal', 'Holyblast', 'Aegis'];

		//Other variables
		var i;
		var skillElement;

		//Calculator functions to update the UI when the data changes.
		this.calcHP = function () {

			if (this.currentHP > 0){
				document.getElementById('hpElement').innerHTML = this.currentHP;
				return true;
			}
			else{
				document.getElementById('hpElement').innerHTML = 0;
				document.getElementById('lose').style.display = 'block';
				return false;
			}

		}

		this.calcMP = function () {

			document.getElementById('mpElement').innerHTML = this.currentMP;
			console.log(this.currentMP);

		}

		this.calcOD = function () {

			if (this.currentOD >= 100){
				document.getElementById('odElement').style.width = '100%';
				document.getElementById('odElement').innerHTML = 'KICK INTO OVERDRIVE';
				document.getElementById('odElement').style.cursor = 'pointer';
			}
			else{
				document.getElementById('odElement').style.width = ((this.currentOD / this.maxOD) * 100) + '%';
				console.log(((this.currentOD / this.maxOD) * 100) + '%');
				document.getElementById('odElement').style.cursor = 'auto';
				document.getElementById('odElement').innerHTML = '';
			}

		}

		//Initial UI update to make sure the data and UI match.
		document.getElementById('hpElement').innerHTML = this.currentHP;
		document.getElementById('mpElement').innerHTML = this.currentMP;
		document.getElementById('odElement').style.width = '0%';

		//Creates a skill button for each of the character's skills.
		for (i = 0; i < this.skills.length; i++){

			skillElement = document.createElement('li');
			skillElement.id = 'skill' + (i + 1);
			skillElement.innerHTML = this.skills[i];
			document.getElementById('skillsList').appendChild(skillElement);
			skillElement.addEventListener('click', 'skill' + (i + 1));

		}

	}

	//This is the enemy's basic prototype
	var Enemy = function () {
		
		//Enemy Stats.
		this.maxHP      = '100';
		this.currentHP  = '100';

		this.power      = 12;

		//Calculator function to update the UI when the data changes.
		this.calcHP = function () {

			if (this.currentHP > 0){
				document.getElementById('enemyHP').style.width = ((this.currentHP / this.maxHP) * 100) + '%';
				return true;
			}
			else{
				document.getElementById('enemyHP').style.width = '0%';
				document.getElementById('win').style.display = 'block';
				return false;
			}

		}

		//Initial UI update to make sure the data and UI match.
		document.getElementById('enemyHP').style.width = ((this.currentHP / this.maxHP) * 100) + '%';

	}

	//Initiates the Hero and Enemy objects.
	var player      = new Hero();
	var monster     = new Enemy();

	var playerTurn  = true;

	//Runs when user clicks the attack button. Calculates the damage and then subtracts that from the enemy's health.
	function heroAttack () {

		var isDead;
		
		//Randomly generates the total attack damage.
		var totalDmg = Math.floor(Math.random() * ((player.power * 2) - player.power) + player.power);
		console.log('player: ' + totalDmg);

		//Shows the user how much damage was done
		document.getElementById('monsterAlert').innerHTML = totalDmg + ' DAMAGE';
		document.getElementById('monsterAlert').style.opacity = 1;

		//Runs the pushBack animation
		document.getElementById('monsterSprite').classList.add('pushBack');

		//Changes the enemies current HP and then updates it with the calcHP method.
		monster.currentHP  -= totalDmg;
		isDead              = monster.calcHP();

		//Hides the damage alert
		setTimeout(function () {

			document.getElementById('monsterAlert').style.opacity = 0;
			document.getElementById('monsterAlert').innerHTML = '';
			document.getElementById('monsterSprite').classList.remove('pushBack');

		}, 1000);

		//If the player isn't dead, continue the game.
		if (isDead){
			playerTurn = false;
			turnChange();
		}
		
		
	}
	
	//The hero's block skill
	function heroBlock () {

		//for one turn the hero blocks half of all incoming damage.
		player.block  = 0.5;

		playerTurn    = false;
		turnChange();

	}

	//Activates the hero's Overdrive making him stronger for 3 turns
	function heroOverdriveOn () {

		if (player.currentOD  >= 100){
			player.ODActive    = true;
			player.power      += 10;
			player.block       = 0.7;
			player.ODCount     = 3;
			player.currentOD   = 0;
			player.calcOD();
			document.getElementById('overDriveLabel').style.opacity = 1;
		}

	}

	//Disables the hero's overdrive after 3 turns have gone by.
	function heroOverdriveOff () {

		player.ODActive  = false;
		player.power     = 10;
		player.block     = 0;
		document.getElementById('overDriveLabel').style.opacity = 0;
		
	}

	//Closes the skills menu
	function closeSkills () {

		document.getElementById('skillsMenu').style.opacity = 0;
		document.getElementById('skillsMenu').style.display = 'none';

	}

	//Opens the skills menu
	function openSkills () {

		document.getElementById('skillsMenu').style.display = 'block';
		document.getElementById('skillsMenu').style.opacity = 1;

	}

	//Runs the player's first skill
	function skill1 () {

		//Checks to make sure the player has enough mana to preform the skill
		if (player.currentMP >= 60){

			//Reduces the heroes mana and recalculates it for the UI
			player.currentMP -= 60;
			player.calcMP();

			document.getElementById('healSprite').classList.add('healAnim');

			player.currentHP += 35;
			if (player.currentHP > 100){
				player.currentHP = 100;
			}

			player.calcHP();

			//Closes the skills menu
			document.getElementById('skillsMenu').style.opacity = 0;
			document.getElementById('skillsMenu').style.display = 'none';

			//Continues the game
			playerTurn = false;
			turnChange();
		}
		else{
			//This runs if the hero doesn't have enough mana
			document.getElementById('manaAlert').style.opacity = 1;
			document.getElementById('skillsMenu').style.opacity = 0;	
			document.getElementById('skillsMenu').style.display = 'none';
			setTimeout(function(){
				document.getElementById('manaAlert').style.opacity = 0;
			}, 1000);
		}

	}

	function skill2 () {

		//Checks to make sure the player has enough mana to preform the skill
		if (player.currentMP >= 50){
			
			player.currentMP -= 50;
			player.calcMP();

			var isDead;
			var skillDmg = player.power * 2.5;
			var totalDmg;

			document.getElementById('skillsMenu').style.opacity = 0;
			document.getElementById('skillsMenu').style.display = 'none';

			//Randomly generates the total attack damage.
			totalDmg = Math.floor(Math.random() * ((skillDmg * 2) - skillDmg) + skillDmg);

			//Shows the user how much damage was done
			document.getElementById('monsterAlert').innerHTML = totalDmg + ' DAMAGE';
			document.getElementById('monsterAlert').style.opacity = 1;

			document.getElementById('blastSprite').classList.add('blastAnim');

			//Changes the enemies current HP and then updates it with the calcHP method.
			monster.currentHP -= totalDmg;
			isDead = monster.calcHP();

			//Hides the damage alert
			setTimeout(function(){
				document.getElementById('monsterAlert').style.opacity = 0;
				document.getElementById('monsterAlert').innerHTML = '';
				document.getElementById('blastSprite').classList.remove('blastAnim');
			}, 1000);

			if (isDead){
				playerTurn = false;
				turnChange();
			}
			
		}
		else{
			document.getElementById('manaAlert').style.opacity = 1;
			document.getElementById('skillsMenu').style.opacity = 0;	
			document.getElementById('skillsMenu').style.display = 'none';
			setTimeout(function(){
				document.getElementById('manaAlert').style.opacity = 0;
			}, 1000);
		}

	}

	function skill3 () {

		//Checks to see if the hero has enough mana to preform the skill
		if (player.currentMP >= 50){

			player.currentMP -= 50;
			player.calcMP();

			document.getElementById('shieldSprite').classList.add('shieldAnim');

			player.block = 0.8;

			document.getElementById('skillsMenu').style.opacity = 0;
			document.getElementById('skillsMenu').style.display = 'none';

			playerTurn = false;
			turnChange();
		}
		else{
			document.getElementById('manaAlert').style.opacity = 1;
			document.getElementById('skillsMenu').style.opacity = 0;	
			document.getElementById('skillsMenu').style.display = 'none';
			setTimeout(function(){
				document.getElementById('manaAlert').style.opacity = 0;
			}, 1000);
		}

		
	}

	function enemyTurn () {

		var isDead;
		
		//Randomly generates the total attack damage.
		var totalDmg = Math.floor(Math.random() * ((monster.power * 2) - monster.power) + monster.power);
		console.log('enemy: ' + totalDmg);

		//Reduces the damage of the attack based on the players block percentage.
		blockDmg = Math.floor(totalDmg * player.block);
		if (player.ODActive == false){
			player.currentOD += (totalDmg + (blockDmg  * 1.5));
		}
		totalDmg = totalDmg - blockDmg;

		player.calcOD();

		//Shows the user how much damage was done
		document.getElementById('playerAlert').innerHTML = totalDmg + ' DAMAGE (' + blockDmg + ' BLOCKED)' ;
		document.getElementById('playerAlert').style.opacity = 1;

		document.getElementById('monsterSprite').classList.add('runForward');

		//Changes the enemies current HP and then updates it with the calcHP method.
		player.currentHP -= totalDmg;
		isDead = player.calcHP();

		//Hides the damage alert
		setTimeout(function(){
			document.getElementById('playerAlert').style.opacity = 0;
			document.getElementById('playerAlert').innerHTML = '';
			document.getElementById('monsterSprite').classList.remove('runForward');

			document.getElementById('healSprite').classList.remove('healAnim');
			document.getElementById('shieldSprite').classList.remove('shieldAnim');
		}, 1000)

		if (isDead){
			playerTurn = true;
			turnChange();
		}

		if (player.ODCount > 0){
			player.ODCount -= 1;
			if (player.ODCount == 0){
				heroOverdriveOff();
			}
		}

	}

	function turnChange () {

		if (playerTurn == false){

			//If it is the enemy's turn, hide the command buttons and run the enemyTurn fucntion.
			document.getElementById('commands').style.opacity = '0';
			document.getElementById('commands').style.visibility = 'hidden';
			setTimeout(enemyTurn, 2000);

		}
		else{
			
			//If it is the player's turn, show the commands.
			document.getElementById('commands').style.visibility = 'visible';
			document.getElementById('commands').style.opacity = '1';

			//Resets the block amount
			player.block = player.totalBlock;

		}



	}

	//Event listeners for player interaction
	document.getElementById('attackButton').addEventListener('click', heroAttack);
	document.getElementById('blockButton').addEventListener('click', heroBlock);
	document.getElementById('odElement').addEventListener('click', heroOverdriveOn);
	document.getElementById('close').addEventListener('click', closeSkills);
	document.getElementById('skillsButton').addEventListener('click', openSkills);
	document.getElementById('skill1').addEventListener('click', skill1);
	document.getElementById('skill2').addEventListener('click', skill2);
	document.getElementById('skill3').addEventListener('click', skill3);

}

window.onload = Game;
