# frozen_string_literal: true

# Ensures a user has access to a given resource
class Permissions
  def initialize(user)
    @user = user
  end

  def can_edit?(record)
    return true if user.is_admin?
    return false unless record.responds_to? :access

    record.access.user_id == @user.id
  end
end
