# frozen_string_literal: true

# model for users table
class User < ApplicationRecord
  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles
  has_many :accesses, dependent: :destroy
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # attr_accessor :sign_up_code
  # validates :sign_up_code,
  #           on: :create,
  #           presence: true,
  #           inclusion: {
  #             in: ENV['SIGNUP_CODES'].to_s.split(','),
  #             message: 'Invalid signup code'
  #           }
end
