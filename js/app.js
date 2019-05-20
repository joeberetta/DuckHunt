function preloadImages(array, waitForOtherResources, timeout) {
	var loaded = false, list = preloadImages.list, imgs = array.slice(0), t = timeout || 15 * 1000, timer;
	if (!preloadImages.list) {
		preloadImages.list = [];
	}
	if (!waitForOtherResources || document.readyState === 'complete') {
		loadNow();
	} else {
		window.addEventListener("load", function () {
			clearTimeout(timer);
			loadNow();
		});
		// in case window.addEventListener doesn't get called (sometimes some resource gets stuck)
		// then preload the images anyway after some timeout time
		timer = setTimeout(loadNow, t);
	}

	function loadNow() {
		if (!loaded) {
			loaded = true;
			for (var i = 0; i < imgs.length; i++) {
				var img = new Image();
				img.onload = img.onerror = img.onabort = function () {
					var index = list.indexOf(this);
					if (index !== -1) {
						// remove image from the array once it loaded
						// for memory consumption reasons
						list.splice(index, 1);
					}
				}
				list.push(img);
				img.src = imgs[i];
			}
		}
	}
}
preloadImages(["img/bg.jpg", "img/life++.svg", "img/life--.svg", "style/duckhunt.woff"], true);

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

		let Duck = document.createElement('label');
		Duck.classList.add('duck');
		Duck.appendChild(DuckHeart);
		DuckHeart.addEventListener('click', () => {
			Duck.remove();
			this.Died();
		})
		if(this.direction < 0)
			Duck.style.backgroundImage = 'url(img/duck-r.gif)'
		else
			Duck.style.backgroundImage = 'url(img/duck-l.gif)'

		Duck.style.width = this.width + 'px';
		Duck.style.height = this.height + 'px';
		Duck.style.left = this.left + 'px';
		Duck.style.top = this.top + 'px';

		document.body.append(Duck);
		return Duck;
	}
	Fly(Duck = this.initDuck()) {
		let DuckFlyAnimation = setInterval(() => {
			Duck.animate(
										[
											{ top: (Math.random() * screen.availHeight * 0.6 + screen.availHeight * 0.1) + 'px'},
											{ top: (Math.random() * screen.availHeight * 0.6 + screen.availHeight * 0.1) + 'px'}
										], 
										{
											easing: 'ease',
											iterations: 1
										}
									)

			if (this.direction < 0) {
				this.left -= this.speed;
				Duck.style.left = this.left + 'px';
				if (this.left < -116) {
					Duck.remove();
					this.Out()
					newGame.minusLife();
				}
			}
			else {
				this.left += this.speed
				Duck.style.left = this.left + 'px';
				if (this.left > (screen.availWidth + 16)) {
					Duck.remove();
					this.Out()
					newGame.minusLife();
				}
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
		}, 1000)
		this.gameTimer = timer;
		for (let i = 0; i < document.getElementsByClassName('life').length; i++)
			document.getElementsByClassName('life')[i].style.background = "url('img/life++.svg')";
			quack();
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

		quack();
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
ducks.volume = 0.0045;
ducks.loop = true;
function quack() {
	if (ducks.paused)
		ducks.play();
	else
		ducks.pause();
}

// Play button
let play = document.getElementById('play'), stats = document.getElementById('wrapper');
play.onclick = () => {
	newGame = new Game();

	play.style.display = 'none';
	stats.style.display = 'flex';
}
