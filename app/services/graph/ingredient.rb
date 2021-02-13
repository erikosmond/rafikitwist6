# frozen_string_literal: true

module Graph
  # Ingredients as part of a recipe.
  class Ingredient
    delegate :body, to: :@tag_selection
    delegate :id, :name, :tag_type_id, :description, to: :@tag

    def initialize(tag_selection, access, objective_tag_ids)
      @tag_selection = tag_selection
      @tag = tag_selection.tag
      @access = access
      @objective_tag_ids = objective_tag_ids
      index_modifications
    end

    def amount
      @tag_selection.tag_attributes.find { |ta| ta.property == 'amount' }&.value
    end

    def modification_id
      modification&.id
    end

    def modification_name
      modification&.name
    end

    def api_response
      { "#{id}mod#{modification_id}" => attrs.merge(tag_data) }
    end

    private

      def attrs
        {
          body: body,
          # id: @tag_selection.taggable_id,
          id: @tag_selection.id,
          modification_id: modification_id,
          modification_name: modification_name,
          property: 'amount',
          tag_name: name,
          value: amount
        }
      end

      def tag_data
        {
          tag_description: description,
          tag_id: id,
          tag_name: name,
          tag_type_id: tag_type_id,
          tag_type: @tag.tag_type.name
        }
      end

      def index_modifications
        return unless modification

        @objective_tag_ids << modification.id
        UserAccessModifiedTagIndex.instance.
          add_modifier_tag(@tag.id, modification_id, @access)
        UserAccessModificationTagIndex.instance.
          add_modification_tag(@tag.id, modification_id, @access)
      end

      def modification
        # UI does not currently support multiple modification selections per ingredient
        @tag_selection.modification_selections.first&.tag
      end
  end
end
