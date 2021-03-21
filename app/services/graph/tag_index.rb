# frozen_string_literal: true

module Graph
  # Singleton to index recipe ownership by user_id. user_id 0 are for public recipes.
  class TagIndex < Index
    def add(tag)
      tag_node = TagNode.new(new_tag_query(tag.id).first)
      tag_node.parent_tag_ids.each do |pti|
        tag_node.add_parent_tag_id << pti
      end
      @hash[tag.id] = tag_node
    end

    def family_tags
      @hash.values.select { |tag| tag.tag_type.name == 'IngredientFamily' }
    end

    private

      def generate_index
        index = tags_with_assoc
        objective_tag_selections.each do |ts|
          next unless index[ts.taggable_id]

          index[ts.taggable_id].add_parent_tag_id(ts.tag_id)
          index[ts.tag_id].add_child_tag_id(ts.taggable_id)
        end
        index
      end

      def new_tag_query(tag_id)
        tags_with_assoc_query.left_joins(:parent_tags).preload(:parent_tags).
          where(["tags.id = ?", tag_id])
      end

      def tags_with_assoc
          tags_with_assoc_query.reduce({}) do |h, t|
            h.merge({ t.id => TagNode.new(t) })
          end
      end

      def tags_with_assoc_query
        Tag.
          joins(:access, :tag_type).
          preload(:access, :tag_type)
      end

      def objective_tag_selections
        TagSelection.
          joins(tag: [:access, :tag_type]).
          where("taggable_type = 'Tag'").
          where("tag_types.name NOT IN ('Comment', 'Priority', 'Rating')")
      end
  end
end
