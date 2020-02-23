# frozen_string_literal: true

FactoryBot.define do
  factory :tag_attribute do
    association :tag_attributable, factory: :tag_selection
    property { 'Amount' }
    value { '1 ounce' }
  end
end
