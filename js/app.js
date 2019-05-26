class Duck {
	constructor(width = 60, height = 75) {
		this.width = (window.innerWidth < 1024) ? width : 1.5 * width,
			this.height = (window.innerWidth < 1024) ? height : 1.5 * height,
		this.top = Math.floor(Math.random() * screen.availHeight * 0.6 + screen.availHeight * 0.1),
		this.direction = Math.floor(Math.random() * 1 - 0.5),
		this.left = (this.direction < 0) ? (this.left = window.innerWidth + 16) : (this.left = 0 - (this.width + 16)),
		this.speed = (Math.random() * 1 + 0.5),
		this.FlyAnimation,
		this.died = false,
		this.Fly();
	}
	initDuck() {
		let DuckHeart = document.createElement('input');
		DuckHeart.type = 'checkbox';
		DuckHeart.name = 'duck';
		DuckHeart.style.zIndex = 999;

		let Duck = document.createElement('label');
		Duck.classList.add('duck');
		Duck.appendChild(DuckHeart);
		// Duck.appendChild(DuckArea);
		DuckHeart.addEventListener('click', () => {
			Duck.remove();
			this.Died();
		})
		window.addEventListener('click', () => {
			if (Math.abs(event.clientX - (this.left + this.width / 2)) < this.width * 2.5 && Math.abs(event.clientY - (this.top + this.height / 2)) < this.height * 2.5) {
				this.speed += 1;
				if ( this.direction < 0 && event.clientX < (this.left + 0.5 * this.width) || this.direction >= 0 && event.clientX > (this.left + 0.5 * this.width) ) {
					this.speed *= -1;
					Duck.classList.toggle('duck-l');
					Duck.classList.toggle('duck-r');
				}
			}
		})

		if(this.direction < 0)
			Duck.classList.add('duck-r');
		else
			Duck.classList.add('duck-l');

		Duck.style.width = this.width + 'px';
		Duck.style.height = this.height + 'px';
		Duck.style.left = this.left + 'px';
		Duck.style.top = this.top + 'px';

		document.body.append(Duck);
		return Duck;
	}
	Fly(Duck = this.initDuck()) {
		let DuckFlyAnimation = setInterval(() => {
			if (this.direction < 0) {
				this.left -= this.speed;
				Duck.style.left = this.left + 'px';
			}
			else {
				this.left += this.speed
				Duck.style.left = this.left + 'px';
			}
			if (this.left < -116 || this.left > (screen.availWidth + 16) || this.top < -60) {
				Duck.remove();
				this.Out()
				newGame.minusLife();
			}
		}, 4)

		this.FlyAnimation = DuckFlyAnimation;
	}

	Died() {
		clearInterval(this.FlyAnimation);
		newGame.plusScore();
	}
	Out() {
		clearInterval(this.FlyAnimation)
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////
class Game {
	constructor(bestScore = localStorage.getItem("bestScore"), lifeCount = 2) {
		this.bestScore = (bestScore != null || bestScore != undefined) ? bestScore : 0,
		this.score = 0,
		this.life = lifeCount,
		this.gameTimer,
		this.AllDucks = [],
		this.start()
	}
	start() {
		if (localStorage.getItem('bestScore') != null || localStorage.getItem('bestScore') != undefined)
			document.getElementById('best').innerHTML = localStorage.getItem('bestScore');
		else
			document.getElementById('best').innerHTML = 0;

		let timer = setInterval(() => {
			this.AllDucks.push(new Duck());
		}, 2000)
		this.gameTimer = timer;
		for (let i = 0; i < document.getElementsByClassName('life').length; i++)
			document.getElementsByClassName('life')[i].style.background = "url('img/life++.svg')";
			quack_on();
	}
	gameOver() {
		if (this.bestScore < this.score)
			this.bestScore = this.score;
		this.score = 0;
		localStorage.setItem("bestScore", this.bestScore)

		document.getElementById('best').innerHTML = this.bestScore;
		document.getElementById('score').innerHTML = this.score;
		clearInterval(this.gameTimer);
		this.AllDucks.forEach(Duck => {
			Duck.Out();
		})
		document.body.querySelectorAll('.duck').forEach(duck => {
			duck.remove();
		})
		play.style.display = 'block';
		stats.style.display = 'none';

		quack_off();
	}
	minusLife() {
		document.getElementsByClassName('life')[this.life].style.background = "url('img/life--.svg')"
		if (this.life == 0)
			this.gameOver()
		else
			this.life--;
	}
	plusScore() {
		this.score++
		document.getElementById('score').innerHTML = this.score;
	}
}
// Adding ducks quacking while playing
var ducks = document.createElement("audio");
ducks.src = "sound/ducks.ogg";
ducks.volume = 0.007;
ducks.loop = true;
function quack_on() { ducks.play() }
function quack_off() { ducks.remove() }
// Play button
let play = document.getElementById('play'), stats = document.getElementById('wrapper');
play.onclick = () => {
	newGame = new Game();

	play.style.display = 'none';
	stats.style.display = 'flex';
}

window.onclick = function openFullscreen() {
	elem = window;
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) { /* Firefox */
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE/Edge */
			elem.msRequestFullscreen();
		}
}