# frozen_string_literal: true

module Graph
  # In memory model for recipes in the graph.
  class RecipeNode
    delegate :id, :name, :instructions, :description, to: :@recipe
    attr_reader :objective_tag_ids, :ingredients, :tag_ids_by_type

    def initialize(recipe)
      @recipe = recipe
      @objective_tag_ids = []
      @ingredients = []
      @tags_ids_by_type = Hash.new { |hsh, key| hsh[key] = [] }
      organize_associations
    end

    # tag_selections: [:modification_selections, { tag: :tag_type }])
    def organize_associations
      @recipe.tag_selections.each do |ts|
        @objective_tag_ids << ts.tag_id
        if ::TagType::INGREDIENT_TYPES.include? ts.tag.tag_type.name
          ingredients << Ingredient.new(ts)
        else
          @tags_by_type[ts.tag.tag_type.name.underscore.pluralize] << ts.tag_id
        end
      end
    end

    def filter_tags
      # TODO: have the TagNode return self in filter tags?
      objective_tags.flat_map(&:filter_tags)
    end

    def objective_tags
      # All tags that are not rating, priority, or comments
      objective_tag_ids.map { |t_id| TagIndex.fetch(t_id) }
    end
  end
end
