# frozen_string_literal: true

class Access < ApplicationRecord
  belongs_to :user
  belongs_to :accessible, polymorphic: true

  validates_uniqueness_of :user, scope: %i[accessible_id accessible_type]
  validates_presence_of :user, :accessible, :status

  # everytime a user creates a recipe or tag, an access record is created that
  # defaults to a private status, they can request an admin make it public
end
