# frozen_string_literal: true

# Ensures a user has access to a given resource and resource exists
class Permissions
  def initialize(user)
    @user = user

    raise Error401, 'Not signed in' unless @user.present?
  end

  def can_edit!(record)
    raise Error406 unless record.respond_to? :access
    raise Error403 unless @user.admin? || record&.access&.user_id == @user.id
    raise Error404, 'Record does not exist' unless record.present?
  end
end
