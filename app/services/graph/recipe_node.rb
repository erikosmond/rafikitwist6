# frozen_string_literal: true

module Graph
  # In memory model for recipes in the graph.
  class RecipeNode < Node
    include ::RecipeTagsService
    delegate :id, :name, :instructions, :description, :tags, to: :@recipe
    attr_reader :objective_tag_ids, :ingredients, :tag_ids_by_type, :access,
                :tag_selections

    def initialize(recipe)
      @recipe = recipe
      @access = recipe.access
      @objective_tag_ids = Set.new
      @ingredients = []
      @comment_tag_hash_array = []
      @priority_tag_hash_array = []
      @rating_tag_hash_array = []
      @tag_ids_by_type = Hash.new { |hsh, key| hsh[key] = [] }
      organize_associations
    end

    # tag_selections: [:modification_selections, { tag: :tag_type }])
    def organize_associations
      @recipe.tag_selections.each do |ts|
        append_objective_tags(ts)
        if ::TagType::INGREDIENT_TYPES.include? ts.tag.tag_type.name
          @ingredients << Ingredient.new(ts, @access, @objective_tag_ids)
        else
          tag_id_by_type(ts)
        end
      end
    end

    def filter_tag_ids
      objective_tags.compact.flat_map(&:filter_tag_ids).uniq + subjective_tag_ids
    end

    def filter_tag_hash
      @filter_tag_hash ||= filter_tag_ids.compact.reduce({}) do |h, id|
        h.merge({ id => true })
      end
    end

    def contains_tag_id?(id)
      filter_tag_hash[id.to_i]
    end

    def objective_tags
      # All tags that are not rating, priority, or comments
      objective_tag_ids.map { |t_id| TagIndex.instance.fetch(t_id) }
    end

    def append_comment_tag_hash_array(hash)
      @comment_tag_hash_array << hash
    end

    def append_priority_tag_hash_array(hash)
      @priority_tag_hash_array << hash
    end

    def append_rating_tag_hash_array(hash)
      @rating_tag_hash_array << hash
    end

    def api_response
      attrs.merge(@tag_ids_by_type).merge(
        {
          ingredients: @ingredients.reduce({}) { |h, i| h.merge(i.api_response) },
          priorities: @priority_tag_hash_array,
          ratings: @rating_tag_hash_array.select { |h| h[:tag_name].include? 'star' },
          comments: @comment_tag_hash_array
        }
      )
    end

    def subjective_api_response(user)
      subjective_data = Graph::Node.subjective_tags([id], user)
      subjective_recipe = Graph::Node.subjective_enrichment([self], subjective_data).first
      subjective_recipe.api_response
    end

    def copy
      RecipeNode.new(@recipe)
    end

    private

      def subjective_tag_hash_array
        @rating_tag_hash_array + @priority_tag_hash_array + @comment_tag_hash_array
      end

      def subjective_tag_ids
        subjective_tag_hash_array.map { |h| h[:tag_id] }.compact.uniq
      end

      def append_objective_tags(tag_selection)
        return if subjective_tag?(tag_selection)

        @objective_tag_ids << tag_selection.tag_id.to_i if tag_selection.tag_id
      end

      def tag_id_by_type(tag_selection)
        return if subjective_tag?(tag_selection)

        @tag_ids_by_type[
          tag_selection.tag.tag_type.name.underscore.pluralize
        ] << { tag_id: tag_selection.tag_id, tag_name: tag_selection.tag.name }
      end

      def subjective_tag?(tag_selection)
        ::TagsService::SUBJECTIVE_TAG_TYPES.include? tag_selection.tag.tag_type.name
      end

      def attrs
        {
          id: id,
          name: name,
          instructions: instructions,
          description: description,
          tag_ids: filter_tag_hash
        }
      end
  end
end
