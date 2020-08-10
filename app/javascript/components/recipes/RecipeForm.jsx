import React from 'react'
import PropTypes from 'prop-types'
import { Field, FieldArray, reduxForm } from 'redux-form'
import RecipeFormStyles from 'components/styled/RecipeFormStyles'
import RecipeFormIngredient from 'components/recipes/RecipeFormIngredient'
import RecipeFormTagSelectors from 'components/recipes/RecipeFormTagSelectors'
import { withStyles } from '@material-ui/core/styles'

const styles = () => (RecipeFormStyles)

const renderIngredients = (args) => {
  const {
    fields,
    ingredientModificationOptions,
    ingredientOptions,
    meta: { error, submitFailed },
  } = args
  return (
    <ul>
      <li>
        {submitFailed && error && <span>{error}</span>}
      </li>
      {fields.map((member, index) => (
        <li key={index}>
          <Field
            name={`${member}.ingredientAmount`}
            component="input"
            type="text"
            placeholder="amount"
          />
          <Field
            name={`${member}.ingredientModification`}
            component={RecipeFormIngredient}
            props={{
              ingredientOptions: ingredientModificationOptions,
              placeholder: 'Ingredient Modification',
            }}
            defaultValue={{}}
            format={(value) => value === '' ? {} : value}
          />
          <Field
            name={`${member}.ingredient`}
            component={RecipeFormIngredient}
            props={{ ingredientOptions, placeholder: 'Ingredient' }}
            defaultValue={{}}
            format={(value) => value === '' ? {} : value}
          />
          <Field
            name={`${member}.ingredientPrep`}
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
    handleTagFormModal,
    handleRecipeIsIngredient
    ingredientModificationOptions,
    ingredientOptions,
    tagOptions,
  } = props
  const openTagForm = () => {
    handleTagFormModal({ tagFormModalOpen: true })
  }
  const recipeIsIngredient = (event) => {
    handleRecipeIsIngredient({ recipeIsIngredient: true })
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.container}>
        <Field
          name="id"
          component="input"
          type="hidden"
        />
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
      <button type="button" onClick={openTagForm}>
        Add Tag
      </button>
      <FieldArray
        name="ingredients"
        component={renderIngredients}
        ingredientModificationOptions={ingredientModificationOptions}
        ingredientOptions={ingredientOptions}
      />
      <div htmlFor="isIngredient">Is used as an ingredient</div>
      <Field
        name="isIngredient"
        id="isIngredient"
        component="input"
        type="checkbox"
        onClick={handleRecipeIsIngredient}
      />
      <br />
      // TODO: add parent tags dropdown
      <Field
        name="sources"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.source,
          title: 'Sources',
        }}
      />
      <br />
      <Field
        name="vessels"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.vessel,
          title: 'Vessels',
        }}
      />
      <br />

      <Field
        name="recipe_types"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.recipeType,
          title: 'Recipe Types',
        }}
      />
      <br />

      <Field
        name="menus"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.menu,
          title: 'Menus',
        }}
      />
      <br />

      <Field
        name="preparations"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.preparation,
          title: 'Preparations',
        }}
      />
      <br />

      <Field
        name="flavors"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.flavor,
          title: 'Flavors',
        }}
      />
      <br />

      <Field
        name="components"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.component,
          title: 'Component',
        }}
      />
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
  tagOptions: PropTypes.shape(),
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
  // a js error is logged as missing,
  // eslint-disable-next-line react/require-default-props
  handleSubmit: PropTypes.func,
  handleTagFormModal: PropTypes.func.isRequired,
  handleRecipeIsIngredient: PropTypes.func.isRequired,
}

RecipeForm.defaultProps = {
  ingredientModificationOptions: [],
  ingredientOptions: [],
  tagOptions: {},
  classes: {},
}

export default withStyles(styles)(RecipeForm)
