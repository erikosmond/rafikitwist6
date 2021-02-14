# frozen_string_literal: true

module Graph
  # In memory model for tags in the graph.
  class TagNode < Node
    delegate :id, :name, :description, :present?, :tag_type_id, :recipe_id, to: :@tag
    attr_accessor :parent_tag_ids, :child_tag_ids, :recipe_ids, :modification_tag_ids
    attr_reader :tag_type

    def initialize(tag)
      @tag = tag
      @access = tag.access
      @tag_type = tag.tag_type
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

    def grandchild_tags_by_user(user)
      # find the interesection of grandchild tags and tags the user has
      child_tags_by_user(user).flat_map do |tag|
        tag.child_tags_by_user(user)
      end.uniq.compact
    end

    def sister_tags_by_user(user)
      if TagType::INGREDIENT_TYPES.include? @tag_type.name
        parent_child_tags = @parent_tag_ids.flat_map do |p_id|
          TagIndex.instance.fetch(p_id).child_tags_by_user(user)
        end.uniq.compact
        parent_child_tags.reject { |tag| tag.id == id }
      else
        group_tags_by_user(user)
      end
    end

    def child_tags_by_user(user)
      @child_tag_ids.
        map { |i| TagIndex.instance.fetch(i) }.
        select { |tag| tag.viewable?(user) }.
        compact.uniq
    end

    def recipe
      RecipeIndex.instance.fetch(@tag.recipe_id)
    end

    def recipes
      RecipeIndex.instance.hash.values.select { |r| r.contains_tag_id?(id) }
    end

    def user_recipes(user)
      recipes.select { |r| r.viewable?(user) }
    end

    def api_response(user_id)
      # recipe_dropdown = ->(t) { { id: t.id, name: t.name } }
      user = user_with_role(user_id)
      mods_hash(user).merge(attrs_hash).merge(family_hash(user))
    end

    def api_response_recipes(user_id)
      user = user_with_role(user_id)
      viewable_recipes = user_recipes(user)
      subjective_data = Node.subjective_tags(viewable_recipes.map(&:id), user)
      Node.subjective_enrichment(viewable_recipes, subjective_data)
    end

    def mods_hash(user)
      children = child_tag_ids.map { |cid| TagIndex.instance.fetch(cid).mods_hash(user) }
      child_values = merge_hash_values(children)
      {
        modification_tags:
          with_tag_names(
            UserAccessModificationTagIndex.instance.fetch_mods_by_user_id(id, user&.id) + child_values[:modification_tags]
          ),
        modified_tags:
          with_tag_names(
            UserAccessModifiedTagIndex.instance.fetch_mods_by_user_id(id, user&.id) + child_values[:modified_tags]
          )
      }
    end

    private

      def group_tags_by_user(user)
        TagSelection.select('tags.id').distinct.
          joins(:access, tag: :tag_type).
          where(['tag_types.name = ?', @tag_type.name]).
          where("(accesses.user_id = #{user&.id.to_i} OR accesses.status = 'PUBLIC')").
          map { |tag| TagIndex.instance.fetch(tag.id) }.
          reject { |like_tag| like_tag.id == id }
      end

      def merge_hash_values(hash_array)
        # TODO: refactor
        modification_tags = []
        modified_tags = []
        hash_array.each do |h|
          modification_tags << h[:modification_tags] unless h[:modification_tags] == {}
          modified_tags << h[:modified_tags] unless h[:modified_tags] == {}
        end
        {
          modification_tags: modification_tags.flat_map(&:keys),
          modified_tags: modified_tags.flat_map(&:keys)
        }
      end

      def user_with_role(user_id)
        User.left_joins(:roles).preload(:roles).find_by_id(user_id)
      end

      def attrs_hash
        {
          description: description,
          id: id,
          name: name,
          recipe_id: recipe_id,
          tag_type_id: tag_type_id,
          tags: with_tag_names([id])
        }
      end

      def family_hash(user)
        {
          child_tags: name_by_id(child_tags_by_user(user)),
          grandchild_tags: name_by_id(grandchild_tags_by_user(user)),
          grandparent_tags: with_tag_names(grandparent_ids),
          parent_tags: with_tag_names(@parent_tag_ids),
          sister_tags: name_by_id(sister_tags_by_user(user))
        }
      end

      def with_tag_names(tag_ids)
        tag_ids.compact.reduce({}) do |h, id|
          h.merge({ id => TagIndex.instance.fetch(id).name })
        end
      end

      def name_by_id(tags)
        tags.reduce({}) { |h, t| h.merge({ t.id => t.name }) }
      end

      def parent_filter_tag_ids
        parent_tags.flat_map(&:filter_tag_ids)
      end

      def recipe_filter_tag_ids
        recipe_objective_tags.compact.flat_map(&:filter_tag_ids)
      end

      def parent_tags
        @parent_tag_ids&.map { |t_id| TagIndex.instance.fetch(t_id) } || []
      end

      def recipe_objective_tags
        recipe&.objective_tag_ids&.map { |t_id| TagIndex.instance.fetch(t_id) } || []
      end
  end
end
