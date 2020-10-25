/* eslint-disable react/jsx-no-bind */

import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import styled from 'styled-components'

import CommentModal from 'containers/CommentModalContainer'
import MobileRecipeList from 'containers/MobileRecipeListContainer'
import TagFormModal from 'containers/TagFormContainer'
import RecipeSkeleton from 'containers/RecipeContainer'
import RecipeFormSkeleton from 'containers/RecipeFormContainer'

const StyledContent = styled.div`
  margin-top: 1px;
`
const SmallHome = () => (
  <Router>
    <CommentModal />
    <TagFormModal />

    <StyledContent>
      <Switch>
        <Route
          path="/tags/:tagId/recipes"
          component={MobileRecipeList}
        />
        <Route
          path="/recipes/new"
          component={RecipeFormSkeleton}
        />
        <Route
          path="/recipes/:recipeId/edit"
          render={() => <RecipeFormSkeleton edit />}
        />
        <Route
          path="/recipes/:recipeId"
          render={() => <RecipeSkeleton mobile />}
        />
        <Route
          path="/"
          component={MobileRecipeList}
        />
      </Switch>
    </StyledContent>
  </Router>
)

export default SmallHome
