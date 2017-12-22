import React, { Component } from 'react'
import { connect } from 'react-redux'
import calendar from '../reducers/index'

class App extends Component {
	render() {
		console.log(this.props)
		return <div>Hello World</div>
	}
}

// This function passes in our Redux state as props that our component can use
function mapStateToProps(calendar) {
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
			/* Go through each day in our Redux state and 'collect' the meals into a new object. */
			meals: Object.keys(calendar[day]).reduce((meals, meal) => {
				meals[meal] = calendar[day][meal] ? calendar[day][meal] : null
				return meals
			}, {}),
		})),
	}
}
export default connect(mapStateToProps)(App)
