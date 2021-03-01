class Game {
	constructor() {
		this.wrapper = document.querySelector('.wrapper');
		this.fields = document.querySelectorAll('.field');
		this.hitsCount = document.querySelector('.hits-count').children[0];
		this.timeLeft = document.querySelector('.time-left').children[0];
		this.modal = document.querySelector('.modal');
		this.modalPoints = document.querySelector('.modal__points').children[0];

		this.isEnd = true;

		this.wrapper.addEventListener('click', this.hit);
	}

	updatingTime() {
		if (!this.isEnd) {
			const timeInterval = setInterval(() => {
				if (this.timeLeft.textContent > 0) {
					this.timeLeft.textContent--;
				} else {
					clearInterval(timeInterval);
					this.isEnd = true;
					this.modal.classList.remove('hidden');

					this.restartGame({
						timeLeft: 180,
					});
				}
			}, 1000);
		}
	}

	hit = event => {
		if (
			event.target !== this.wrapper &&
			event.target.classList.contains('active')
		) {
			this.bulkSound();

			this.hitsCount.textContent++;
			event.target.classList.remove('active');

			event.target.style.boxShadow = '0px 0px 30px 10px #0583e3';
			setTimeout(() => (event.target.style.boxShadow = null), 300);
		}
	};

	fieldMoveSpeed(ms) {
		const fieldInterval = setInterval(() => {
			if (!this.isEnd) {
				const field = document.querySelector(
					`[data-field="${between(0, this.fields.length - 1)}"]`
				);

				if (!field.classList.contains('active')) {
					field.classList.add('active');

					setTimeout(() => {
						field.classList.remove('active');
					}, ms * 3);
				}
			} else {
				clearInterval(fieldInterval);
				this.modalPoints.textContent = this.hitsCount.textContent;
			}
		}, ms);
	}

	bulkSound() {
		const audio = new Audio('sounds/bulk.mp3');

		audio.play();
	}

	startGame() {
		const btn = document.querySelector('.start-game');

		btn.addEventListener('click', () => {
			this.isEnd = false;
			this.updatingTime();
			this.fieldMoveSpeed(500);

			btn.remove();
		});
	}

	restartGame({ timeLeft }) {
		const btn = document.querySelector('.modal__restart');

		btn.addEventListener('click', () => {
			this.isEnd = false;
			this.modal.classList.add('hidden');
			this.hitsCount.textContent = '0';
			this.timeLeft.textContent = timeLeft;

			this.updatingTime();
		});
	}

	addClassFields() {
		this.fields.forEach((item, idx) => (item.dataset.field = idx));
	}
}

function between(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
	game.addClassFields();
	game.startGame();
});
