# frozen_string_literal: true

# Helper methods to define SQL queries used to associate tags to recipes.
module AssociatedRecipesService
  def recipes_with_parent_detail_joins
    [
      { tag: [:tag_type, parent_tags: [:tag_type, parent_tags: :tag_type]] },
      :access,
      :tag_attributes,
      :modifications,
      selected_recipe: :access
    ]
  end

  def recipes_with_detail_select
    recipes_select_tags +
      recipes_select_parent_tags +
      tag_details_select +
      recipes_select_recipes
  end

  def tag_details_select
    [
      'tag_types.name AS tag_type',
      'tag_attributes.value',
      'tag_attributes.property',
      'modifications_tag_selections.name AS modification_name',
      'modifications_tag_selections.id AS modification_id'
    ]
  end

  def recipes_select_recipes
    [
      'recipes.id AS recipe_id',
      'recipes.name AS recipe_name',
      'recipes.instructions AS recipe_instructions',
      'recipes.description AS recipe_description'
    ]
  end

  def recipes_select_tags
    [
      'tags.name AS tag_name',
      'tags.description AS tag_description',
      'tags.id AS tag_id',
      'tags.tag_type_id AS tag_type_id'
    ]
  end

  def recipes_select_parent_tags
    [
      'parent_tags_tags.name AS parent_tag',
      'parent_tags_tags.id AS parent_tag_id',
      'parent_tags_tags_2.name AS grandparent_tag',
      'parent_tags_tags_2.id AS grandparent_tag_id'
    ]
  end
end
