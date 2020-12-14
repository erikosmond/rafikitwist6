# frozen_string_literal: true

# Fetch recipes belonging to a tag and that tag's children
class RecipeByTag
  include AssociatedRecipesService
  include Interactor

  def call
    recipes = case context.tag.tag_type_id
              when TagType.type_id
                child_recipes_with_detail.to_a
              when TagType.family_id
                grandchild_recipes_with_detail.to_a +
                child_recipes_with_detail.to_a
              when TagType.modification_id
                modification_recipes_detail.to_a
              end || []
    set_result(recipes, recipes_with_detail.to_a)
  end

  private

    def set_result(recipes, recipes_with_detail)
      context.result = recipes + recipes_with_detail
      context.filter_tags = filter_tags(context.result)
    end

    def child_recipes_with_detail
      tag_selections = context.tag.child_recipe_tag_selections
      join_alias = 'child_tag_selections_child_recipe_tag_selections'
      detail_sql(tag_selections, join_alias)
    end

    def grandchild_recipes_with_detail
      tag_selections = context.tag.grandchild_recipe_tag_selections
      join_alias = 'grandchild_tag_selections_grandchild_recipe_tag_selections'
      detail_sql(tag_selections, join_alias)
    end

    def modification_recipes_detail
      tag_selections = context.tag.modified_recipe_tag_selections
      join_alias = 'tag_selections_modified_recipe_tag_selections_2'
      detail_sql(tag_selections, join_alias)
    end

    def detail_sql(selected_tags, tag_selection_table_name)
      selected_tags.
        select(recipes_with_detail_select + [
          "#{tag_selection_table_name}.id",
          "#{tag_selection_table_name}.body"
        ]).
        left_outer_joins(recipes_with_parent_detail_joins).
        where(
          "accesses.user_id =
          #{context.current_user&.id.to_i} OR accesses.status = 'PUBLIC'"
        )
    end

    def recipes_with_detail
      ts = TagSelection.
           select(recipes_with_detail_select + [
             'tag_selections_recipes.id',
             'tag_selections_recipes.body'
           ]).
           left_outer_joins(recipe_detail_joins)
      add_predicates(ts)
    end

    def add_predicates(tag_selections)
      ts = tag_selections.
           where("tag_selections.tag_id = #{context.tag.id}").
           where("tag_selections.taggable_type = 'Recipe'").
           where("tag_selections_recipes.taggable_type = 'Recipe'").
           where('tag_selections.id IS NOT NULL').
           where('recipes.id IS NOT NULL').
           where('tag_selections_recipes.id IS NOT NULL')
      add_access_predicates(ts)
    end

    def add_access_predicates(tag_selections)
      tag_selections.where('accesses_selected_recipes.id IS NOT NULL').
        where('accesses.id IS NOT NULL').
        where('accesses_tag_selections.id IS NOT NULL').
        where("accesses_selected_recipes.user_id = #{context.current_user&.id.to_i} OR
               accesses_selected_recipes.status = 'PUBLIC'").
        where(
          "accesses.user_id =
          #{context.current_user&.id.to_i} OR accesses.status = 'PUBLIC'"
        ).
        where("accesses_tag_selections.user_id =  #{context.current_user&.id.to_i} OR
          accesses_tag_selections.status = 'PUBLIC'")
    end

    def recipe_detail_joins
      [
        :access,
        { recipe: {
          tag_selections: recipes_with_parent_detail_joins
        } }
      ]
    end

    def filter_tags(recipes)
      # TODO: add ingredients from tag.recipe_id recipes
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
