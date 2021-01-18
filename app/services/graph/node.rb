# frozen_string_literal: true

module Graph
  # Parent class for resources in indexed graph. Child classes must have @access set.
  class Node
    delegate :status, :user_id, to: :@access
    attr_reader :access
    def viewable?(user)
      status == 'PUBLIC' || user_id == user&.id || user&.admin?
    end
  end
end
