# frozen_string_literal: true

# accesses determine who can see which records, like recipes or tag_selections
class AccessService
  def self.create_access!(user_id, subject, status = 'PRIVATE')
    raise StandardError, 'Not signed in' unless user_id.positive?

    if subject.respond_to?(:access)
      AccessService.create_access(user_id, subject, status)
    else
      raise ArgumentError,
            "Cannot create Access record for class #{subject.class.name}"
    end
  end

  def self.create_access(user_id, subject, status)
    raise StandardError, 'Not signed in' unless user_id.positive?

    a = Access.find_or_create_by(
      user_id: user_id,
      accessible: subject
    )
    a.status = status
    a.save
    a.reload
  end
end
