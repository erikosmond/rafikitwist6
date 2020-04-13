import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field, FieldArray, reduxForm } from 'redux-form'
import FormControl from '@material-ui/core/FormControl'
import RecipeFormStyles from 'components/styled/RecipeFormStyles'
import RecipeFormIngredient from 'components/recipes/RecipeFormIngredient'
// import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'

const styles = () => (RecipeFormStyles)

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 121,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}))

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

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
            // eslint-disable-next-line react/jsx-no-bind
            format={value => value === '' ? {} : value}
          />
          <Field
            name={`${member}.ingredient`}
            component={RecipeFormIngredient}
            props={{ ingredientOptions, placeholder: 'Ingredient' }}
            defaultValue={{}}
            // eslint-disable-next-line react/jsx-no-bind
            format={value => value === '' ? {} : value}
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
    ingredientModificationOptions,
    ingredientOptions,
  } = props
  const klasses = useStyles()
  // const theme = useTheme()
  const [personName, setPersonName] = React.useState([])

  const handleChange = (event) => {
    setPersonName(event.target.value)
  }

  // const handleChangeMultiple = (event) => {
  //   const { options } = event.target
  //   const value = []
  //   for (let i = 0, l = options.length; i < l; i += 1) {
  //     if (options[i].selected) {
  //       value.push(options[i].value)
  //     }
  //   }
  //   setPersonName(value)
  // }
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
      <FormControl className={klasses.formControl}>
        <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-mutiple-checkbox-label"
          id="demo-mutiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<Input />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <div>
        <label>Hobbies</label>
        <Field
          name="hobbies"
          component={Multiselect}
          defaultValue={[]}
          onBlur={() => props.onBlur()}
          data={[ 'Guitar', 'Cycling', 'Hiking' ]}/>
      </div> */}

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
