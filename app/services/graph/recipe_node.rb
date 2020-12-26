# frozen_string_literal: true

module Graph
  # In memory model for recipes in the graph.
  class RecipeNode
    attr_accessor %i[id name instructions description objective_tag_ids]
    def initialize(id)
      @id = id
      @objective_tag_ids = []
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
