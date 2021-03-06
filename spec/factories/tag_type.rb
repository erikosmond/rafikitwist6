# frozen_string_literal: true

FactoryBot.define do
  factory :tag_type do
    sequence :name do |n|
      "Rating: #{n}"
    end
  end
end
