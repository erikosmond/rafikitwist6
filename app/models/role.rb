# frozen_string_literal: true

# model for roles table
class Role < ApplicationRecord
  has_many :user_roles, dependent: :destroy
  has_many :users, through: :user_roles

  validates :name, presence: true, uniqueness: true

  ROLES = 'Roles'
  ADMIN = 'Admin'

  def self.admin_id
    Rails.cache.fetch("#{ROLES}/admin_id", expires_in: 1.year) do
      Role.find_by_name(ADMIN).id.to_i
    end
  end
end
