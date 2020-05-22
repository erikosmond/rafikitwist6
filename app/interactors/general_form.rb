# frozen_string_literal: true

# class for common form methods
class GeneralForm
  include Interactor

  protected

    def create_access(accessible, status = nil)
      status ||= access_status
      AccessService.create_access!(user.id, accessible, status)
    end

    def access_status
      user.admin? ? 'PUBLIC' : 'PRIVATE'
    end

    def user
      context.user
    end
end
