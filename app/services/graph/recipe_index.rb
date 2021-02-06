# frozen_string_literal: true

module Graph
  # Singleton to index recipe ownership by user_id. user_id 0 are for public recipes.
  class RecipeIndex < Index
    def add(recipe)
      @hash[recipe.id] = RecipeNode.new(recipe)
    end

    private

      def generate_index
        recipes_with_objective_tags.each_with_object({}) do |r, obj|
          obj[r.id] = RecipeNode.new(r)
        end
      end

      def recipes_with_objective_tags
        Recipe.left_joins(:access, tag_selections:
          [:tag_attributes, { tag: :tag_type, modification_selections: :tag }]).
          preload(:access, tag_selections:
          [:tag_attributes, { tag: :tag_type, modification_selections: :tag }]).
          where("tag_types.name NOT IN ('Comment', 'Priority', 'Rating')")
      end
  end
end
