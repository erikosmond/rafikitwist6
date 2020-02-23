# frozen_string_literal: true

FactoryBot.define do
  factory :role do
    sequence :name do |n|
      "Role #{n}"
    end
  end
end
