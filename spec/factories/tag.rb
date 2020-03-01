# frozen_string_literal: true

FactoryBot.define do
  factory :tag do
    tag_type
    name { 'Mint' }
  end
end
