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
const more = document.querySelector('.more');
const navigationLinks = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const showAccesories = document.querySelectorAll('.show-accesories');
const showClothes = document.querySelectorAll('.show-clothes');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cartTableTotal = document.querySelector('.card-table__total');
const cartCountItem = document.querySelector('.cart-count');
const cartClearBtn = document.querySelector('.cart-clear');

const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Error: ' + result.status
	}
	return await result.json();

};

const cart = {
	cartGoods: [],
	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({ id, name, price, count }) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;
			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
			
		});

		const totalPrice = this.cartGoods.reduce( (total,item) => total + item.price * item.count,0);
		cartTableTotal.textContent = totalPrice + "$";
		const totalItems = this.cartGoods.reduce( (sum,item) => sum + item.count,0);
		cartCountItem.textContent = totalItems;
		
	},
	deleteGood(id){
		this.cartGoods = this.cartGoods.filter( item => item.id !== id);
		this.renderCart();
	},
	minusGood(id){
		for(const item of this.cartGoods) {
			if (item.id === id) {
				if(item.count <= 1) {
					this.deleteGood(id);
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
	},
	plusGood(id){
		for(const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart();
	},
	addCartGoods(id){
		const goodItem = this.cartGoods.find(item => item.id === id);
		if(goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
			.then(data => data.find( item => item.id === id))
			.then(({ id, name, price }) => {
				this.cartGoods.push({
					id,
					name,
					price,
					count: 1
				});
			});
		}
	},
	clearCart(){
		this.cartGoods = this.cartGoods.filter( item => item.id  === "-1");
		this.renderCart();
	}
}
//add to cart all buttons
document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');
	if (addToCart) {
		cart.addCartGoods(addToCart.dataset.id);
	}
})
//clear cart
cartClearBtn.addEventListener('click', event => {
	cart.clearCart();
})

//delete on cick
cartTableGoods.addEventListener('click', event => {
	const target = event.target;
	if (target.tagName === "BUTTON") {
		const id = target.closest('.cart-item').dataset.id;

		if (target.classList.contains('cart-btn-delete')) {
			cart.deleteGood(id);
		};

		if (target.classList.contains('cart-btn-minus')) {
			cart.minusGood(id);
		};
		if (target.classList.contains('cart-btn-plus')) {
			cart.plusGood(id);
		};
	};
});

const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show');
	document.addEventListener('keydown', escapeHandler);
};

const closeModal = () => {
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

more.classList.add('scroll-link');

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
more.addEventListener('click', event => {
	event.preventDefault();
	getGoods().then(renderCards);
});

const filterCards = function (field, value) {
	getGoods()
	.then( data => {
		if (value === 'All') {
			return data;
		} else {
			return data.filter( good => good[field] === value);
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


//banners
showAccesories.forEach (item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category','Accessories');
});
});

showClothes.forEach (item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category','Clothing');
});
});



//smooth scroll

const scrollLinks = document.querySelectorAll('a.scroll-link');

for (const scrollLink of scrollLinks) {
	scrollLink.addEventListener('click', event => {
		event.preventDefault();
		const id = scrollLink.getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	})
}