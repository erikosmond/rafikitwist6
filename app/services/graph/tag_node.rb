# frozen_string_literal: true

module Graph
  # In memory model for tags in the graph.
  class TagNode
    attr_accessor %i[
      id name description recipe_id parent_tag_ids child_tag_ids recipe_ids
    ]

    def initialize(id)
      @id = id
      @parent_tag_ids = []
      @child_tag_ids = []
      @recipe_ids = []
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
