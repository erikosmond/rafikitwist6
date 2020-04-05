import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Multiselect from 'react-widgets/lib/Multiselect'
import { Field, FieldArray, reduxForm } from 'redux-form'
import RecipeFormStyles from 'components/styled/RecipeFormStyles'
import RecipeFormIngredient from 'components/recipes/RecipeFormIngredient'

const styles = () => (RecipeFormStyles)

const renderField = (args) => {
  const {
    input, label, type, meta: { touched, error }
  } = args
  return (
    <div>
      <label>{label}</label>
      <div>
        <input {...input} type={type} placeholder={label} />
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  )
}

const renderIngredients = (args) => {
  const {
    fields,
    ingredientModificationOptions,
    ingredientOptions,
    meta: { error, submitFailed }
  } = args
  return (
    <ul>
      <li>
        {submitFailed && error && <span>{error}</span>}
      </li>
      {fields.map((member, index) => (
        <li key={index}>
          <Field
            name="ingredientAmount"
            component="input"
            type="text"
            placeholder="amount"
          />
          <Field
            name="ingredientModification"
            component={RecipeFormIngredient}
            props={{
              ingredientOptions: ingredientModificationOptions,
              placeholder: 'Ingredient Modification',
            }}
            defaultValue={{}}
            // eslint-disable-next-line react/jsx-no-bind
            format={value => value === '' ? {} : value}
          />
          <Field
            name="ingredient"
            component={RecipeFormIngredient}
            props={{ ingredientOptions, placeholder: 'Ingredient' }}
            defaultValue={{}}
            // eslint-disable-next-line react/jsx-no-bind
            format={value => value === '' ? {} : value}
          />
          <Field
            name="ingredientPrep"
            component="input"
            type="text"
            placeholder="E.g. sliced, cubed, crushed, etc."
          />
          <button
            type="button"
            title="Remove Ingredient"
            onClick={() => fields.remove(index)}
          >
            Remove
          </button>
        </li>
      ))}
      <li>
        <button type="button" onClick={() => fields.push({})}>
          Add Ingredient
        </button>
      </li>
    </ul>
  )
}

let RecipeForm = (props) => {
  const {
    classes,
    handleSubmit,
    ingredientModificationOptions,
    ingredientOptions,
  } = props
  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.container}>
        <div className={classes.nameLabel} htmlFor="recipeName">Recipe Name</div>
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
      <FieldArray
        name="ingredients"
        component={renderIngredients}
        ingredientModificationOptions={ingredientModificationOptions}
        ingredientOptions={ingredientOptions}
      />
      <div>
        <label>Hobbies</label>
        <Field
          name="hobbies"
          component={Multiselect}
          defaultValue={[]}
          onBlur={() => props.onBlur()}
          data={[ 'Guitar', 'Cycling', 'Hiking' ]}/>
      </div>

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
  ingredientModificationOptions: PropTypes.arrayOf(PropTypes.shape({
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
  // handleSubmit is passed in from ReduxForm, but if it's marked as required,
  // a js error is logged has missing,
  // eslint-disable-next-line react/require-default-props
  handleSubmit: PropTypes.func,
}

RecipeForm.defaultProps = {
  ingredientModificationOptions: [],
  ingredientOptions: [],
  classes: {},
}

export default withStyles(styles)(RecipeForm)
