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

    def grandchild_tags_by_user(user)
      # find the interesection of grandchild tags and tags the user has
      child_tags_by_user(user).flat_map do |tag|
        tag.child_tags_by_user(user)
      end.uniq.compact
    end

    def sister_tags_by_user(user)
      parent_child_tags = @parent_tag_ids.flat_map do |p_id|
        TagIndex.instance.fetch(p_id).child_tags_by_user(user)
      end.uniq.compact
      parent_child_tags.reject { |tag| tag.id == id }
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
      subjective_data = subjective_tags(viewable_recipes.map(&:id), user)
      enriched_recipes = subjective_enrichment(viewable_recipes, subjective_data)
      enriched_recipes.map(&:api_response)
    end

    private

      def user_with_role(user_id)
        User.left_joins(:roles).preload(:roles).find_by_id(user_id)
      end

      def subjective_tags(recipe_ids, user)
        return [] unless user

        # TODO: improve: call out to async class that queries subjective tags
        ::TagSelection.
          select('tag_selections.id, tags.id AS tag_id, tag_selections.body,
                         tag_selections.taggable_id, tag_types.name').
          joins([:access, { tag: :tag_type }]).
          where("accesses.user_id = #{user.id}").
          where("tag_selections.taggable_type = 'Recipe'").
          where("accesses.accessible_type = 'TagSelection'").
          where("tag_selections.taggable_id IN (#{recipe_ids.join(', ')})")
        # maybe not necissary to filter by tag types, cuz what else would return?
        # where("tag_types.name IN ('#{::Tag::SUBJECTIVE_TAG_TYPES.join("', '")}')")
      end

      def subjective_enrichment(recipes, subjective_data)
        cloned_recipes = recipes.map(&:clone)
        recipe_id_hash = cloned_recipes.group_by(&:id)
        subjective_data.each do |sd|
          recipe_list = recipe_id_hash[sd.taggable_id]
          subjective_assignment(recipe_list&.first, sd)
        end
        cloned_recipes
      end

      def subjective_assignment(recipe, row)
        return unless recipe

        hash = subjective_hash(row)

        case row.name
        when 'Comment'
          recipe.append_comment_tag_hash_array(hash)
        when 'Priority'
          recipe.append_priority_tag_hash_array(hash)
        when 'Rating'
          recipe.append_rating_tag_hash_array(hash)
        end
      end

      def subjective_hash(data)
        {
          id: data.id,
          tag_id: data.tag_id,
          body: data.body
        }
      end

      def mods_hash(user)
        # user_recipes(user).map(&modifications)
        {
          modification_tags:
            with_tag_names(
              UserAccessModificationTagIndex.instance.fetch_mods_by_user_id(id, user.id)
            ),
          modified_tags:
            with_tag_names(
              UserAccessModifiedTagIndex.instance.fetch_mods_by_user_id(id, user.id)
            )
        }
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
        tag_ids.reduce({}) do |h, id|
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
