# frozen_string_literal: true

module Api
  # Controller for recipes and recipes by tag
  class RecipesController < ApplicationController
    def index
      tag_id = params.permit(:tag_id)[:tag_id]
      recipes = recipes_by_tag(tag_id)
      if recipes
        render json: recipes
      else
        render json: { tag_id: tag_id.to_s }, status: :not_found
      end
    end

    def show
      recipe = Recipe.find_by_id(params.permit(:id)[:id])
      if recipe&.tags&.first
        # Fetch all the universal recipe tags like ingredients, but also user
        # tags like ratings.
        detail = RecipeDetail.call(recipe: recipe, current_user: current_user)
        grouped_detail = GroupRecipeDetail.call(recipe_details: detail.result)
        render json: grouped_detail.result.first.merge(recipe.as_json)
      else
        render json: {}, status: :not_found
      end
    end

    def create
      recipe = RecipeForm.call(
        action: :create,
        params: create_recipe_params,
        user: current_user
      )
      render json: recipe.result
    end

    def edit
      recipe = Recipe.find params.permit(:id)['id']
      if Permissions.new(current_user).can_edit?(recipe)
        render json: RecipeForm.call(action: :edit, params: { recipe: recipe }).result
      else
        render json: {}, status: :unauthorized
      end
    end

    def update
      recipe = Recipe.find update_recipe_params['id']
      if Permissions.new(current_user).can_edit?(recipe)
        render json: RecipeForm.call(
          action: :update,
          params: { recipe: recipe, form_fields: update_recipe_params },
          user: current_user
        ).result
      else
        render json: {}, status: :unauthorized
      end
    end

    private

      def update_recipe_params
        params.permit shared_columns << :id
      end

      def create_recipe_params
        params.permit shared_columns
      end

      def shared_columns
        [
          :recipe_name, :description, :instructions,
          ingredients: ingredient_fields,
          sources: %i[id name], vessels: %i[id name], recipe_types: %i[id name],
          menus: %i[id name], preparations: %i[id name], flavors: %i[id name],
          components: %i[id name]
        ]
      end

      def ingredient_fields
        [
          :ingredient_amount, :ingredient_prep,
          ingredient_modification: %i[label value],
          ingredient: %i[label value]
        ]
      end

      def recipes_by_tag(tag_id)
        tag = Tag.find_by_id(tag_id)
        if tag
          tagged_recipes(tag)
        elsif tag_id.nil?
          { tag: { name: 'All Recipes' }, recipes: all_recipe_json }
        end
      end

      def tagged_recipes(tag)
        recipes = RecipeByTag.call(tag: tag, current_user: current_user)
        {
          tag: tag,
          recipes: GroupRecipeDetail.call(recipe_details: recipes.result).result,
          filter_tags: filter_tags(recipes.result)
        }
      end

      def all_recipe_json
        # Used by drop down header to search all recipes a user has access to.
        recipe_json = Recipe.joins(:access).
                      where(
                        [
                          "accesses.user_id = ? OR accesses.status = 'PUBLIC'",
                          current_user&.id
                        ]
                      ).
                      sort_by(&:name).as_json(only: %i[id name])
        recipe_json.map { |r| { 'Label' => r['name'], 'Value' => r['id'] } }
      end

      def filter_tags(recipes)
        # Return tags associated with the recipe but also those tags' parents
        # to allow for less specific filtering, i.e. allowing a recipe containing
        # 'apples' to be returned when filtering by 'fruit'.
        result = recipes.each_with_object({}) do |r, tags|
          tags[r.tag_id] = r.tag_name
          tags[r.parent_tag_id] = r.parent_tag
          tags[r.grandparent_tag_id] = r.grandparent_tag
          tags[r.modification_id] = r.modification_name
        end
        result.reject { |k, v| k.blank? || v.blank? }.to_a
      end
  end
end
