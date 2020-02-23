# frozen_string_literal: true

FactoryBot.define do
  factory :recipe do
    name { 'Lasagna' }
    instructions { 'Layer everything together' }
  end
end
