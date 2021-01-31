# frozen_string_literal: true

module Graph
  # Singleton to index recipe ownership by user_id. user_id 0 are for public recipes.
  class TagIndex < Index
    private

      def generate_index
        index = tags_with_assoc
        objective_tag_selections.each do |ts|
          next unless index[ts.taggable_id]

          # TODO: index[ts.taggable_id] is returning nil
          index[ts.taggable_id].add_parent_tag_id(ts.tag_id)
          index[ts.tag_id].add_child_tag_id(ts.taggable_id)
        end
        index
      end

      def tags_with_assoc
        Tag.
          joins(:access, :tag_type).
          preload(:access, :tag_type).
          each_with_object({}) do |t, obj|
            obj[t.id] = TagNode.new(t)
          end
      end

      def objective_tag_selections
        TagSelection.
          joins(tag: [:access, :tag_type]).
          where("taggable_type = 'Tag'").
          where("tag_types.name NOT IN ('Comment', 'Priority', 'Rating')")
      end
  end
end
