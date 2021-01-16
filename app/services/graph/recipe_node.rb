# frozen_string_literal: true

module Graph
  # In memory model for recipes in the graph.
  class RecipeNode < Node
    delegate :id, :name, :instructions, :description, to: :@recipe
    attr_reader :objective_tag_ids, :ingredients, :tag_ids_by_type
    attr_writer :priorities, :ratings, :comments

    def initialize(recipe)
      @recipe = recipe
      @access = recipe.access
      @objective_tag_ids = []
      @ingredients = []
      @tag_ids_by_type = Hash.new { |hsh, key| hsh[key] = [] }
      organize_associations
    end

    # tag_selections: [:modification_selections, { tag: :tag_type }])
    def organize_associations
      @recipe.tag_selections.each do |ts|
        @objective_tag_ids << ts.tag_id.to_i
        if ::TagType::INGREDIENT_TYPES.include? ts.tag.tag_type.name
          @ingredients << Ingredient.new(ts, @access)
        else
          @tag_ids_by_type[ts.tag.tag_type.name.underscore.pluralize] << ts.tag_id
        end
      end
    end

    def filter_tag_ids
      objective_tags.flat_map(&:filter_tag_ids).uniq
    end

    def filter_tag_hash
      @filter_tag_hash ||= filter_tag_ids.reduce({}) { |h, id| h.merge({ id => true }) }
    end

    def contains_tag_id?(id)
      @filter_tag_hash[id.to_i]
    end

    def objective_tags
      # All tags that are not rating, priority, or comments
      objective_tag_ids.map { |t_id| TagIndex.instance.fetch(t_id) }
    end

    def api_response
      @tag_ids_by_type.merge(
        {
          ingredients: @ingredients,
          priorities: @priority_tag_ids,
          ratings: @rating_tag_ids,
          comments: @comment_bodies
        }
      )
    end
  end
end
