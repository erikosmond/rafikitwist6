# frozen_string_literal: true

module Graph
  # Parent class for resources in indexed graph. Child classes must have @access set.
  class Node
    delegate :status, :user_id, to: :@access
    attr_reader :access
    # TODO, i should probably send in the user object with the role preloaded so i can check if it's an admin
    def viewable?(user)
      status == 'PUBLIC' || user_id == user&.id || user.admin?
    end
  end
end
