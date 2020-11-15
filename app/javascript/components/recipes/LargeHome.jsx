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
import RecipeListSkeleton from 'containers/RecipeListSkeletonContainer'
import NavMenus from 'containers/NavMenusContainer'

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

const LargeHome = () => (
  <Router>
    <HeaderWrapper>
      <NavMenus />
    </HeaderWrapper>
    <CommentModal />
    <TagFormModal />

    <StyledContent>
      <Switch>
        <Route
          path="/tags/:tagId/recipes"
          component={RecipeListSkeleton}
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
          component={RecipeSkeleton}
        />
        <Route
          path="/"
          component={RecipeListSkeleton}
        />
      </Switch>
    </StyledContent>
  </Router>
)

export default LargeHome
