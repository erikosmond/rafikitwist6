# frozen_string_literal: true

# Handle nitty gritty detail for recipe controller
module RecipeControllerHelper
  def update_recipe_params
    params.permit shared_columns << :id
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
      filter_tags: recipes.filter_tags
    }
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
