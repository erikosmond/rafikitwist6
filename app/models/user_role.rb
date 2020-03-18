# frozen_string_literal: true

# model for user_roles table
class UserRole < ApplicationRecord
  belongs_to :user
  belongs_to :role

  validates_uniqueness_of :user_id, scope: :role_id
end
