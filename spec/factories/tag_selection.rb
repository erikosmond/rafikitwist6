# frozen_string_literal: true

FactoryBot.define do
  factory :tag_selection do
    tag
    association :taggable, factory: :recipe
  end
end
