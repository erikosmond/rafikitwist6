/* eslint-disable react/jsx-no-bind */

import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import styled from 'styled-components'

import CommentModal from 'containers/CommentModalContainer'
import TagFormModal from 'containers/TagFormContainer'
import RecipeSkeleton from 'containers/RecipeContainer'
import RecipeFormSkeleton from 'containers/RecipeFormContainer'
import RecipeList from 'containers/RecipeListContainer'
import RecipeHeader from 'containers/RecipeHeaderContainer'

const StyledContent = styled.div`
  margin-top: 70px;
`

const HeaderWrapper = styled.div`
    width: 100%;
    position: fixed;
    top: 0px;
    background-color: white;
    z-index: 1;
`

// TODO: what props are being passed into RecipeFormSkeleton. Try removing it.
const LargeHome = () => (
  <Router>
    <HeaderWrapper>
      <RecipeHeader />
    </HeaderWrapper>
    <CommentModal />
    <TagFormModal />

    <StyledContent>
      <Switch>
        <Route
          path="/tags/:tagId/recipes"
          component={RecipeList}
        />
        <Route
          path="/recipes/new"
          component={RecipeFormSkeleton}
        />
        <Route
          path="/recipes/:recipeId/edit"
          render={(props) => <RecipeFormSkeleton {...props} edit />}
        />
        <Route
          path="/recipes/:recipeId"
          component={RecipeSkeleton}
        />
        <Route
          path="/"
          component={RecipeList}
        />
      </Switch>
    </StyledContent>
  </Router>
)

export default LargeHome
