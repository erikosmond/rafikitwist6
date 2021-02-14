# frozen_string_literal: true

# Group recipe's tags by type, i.e. ingredients, sources, vessels, etc.
# Also hash all ingredients for filtering.
class GroupRecipeDetail
  include Interactor

  # def call
  #   recipes = group_by_recipe_details(context.recipe_details.dup)
  #   collect_tags_by_recipe!(recipes)
  #   recipes = group_by_recipe_tag_type(recipes) # Ingredients, vs Menus, etc.
  #   recipes = merge_recipe_data(recipes)
  #   hash_ingredients_by_tag_selection_id!(recipes)
  #   context.result = recipes
  # end

  private

    # def group_by_recipe_details(recipe_details)
    #   recipe_details.to_a.group_by do |r|
    #     {
    #       'id' => r['recipe_id'],
    #       'name' => r['recipe_name'],
    #       'description' => r['recipe_description'],
    #       'instructions' => r['recipe_instructions']
    #     }
    #   end
    # end

    # def collect_tags_by_recipe!(recipes)
    #   recipes.each do |k, v|
    #     ids = v.each_with_object({}) do |r, tag_ids|
    #       tag_ids[r.tag_id] = true
    #       tag_ids[r.try(:parent_tag_id)] = true
    #       tag_ids[r.try(:grandparent_tag_id)] = true
    #       tag_ids[r.try(:modification_id)] = true
    #     end
    #     k['tag_ids'] = ids.select { |key, _v| key.present? }
    #   end
    # end

    # def group_by_recipe_tag_type(ungrouped_recipes)
    #   ungrouped_recipes.each_with_object({}) do |(k, v), recipes|
    #     recipes[k] = v.group_by { |g| g['tag_type'].to_s.underscore.pluralize }
    #   end
    # end

    # def merge_recipe_data(recipes)
    #   recipes.map { |k, v| k.merge(v) }
    # end

    # def hash_ingredients_by_tag_selection_id!(recipes)
    #   # mutates recipes object
    #   recipes.each do |r|
    #     r['ingredients'] = r['ingredients']&.each_with_object({}) do |i, hash|
    #       hash["#{i.tag_id}mod#{i.modification_id}"] = i
    #     end
    #   end
    # end
end
