# frozen_string_literal: true

module Graph
  # In memory model for tags in the graph.
  class TagNode
    delegate :id, :name, :recipe, to: :@tag
    attr_accessor :parent_tag_ids, :child_tag_ids, :recipe_ids, :modification_tag_ids

    def initialize(tag)
      @tag = tag
      @parent_tag_ids = []
      @child_tag_ids = []
      @recipe_ids = []
      @modification_tag_ids = []
    end

    def add_parent_tag_id(id)
      @parent_tag_ids << id
    end

    def add_child_tag_id(id)
      @child_tag_ids << id
    end

    def filter_tag_ids
      ([id] + parent_filter_tag_ids + recipe_filter_tag_ids).flatten.compact.uniq
    end

    private

      def parent_filter_tag_ids
        parent_tags.flat_map(&:filter_tag_ids)
      end

      def recipe_filter_tag_ids
        recipe_objective_tags.flat_map(&:filter_tag_ids)
      end

      def parent_tags
        @parent_tag_ids&.map { |t_id| TagIndex.fetch(t_id) } || []
      end

      def recipe_objective_tags
        recipe&.objective_tag_ids&.map { |t_id| TagIndex.fetch(t_id) } || []
      end
  end
end
