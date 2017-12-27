import { ADD_RECIPE, REMOVE_FROM_CALENDAR } from '../actions'

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

// Here, we define the initial state of our application, which lets us decide how the shape of our state will look like.
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
					...state[day],
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

export default calendar
