import { combineReducers } from 'redux'
// ⚠️ Remember to `import` from 'redux' not 'react-redux'

import { ADD_RECIPE, REMOVE_FROM_CALENDAR } from '../actions'

// A reducer is simply a function that:
// — takes in the initial or previous state
// — an action
// does something with that action, and returns a new state

const food = (state = {}, action) => {
	switch (action.type) {
		case ADD_RECIPE:
			const { recipe } = action
			return {
				...state,
				[recipe.label]: recipe,
			}
		default:
			return state
	}
}

// Instead of setting our initial state as an empty object, we can also pass in an object, which lets us decide how the shape of our state will look like.

const initialCalendarState = {
	sunday: {
		breakfast: null,
		lunch: null,
		dinner: null,
	},
	monday: {
		breakfast: null,
		lunch: null,
		dinner: null,
	},
	tuesday: {
		breakfast: null,
		lunch: null,
		dinner: null,
	},
	wednesday: {
		breakfast: null,
		lunch: null,
		dinner: null,
	},
	thursday: {
		breakfast: null,
		lunch: null,
		dinner: null,
	},
	friday: {
		breakfast: null,
		lunch: null,
		dinner: null,
	},
	saturday: {
		breakfast: null,
		lunch: null,
		dinner: null,
	},
}

const calendar = (state = initialCalendarState, action) => {
	const { day, recipe, meal } = action

	switch (action.type) {
		case ADD_RECIPE:
			return {
				...state, // The same state that we had before
				[day]: {
					...state[day], // Again, the same state that we had before, just one level deeper
					[meal]: recipe.label,
				},
				// Here, we’re using dynamic keys to find the specific day and meal (i.e., `wednesday` and `lunch`), to traverse the state object.
			}
		case REMOVE_FROM_CALENDAR:
			return {
				...state,
				[day]: {
					...state[day],
					[meal]: null,
				},
			}
		default:
			return state
	}
}

// Redux’s `createStore()` method takes in a single reducer, not multiple. To combine all of your reducers into one, you can use Redux’s `combineReducers()` method. This allows you to use reducer composition to manage the state in your store.

export default combineReducers({
	food,
	calendar,
})

// This is shorthand for:
//
// export default combineReducers({
// 	food: food,
// 	calendar: calendar,
// })
//
// But since our keys and values have the same name, we can omit them.
//
// To be more explicit, one can do something like:
//
// export default combineReducers({
// 	food: foodReducer,
// 	calendar: calendarReducer,
// })
