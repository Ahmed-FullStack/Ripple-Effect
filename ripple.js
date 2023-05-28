const buttons = document.querySelectorAll('button');
const anchortags = document.querySelectorAll('a');

class RippleEffect {
	constructor(el) {
		this.el = el;
		this.rippleContainer = this.#rippleSetup();
		this.#ripple();
	}
	eventType = {
		POINTER_DOWN: 'pointerdown',
		KEY_DOWN: 'keydown',
	};
	#rippleSetup() {
		const rippleContainer = document.createElement('div');
		rippleContainer.classList.add('mdc-ripple');
		this.el.appendChild(rippleContainer);
		return rippleContainer;
	}

	#removeRipple(ripple) {
		const rippleStyle = window.getComputedStyle(this.el);

		const rippleOpacityDelay = rippleStyle.getPropertyValue(
			'--opacity-animation-duration'
		);
		const rippleAnimationDelay = rippleStyle.getPropertyValue(
			'--ripple-animation-duration'
		);
		setTimeout(() => {
			ripple.classList.add('opacity-animation');
			setTimeout(() => {
				ripple.remove();
			}, rippleAnimationDelay);
		}, rippleOpacityDelay);
	}
	#createRippleEffect(e) {
		const targetElIndex = [...this.el.children].findIndex(
			el => el === e.target
		);
		if (this.el !== e.target && e.target.querySelector('.mdc-ripple')) return;
		if (!this.el.children[targetElIndex] && this.el !== e.target) return;
		const ripple = document.createElement('div');
		ripple.classList.add('ripple');
		this.rippleContainer.appendChild(ripple);

		const { width, height, x, y } = this.el.getBoundingClientRect();

		const maxDimension = Math.max(width, height);
		const hypotenus = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

		const rippleScale = (hypotenus + 10) / maxDimension;

		ripple.style.setProperty('--max-dimension', `${maxDimension.toFixed(2)}px`);
		ripple.style.setProperty('--ripple-scale', `${rippleScale.toFixed(2)}`);

		const xCoordinateEnd = width / 2 - maxDimension / 2;
		const yCoordinateEnd = height / 2 - maxDimension / 2;

		ripple.style.setProperty(
			'--x-coordinate-end',
			`${xCoordinateEnd.toFixed(2)}px`
		);
		ripple.style.setProperty(
			'--y-coordinate-end',
			`${yCoordinateEnd.toFixed(2)}px`
		);

		if (e.type === this.eventType.POINTER_DOWN) {
			const xCoordinate = e.clientX - x - maxDimension / 2;
			const yCoordinate = e.clientY - y - maxDimension / 2;

			ripple.style.setProperty('--x-coordinate', `${xCoordinate.toFixed(2)}px`);
			ripple.style.setProperty('--y-coordinate', `${yCoordinate.toFixed(2)}px`);

			ripple.classList.add('ripple-animation');
			this.el.addEventListener(
				'pointerup',
				this.#removeRipple.bind(this, ripple),
				{
					once: true,
				}
			);
			this.el.addEventListener(
				'pointerleave',
				this.#removeRipple.bind(this, ripple),
				{
					once: true,
				}
			);
		}
		if (e.type === this.eventType.KEY_DOWN) {
			ripple.style.setProperty(
				'--x-coordinate',
				`${xCoordinateEnd.toFixed(2)}px`
			);
			ripple.style.setProperty(
				'--y-coordinate',
				`${yCoordinateEnd.toFixed(2)}px`
			);
			ripple.classList.add('ripple-animation');

			this.el.addEventListener('keyup', this.#removeRipple.bind(this, ripple), {
				once: true,
			});
		}
	}
	#ripple() {
		this.el.addEventListener('pointerdown', e => {
			if (e.buttons !== 1) return;
			this.#createRippleEffect.bind(this, e)();
		});
		this.el.addEventListener('keydown', e => {
			if (e.key !== 'Enter' && e.key !== ' ') return;
			if (e.repeat) return;
			console.log('kk');
			this.#createRippleEffect.bind(this, e)();
		});
	}
}

function rippleHTMLELements(element) {
	if (typeof element === Array) return;
	const elementType = element.nodeName.toLowerCase();
	const elementFullName = element.constructor.name;
	if (elementType !== `button` && elementType !== `a`) {
		new RippleEffect(element);
	} else {
		console.error(`${elementFullName} has already been rippled`);
	}
}

export { rippleHTMLELements };

export default function ripple() {
	buttons.forEach(button => {
		new RippleEffect(button);
	});
	anchortags.forEach(anchortag => {
		new RippleEffect(anchortag);
	});
}
