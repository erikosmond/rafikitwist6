import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Multiselect from 'react-widgets/lib/Multiselect'
import SelectList from 'react-widgets/lib/SelectList'
import DropdownList from 'react-widgets/lib/DropdownList'
import { Field, reduxForm } from 'redux-form'
import RecipeFormStyles from 'components/styled/RecipeFormStyles'
import RecipeFormIngredient from 'components/recipes/RecipeFormIngredient'

const styles = () => (RecipeFormStyles)

let RecipeForm = props => {
  const { classes, handleSubmit, ingredientOptions } = props

  const colors = [ { color: 'Red', value: 'ff0000' },
  { color: 'Green', value: '00ff00' },
  { color: 'Blue', value: '0000ff' } ]

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.container}>
        <label className={classes.nameLabel} htmlFor="recipeName">Name</label>
        <Field className={classes.nameField} name="recipeName" component="input" type="text" />
        <label className={classes.descriptionLabel} htmlFor="description">Description</label>
        <Field className={classes.descriptionField} name="description" component="input" type="text" />
        <label className={classes.instructionsLabel} htmlFor="instructions">Instructions</label>
        <Field className={classes.instructionsField} name="instructions" component="input" type="text" />
      </div>
      <Field name="ingredient1" component={RecipeFormIngredient} props={{ingredientOptions}} />
      {/* <RecipeFormIngredient
        ingredientOptions={ingredientOptions}
      /> */}
      {/* <div>
        <label>Favorite Color</label>
        <Field
          name="favoriteColor"
          component={DropdownList}
          // data={objectToList(ingredientOptions)}
          data={ingredientOptions}
          valueField="value"
          textField="color"/>
      </div>
      <div>
        <label>Hobbies</label>
        <Field
          name="hobbies"
          component={Multiselect}
          defaultValue={[]}
          onBlur={() => props.onBlur()}
          data={[ 'Guitar', 'Cycling', 'Hiking' ]}/>
      </div>
      <div>
        <label>Sex</label>
        <Field
          name="sex"
          component={SelectList}
          onBlur={() => props.onBlur()}
          data={[ 'male', 'female' ]}/>
      </div> */}

      <button type="submit">Save</button>
    </form>
  )
}

RecipeForm = reduxForm({
  // a unique name for the form
  form: 'recipeForm'
})(RecipeForm)

RecipeForm.propTypes = {
  ingredientOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }))  
}


export default withStyles(styles)(RecipeForm)
// export default RecipeForm