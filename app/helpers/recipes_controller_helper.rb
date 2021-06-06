# frozen_string_literal: true

# Handle nitty gritty detail for recipe controller
module RecipesControllerHelper
  def update_recipe_params
    params.permit shared_columns << :id
  end

  def recipe_data_by_user(recipe, user)
    subjective_data = Graph::Node.subjective_tags([recipe.id], user)
    subjective_recipe = Graph::Node.subjective_enrichment([recipe], subjective_data).first
    subjective_recipe.api_response
  end

  def shared_columns
    [
      :recipe_name, :description, :instructions, :is_ingredient,
      { ingredients: ingredient_fields,
        sources: %i[id name], vessels: %i[id name], recipe_types: %i[id name],
        menus: %i[id name], preparations: %i[id name], flavors: %i[id name],
        components: %i[id name], parent_tags: %i[id name] }
    ]
  end

  def ingredient_fields
    [
      :ingredient_amount, :ingredient_prep,
      { ingredient_modification: %i[label value],
        ingredient: %i[label value] }
    ]
  end

  def all_recipe_json
    # Used by drop down header to search all recipes a user has access to.
    recipe_json = Recipe.joins(:access).
                  where(
                    [
                      "accesses.user_id = ? OR accesses.status = 'PUBLIC'",
                      current_user&.id.to_i
                    ]
                  ).
                  sort_by(&:name).as_json(only: %i[id name])
    recipe_json.map { |r| { 'Label' => r['name'], 'Value' => r['id'] } }
  end
end
