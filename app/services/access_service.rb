# frozen_string_literal: true

class AccessService
  def self.create_access!(user_id, subject, status = 'PRIVATE')
    if subject.respond_to?(:access)
      a = Access.find_or_create_by(
        user_id: user_id,
        accessible: subject
      )
      a.status = status
      a.save
      a.reload
    else
      raise ArgumentError,
            "Cannot create Access record for class #{subject.class.name}"
    end
  end
end
