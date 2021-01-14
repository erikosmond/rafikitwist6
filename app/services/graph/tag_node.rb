# frozen_string_literal: true

module Graph
  # In memory model for tags in the graph.
  class TagNode < Node
    delegate :id, :name, :description, :present?, :tag_type_id, :recipe_id, to: :@tag
    attr_accessor :parent_tag_ids, :child_tag_ids, :recipe_ids, :modification_tag_ids

    def initialize(tag)
      @tag = tag
      @access = tag.access
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

    def grandparent_ids
      @parent_tag_ids.flat_map do |p_id|
        TagIndex.instance.fetch(p_id).parent_tag_ids
      end.uniq.compact
    end

    def grandchild_ids_by_user_id(u_id)
      @child_tag_ids.flat_map do |c_id|
        TagIndex.instance.fetch(c_id).child_tag_ids_by_user_id(u_id)
      end.uniq.compact
    end

    def sister_ids(u_id)
      @parent_tag_ids.flat_map do |p_id|
        TagIndex.instance.fetch(p_id).child_tag_ids_by_user_id(u_id)
      end.uniq.compact - [id]
    end

    def child_tag_ids_by_user_id(u_id)
      @child_tag_ids.map { |i| TagIndex.instance.fetch_by_user_id(i, u_id) }.compact.uniq
    end

    def recipe
      RecipeIndex.instance.fetch(@tag.recipe_id)
    end

    def full_response(user_id)
      {
        child_tags: with_tag_names(child_tag_ids_by_user_id(user_id)),
        description: description,
        grandchild_tags: with_tag_names(grandchild_ids_by_user_id(user_id)),
        grandparent_tags: with_tag_names(grandparent_ids),
        id: id,
        modification_tags:
          with_tag_names(
            UserAccessModificationTagIndex.instance.fetch_mods_by_user_id(id, user_id)
          ),
        modified_tags:
          with_tag_names(
            UserAccessModifiedTagIndex.instance.fetch_mods_by_user_id(id, user_id)
          ),
        name: name,
        parent_tags: with_tag_names(@parent_tag_ids),
        recipe_id: recipe_id,
        sister_tags: with_tag_names(sister_ids(user_id)),
        tag_type_id: tag_type_id,
        tags: with_tag_names(id)
      }
    end

    private

      def with_tag_names(tag_ids)
        tag_ids.reduce({}) do |h, id|
          h.merge({ id => TagIndex.instance.fetch(id).name })
        end
      end

      def parent_filter_tag_ids
        parent_tags.flat_map(&:filter_tag_ids)
      end

      def recipe_filter_tag_ids
        recipe_objective_tags.flat_map(&:filter_tag_ids)
      end

      def parent_tags
        @parent_tag_ids&.map { |t_id| TagIndex.instance.fetch(t_id) } || []
      end

      def recipe_objective_tags
        recipe&.objective_tag_ids&.map { |t_id| TagIndex.instance.fetch(t_id) } || []
      end
  end
end
