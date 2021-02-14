# frozen_string_literal: true

# class for common form methods
class GeneralForm
  include Interactor

  protected

    def create_access(accessible, status = nil)
      # TODO: find out when subjective tags are saved and getting public statuses
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
