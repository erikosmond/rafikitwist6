# frozen_string_literal: true

module Graph
  # Singleton to index recipe ownership by user_id. user_id 0 are for public recipes.
  class UserAccessTagIndex < UserAccessIndex
    @instance_mutex = Mutex.new
  end
end
