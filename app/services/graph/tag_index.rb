# frozen_string_literal: true

module Graph
  # Singleton to index recipe ownership by user_id. user_id 0 are for public recipes.
  class TagIndex < Index
    @instance_mutex = Mutex.new

    private

      def generate_index
        index = Tag.all.each_with_object({}) do |t, obj|
          obj[t.id] = TagNode.new(t)
        end
        objective_tag_selections.each do |ts|
          index[ts.taggable_id].add_parent_tag_id(ts.tag_id)
          index[ts.tag_id].add_child_tag_id(ts.taggable_id)
        end
        index
      end

      def objective_tag_selections
        TagSelection.
          where("taggable_type = 'Tag").
          where("tag_types.name NOT IN ('Comment', 'Priority', 'Rating')")
      end
  end
end
