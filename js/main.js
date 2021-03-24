const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

//cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');


const openModal = function(event) {
	modalCart.classList.add('show');
	document.addEventListener('keydown', escapeHandler);
};

const closeModal = function() {
	modalCart.classList.remove('show');
	 document.removeEventListener('keydown', escapeHandler);
};
const escapeHandler = event => {
            if (event.code === "Escape") {
             closeModal();
            }
     };

buttonCart.addEventListener('click', openModal);
modalCart.addEventListener('click', event => {
	const target = event.target;
            if (target.classList.contains('modal-close') || target.classList.contains('overlay')) {
               closeModal();
            };
});





//goods

const more = document.querySelector('.more');
const navigationLinks = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

more.classList.add('scroll-link');

const getGoods = async function () {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Error: ' + result.status
	}
	return await result.json();

}

const createCard = function (objCard) {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';
	const {label, img, name, description, id, price} = objCard;
	card.innerHTML = `
	<div class="goods-card">
	${label ? `<span class="label">${label}</span>` : ''}
		<img src="db/${img}" alt="${name}" class="goods-image">
		<h3 class="goods-title">${name}</h3>
		<p class="goods-description">${description}</p>
		<button class="button goods-card-btn add-to-cart" data-id="${id}">
			<span class="button-price">$${price}</span>
		</button>
	</div>
	`;
	return card;
}

const renderCards = function(data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard)
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
};
more.addEventListener('click', function(event) {
	event.preventDefault();
	getGoods().then(renderCards);
});

const filterCards = function (field, value) {
	getGoods()
	.then( data => {
		if (value === 'All') {
			return data;
		} else {
			const filteredGoods = data.filter( good => {
				return good[field] === value;
			});
			return filteredGoods;

		}
		
	})
	.then(renderCards);
};

navigationLinks.forEach( link => {
	link.addEventListener('click', event =>{
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field,value);
	})
});


//smooth scroll

const scrollLinks = document.querySelectorAll('a.scroll-link');

for (const scrollLink of scrollLinks) {
	scrollLink.addEventListener('click', function(event) {
		event.preventDefault();
		const id = scrollLink.getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	})
}






