# frozen_string_literal: true

module Graph
  # Singleton to index recipe ownership by user_id. user_id 0 are for public recipes.

  # TODO: almost definitely remove this, I don't think I'm using it
  class UserAccessTagIndex < Index
    private

      def generate_index
        # TODO: delete this class after test has been confirmed - and delete the test
        tags = Tag.joins(:access).preload(:access)
        tags.each_with_object(Hash.new { |hsh, key| hsh[key] = [] }) do |t, obj|
          if t.access.status == 'PUBLIC'
            obj[0] << t.id
          else
            obj[t.access.user_id] << t.id
          end
        end
      end
  end
end
