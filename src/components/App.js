import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addRecipe, removeFromCalendar } from '../actions'
import { capitalize } from '../utils/helpers'
import CalendarIcon from 'react-icons/lib/fa/calendar-plus-o'
import Modal from 'react-modal'
import ArrowRightIcon from 'react-icons/lib/fa/arrow-circle-right'
import Loading from 'react-loading'
import { fetchRecipes } from '../utils/api'
import FoodList from './FoodList'
import ShoppingList from './ShoppingList'

class App extends Component {
	state = {
		foodModalOpen: false,
		meal: null,
		day: null,
		food: null,
		loadingFood: false,
		ingredientsModalOpen: false,
	}

	openFoodModal = ({ meal, day }) => {
		this.setState(() => ({
			foodModalOpen: true,
			meal,
			day,
		}))
	}

	closeFoodModal = () => {
		this.setState(() => ({
			foodModalOpen: false,
			meal: null,
			day: null,
			food: null,
		}))
	}

	searchFood = event => {
		if (!this.input.value) {
			return
		}

		event.preventDefault()

		this.setState(() => ({ loadingFood: true }))

		fetchRecipes(this.input.value).then(food =>
			this.setState(() => ({
				food,
				loadingFood: false,
			})),
		)
	}

	openIngredientsModal = () =>
		this.setState(() => ({
			ingredientsModalOpen: true,
		}))

	closeIngredientsModal = () =>
		this.setState(() => ({
			ingredientsModalOpen: false,
		}))

	generateShoppingList = () => {
		return this.props.calendar
			.reduce((result, { meals }) => {
				const { breakfast, lunch, dinner } = meals

				// If there is a recipe added to the meal then push it to the array, otherwise ignore it.
				breakfast && result.push(breakfast)
				lunch && result.push(lunch)
				dinner && result.push(dinner)

				return result
			}, [])
			.reduce(
				// then flatten the array of recipe ingredients from each meal into a new array
				(allIngredients, { ingredientLines }) =>
					allIngredients.concat(ingredientLines),
				[],
			)
	}

	render() {
		const {
			foodModalOpen,
			loadingFood,
			food,
			ingredientsModalOpen,
		} = this.state
		const { calendar, remove, selectRecipe } = this.props
		const mealOrder = ['breakfast', 'lunch', 'dinner']
		return (
			<div className="container">
				<div className="nav">
					<h1 className="header">UdaciMeals</h1>
					<button className="shopping-list" onClick={this.openIngredientsModal}>
						Shopping List
					</button>
				</div>

				<ul className="meal-types">
					{// Map over `mealOrder` array
					// and print out the name of each meal as a header
					mealOrder.map(mealType => (
						<li key={mealType} className="subheader">
							{capitalize(mealType)}
						</li>
					))}
				</ul>

				<div className="calendar">
					<div className="days">
						{// Map over `calendar` array created in mapStateToProps
						// and print out the name of each day as a header
						calendar.map(({ day }) => (
							<h3 key={day} className="subheader">
								{capitalize(day)}
							</h3>
						))}
					</div>
					<div className="icon-grid">
						{// For each meal, in each day of the week:
						calendar.map(({ day, meals }) => (
							// Destructure `day` and `meals` from each object in the `calendar` array
							<ul key={day}>
								{mealOrder.map(meal => (
									<li key={meal} className="meal">
										{// If there is a specific meal added to that day, then show that meal
										meals[meal] ? (
											<div className="food-item">
												<img src={meals[meal].image} alt={meals[meal].label} />
												<button onClick={() => remove({ meal, day })}>
													Clear
												</button>
											</div>
										) : (
											// If not, render a button that lets users add a meal
											<button
												onClick={() => this.openFoodModal({ meal, day })}
												className="icon-btn"
											>
												<CalendarIcon size={30} />
											</button>
										)}
									</li>
								))}
							</ul>
						))}
					</div>
				</div>

				<Modal
					className="modal"
					overlayClassName="overlay"
					isOpen={foodModalOpen}
					onRequestClose={this.closeFoodModal}
					contentLabel="Modal"
				>
					<div>
						{loadingFood === true ? (
							<Loading
								delay={200}
								type="spin"
								color="#222"
								className="loading"
							/>
						) : (
							<div className="search-container">
								<h3 className="subheader">
									Find a meal for {capitalize(this.state.day)} {this.state.meal}.
								</h3>
								<div className="search">
									<input
										className="food-input"
										type="text"
										placeholder="Search Foods"
										ref={input => (this.input = input)}
									/>
									<button className="icon-btn" onClick={this.searchFood}>
										<ArrowRightIcon size={30} />
									</button>
								</div>
								{food !== null && (
									<FoodList
										food={food}
										onSelect={recipe => {
											selectRecipe({
												recipe,
												day: this.state.day,
												meal: this.state.meal,
											})
											this.closeFoodModal()
										}}
									/>
								)}
							</div>
						)}
					</div>
				</Modal>

				<Modal
					className="modal"
					overlayClassName="overlay"
					isOpen={ingredientsModalOpen}
					onRequestClose={this.closeIngredientsModal}
					contentLabel="Modal"
				>
					{ingredientsModalOpen && (
						<ShoppingList list={this.generateShoppingList()} />
					)}
				</Modal>
			</div>
		)
	}
}

// This function passes in our Redux state as props that our component can use
function mapStateToProps({ food, calendar }) {
	const dayOrder = [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
	]

	return {
		/* We’re trying to reformat our Redux state from an object to an array (so that we can map through it with React). In our new array, each item represents a day of the week, that contains am object describing the name of the day, and the meals belonging to it. */
		calendar: dayOrder.map(day => ({
			day,
			/* Go through each day in our Redux state and 'collect' the meals into a new object called `meals`. */
			meals: Object.keys(calendar[day]).reduce((meals, meal) => {
				meals[meal] = calendar[day][meal]
					? food[calendar[day][meal]] // Search for an item in the `food` object with the key that matches the meal ID referenced in the `calendar` object.
					: null
				return meals
			}, {}),
		})),
	}
}

// This function lets us dispatch an action by calling a method on our component instead of calling dispatch directly. It’s optional; we can use `dispatch` directly since we have access to it as a prop. It just lets us clean up our component.
function mapDispatchToProps(dispatch) {
	return {
		selectRecipe: data => dispatch(addRecipe(data)),
		remove: data => dispatch(removeFromCalendar(data)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
