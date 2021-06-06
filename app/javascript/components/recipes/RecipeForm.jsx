import React from 'react'
import PropTypes from 'prop-types'
import { Field, FieldArray, reduxForm } from 'redux-form'
import RecipeFormStyles from 'components/styled/RecipeFormStyles'
import RecipeFormIngredient from 'components/recipes/RecipeFormIngredient'
import RecipeFormTagSelectors from 'components/recipes/RecipeFormTagSelectors'
import { withStyles } from '@material-ui/core/styles'

const styles = () => (RecipeFormStyles)

const formatValue = () => (value) => {
  if (value === '') {
    return {}
  }
  return value
}

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
            format={formatValue()}
          />
          <Field
            name={`${member}.ingredient`}
            component={RecipeFormIngredient}
            props={{ ingredientOptions, placeholder: 'Ingredient' }}
            defaultValue={{}}
            format={formatValue()}
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
    handleRecipeIsIngredient,
    ingredientModificationOptions,
    ingredientOptions,
    tagOptions,
    recipeIsIngredient,
  } = props
  if (
    tagOptions === {} || ingredientModificationOptions === [] || ingredientOptions === []
  ) {
    return null
  }
  const openTagForm = () => {
    handleTagFormModal({ tagFormModalOpen: true })
  }
  const recipeIsIngredientClick = (event) => {
    handleRecipeIsIngredient({
      recipeIsIngredient: event.target.value === '' || event.target.value !== 'true',
    })
  }
  const buildParentTagDropdown =
    tagOptions.ingredientCategory
      .concat(tagOptions.ingredientFamily)
      .concat(tagOptions.ingredientType)
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
        onClick={recipeIsIngredientClick}
      />
      {recipeIsIngredient && (
        <div>
          <br />
          <Field
            name="parentTags"
            component={RecipeFormTagSelectors}
            props={{
              tagOptions: buildParentTagDropdown,
              title: 'Parent Tags',
              id: 'parenttags',
            }}
          />
        </div>
      )}
      <br />
      <Field
        name="sources"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.source,
          title: 'Sources',
          id: 'sources',
        }}
      />
      <br />
      <Field
        name="vessels"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.vessel,
          title: 'Vessels',
          id: 'vessels',
        }}
      />
      <br />

      <Field
        name="recipeTypes"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.recipeType,
          title: 'Recipe Types',
          id: 'recipe_types',
        }}
      />
      <br />

      <Field
        name="menus"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.menu,
          title: 'Menus',
          id: 'menues',
        }}
      />
      <br />

      <Field
        name="preparations"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.preparation,
          title: 'Preparations',
          id: 'preparations',
        }}
      />
      <br />

      <Field
        name="flavors"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.flavor,
          title: 'Flavors',
          id: 'flavors',
        }}
      />
      <br />

      <Field
        name="components"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: tagOptions.component,
          title: 'Component',
          id: 'component',
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
  recipeIsIngredient: PropTypes.bool,
}

RecipeForm.defaultProps = {
  ingredientModificationOptions: [],
  ingredientOptions: [],
  tagOptions: {},
  classes: {},
  recipeIsIngredient: false,
}

export default withStyles(styles)(RecipeForm)
