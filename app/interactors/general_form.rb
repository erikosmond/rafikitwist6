# frozen_string_literal: true

# class for common form methods
class GeneralForm
  include Interactor

  protected

    def create_access(accessible)
      AccessService.create_access!(user_id, accessible, access_status)
    end

    def access_status
      user.admin? ? 'PUBLIC' : 'PRIVATE'
    end

    def user_id
      context.user.id
    end
end
