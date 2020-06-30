# frozen_string_literal: true

# Ensures a user has access to a given resource
class Permissions
  def initialize(user)
    @user = user

    raise StandardError, 'Not signed in' unless @user.present?
  end

  def can_edit?(record)
    return true if @user.admin?
    return false unless record.respond_to? :access

    record&.access&.user_id == @user.id
  end
end
