import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addRecipe, removeFromCalendar } from '../actions'

class App extends Component {
	render() {
		console.log(this.props)
		return <div>Hello World</div>
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
