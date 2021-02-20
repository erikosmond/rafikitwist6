# frozen_string_literal: true

# Ensures a user has access to a given resource and the resource exists
class Permissions
  def initialize(user)
    @user = user
  end

  def can_create!
    raise Error401, 'Not signed in' unless @user.present?
  end

  def can_edit!(record)
    verify!(record)
    raise Error401, 'Not signed in' unless @user.present?
    raise Error403 unless can_edit?(record)
  end

  def can_view!(record)
    verify!(record)
    raise Error403 unless can_view?(record)
  end

  private

    def can_view?(record)
      @user&.admin? ||
        record.access.user_id == @user&.id ||
        record.access.status == 'PUBLIC'
    end

    def can_edit?(record)
      @user.admin? || record.access.user_id == @user.id
    end

    def verify!(record)
      raise Error404 unless record.present?
      raise Error406 unless record.respond_to? :access
    end
end
