# frozen_string_literal: true

module Api
  # Controller for recipes and recipes by tag
  class RecipesController < ApplicationController
    include RecipesControllerHelper
    def index
      tag_id = params.permit(:tag_id)[:tag_id]
      recipes = TagInteractor.call(tag_id: tag_id, current_user: current_user)
      if recipes.result
        render json: recipes.result
      else
        render json: { tag_id: tag_id.to_s }, status: :not_found
      end
    end

    def show
      recipe = Graph::RecipeIndex.instance.fetch(params.permit(:id)[:id])
      Permissions.new(current_user).can_view!(recipe)
      render json: recipe_data_by_user(recipe, current_user)
    end

    def create
      recipe = RecipeForm.call(
        action: :create,
        params: params.permit(shared_columns),
        user: current_user
      )
      render json: recipe.result
    end

    def edit
      recipe = Graph::RecipeIndex.instance.fetch(params.permit(:id)[:id])
      Permissions.new(current_user).can_edit!(recipe)
      render json: RecipeForm.call(
        action: :edit, params: { recipe: recipe }, user: current_user
      ).result
    end

    def update
      recipe = Recipe.find_by_id(update_recipe_params['id'])
      Permissions.new(current_user).can_edit!(recipe)
      render json: RecipeForm.call(
        action: :update,
        params: { recipe: recipe, form_fields: update_recipe_params },
        user: current_user
      ).result
    end
  end
end
