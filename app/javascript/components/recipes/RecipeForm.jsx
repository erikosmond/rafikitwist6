import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
// import Multiselect from 'react-widgets/lib/Multiselect'
import { Field, reduxForm } from 'redux-form'
import RecipeFormStyles from 'components/styled/RecipeFormStyles'
import RecipeFormIngredient from 'components/recipes/RecipeFormIngredient'

const styles = () => (RecipeFormStyles)

let RecipeForm = (props) => {
  const { classes, handleSubmit, ingredientOptions } = props

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.container}>
        <div className={classes.nameLabel} htmlFor="recipeName">Name</div>
        <Field className={classes.nameField} name="recipeName" component="input" type="text" />
        <div className={classes.descriptionLabel} htmlFor="description">Description</div>
        <Field
          className={classes.descriptionField}
          name="description"
          component="input"
          type="text"
        />
        <div className={classes.instructionsLabel} htmlFor="instructions">Instructions</div>
        <Field
          className={classes.instructionsField}
          name="instructions"
          component="input"
          type="text"
        />
      </div>
      {/* TODO: figure out how to pass a blank object into field values */}
      {[...Array(1).keys()].map((k) => (
        <div key={k}>
          <Field
            name={`ingredientAmount-${k}`}
            component="input"
            type="text"
            placeholder="amount"
          />
          <Field
            name={`ingredientMod-${k}`}
            component="input"
            type="text"
            placeholder="will be dropdown"
          />
          <Field
            name={`ingredient-${k}`}
            component={RecipeFormIngredient}
            props={{ ingredientOptions, placeholder: 'Ingredient' }}
            defaultValue={{}}
            // eslint-disable-next-line react/jsx-no-bind
            format={(value) => value === '' ? {} : value}
          />
          <Field
            name={`ingredientPrep-${k}`}
            component="input"
            type="text"
            placeholder="E.g. diced, cubed, crushed, etc."
          />
          <br />
        </div>
      ))}
      {/*
      <div>
        <label>Hobbies</label>
        <Field
          name="hobbies"
          component={Multiselect}
          defaultValue={[]}
          onBlur={() => props.onBlur()}
          data={[ 'Guitar', 'Cycling', 'Hiking' ]}/>
      </div>
      */}

      <button type="submit">Save</button>
    </form>
  )
}

RecipeForm = reduxForm({
  form: 'recipeForm',
})(RecipeForm)

RecipeForm.propTypes = {
  ingredientOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  classes: PropTypes.shape({
    container: PropTypes.string,
    nameLabel: PropTypes.string,
    nameField: PropTypes.string,
    descriptionLabel: PropTypes.string,
    descriptionField: PropTypes.string,
    instructionsField: PropTypes.string,
    instructionsLabel: PropTypes.string,
  }),
  // eslint-disable-next-line react/require-default-props
  handleSubmit: PropTypes.func,
}

RecipeForm.defaultProps = {
  ingredientOptions: [],
  classes: {},
}

export default withStyles(styles)(RecipeForm)
