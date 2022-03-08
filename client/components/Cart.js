import React from 'react';
import { connect } from 'react-redux';

import CartItems from './CartItems';
import CartItemEmpty from './CartItemEmpty';
import Checkout from './Checkout';
import { cartItems, _clearBooks, addBook, removeBook, editQuantity } from '../store/cart';

class Cart extends React.Component {
	constructor() {
		super();
		this.state = { books: null, total: 0, checkout: false };

		this.handleBooks = this.handleBooks.bind(this);
		this.handleQuantity = this.handleQuantity.bind(this);

		this.handleTotal = this.handleTotal.bind(this);

		// this.handleDelete = this.handleDelete.bind(this);
		// this.handleCheckout = this.handleCheckout.bind(this);
	}

	componentDidMount() {
		if (localStorage.getItem('token')) {
			this.props.cartItems();
			this.handleTotal();
		}
	}

	componentDidUpdate(prvProps, prvState) {
		if (prvProps.user.id !== this.props.user.id) {
			if (prvState.total !== this.state.total) {
				this.handleTotal();
			}
			this.props.cartItems();
		}
	}

	componentWillUnmount() {
		if (this.props.user.id) {
			this.props.clearBooks();
		}
	}

	handleBooks() {
		return this.props.cart.map(obj => (
			<CartItems
				key={obj.id}
				data={obj.book}
				quantity={obj.quantity}
				quantityFn={this.handleQuantity}
				removeBookFn={this.handleDelete}
			/>
		));
	}

	handleTotal() {
		/* Method sets state, returns null */
		const priceReducer = books => {
			const price = books.reduce((prv, cur) => {
				console.log(prv);
				console.log(cur);

				return Number(prv) + Number(cur.price) * Number(cur.quantity);
			}, 0);

			return parseFloat(price).toFixed(2);
		};

		if (this.props.cart.length > 0) {
			const total = priceReducer(this.props.cart);
			console.log(total);
			console.log(this.props.cart);
			this.setState({ total: total });
			return null;
		}
	}

	handleQuantity(quantity, type, book) {
		let editQuantity = 0;
		if (type === 'increase') {
			editQuantity = quantity + 1;
		} else if (type === 'decrease') {
			editQuantity = quantity - 1;
		}

		this.props.editQuantity(book, editQuantity);
		// this.handleTotal();
	}

	handleDelete(book) {
		this.props.removeBook(book);
	}

	handleCheckout() {
		this.setState({ checkout: true });
	}

	render() {
		console.log(this.props);
		return this.state.checkout ? (
			<Checkout books={this.state.books} total={this.state.total} />
		) : (
			<div className="cart">
				<h3>
					{this.props.user.username ? this.props.user.username : 'Visitor'} 's
					books
				</h3>
				<div className="items">{this.handleBooks()}</div>

				<div className="cart-total">
					<h4 className="cart-total__text">Total</h4>
					<h4 className="cart-total__amount">${this.state.total}</h4>
				</div>
				<div className="cart-checkout">
					{this.props.user.id ? '' : 'Not logged in. You are ordering as guest'}
					<button
						disabled={
							this.state.books === null || this.state.books.length === 0
								? true
								: false
						}
						onClick={this.handleCheckout}
						className="cart-checkout__btn"
						type="button">
						Checkout
					</button>
				</div>
			</div>
		);
	}
}

const mapState = state => {
	return {
		user: state.auth,
		cart: state.cart
	};
};

const mapDispatch = dispatch => {
	return {
		cartItems: () => dispatch(cartItems()),
		clearBooks: () => dispatch(_clearBooks()),
		// removeBook: book => dispatch(deleteBook(book)),
		editQuantity: (book, quantity) => dispatch(editQuantity(book, quantity))
	};
};

export default connect(mapState, mapDispatch)(Cart);
