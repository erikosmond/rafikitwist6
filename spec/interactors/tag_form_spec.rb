# frozen_string_literal: true

# ensure all fields (name, desc, tag_type_id) and parent tags (taggings for parent tag) access on the tag and accesses on the taggings

require 'rails_helper'
require_relative '../contexts/tag_type_context.rb'

RSpec.describe TagsByType, type: :interactor do
  describe '.call' do
    include_context 'tag_types'
    let(:user) { create(:user) }
    let(:params) do
      {
        'name' => 'Eggshells',
        'description' => 'Gross',
        'tag_type_id' => type_ingredient.id,
        'parent_tags' => [
          {
            'name' => mocktails.name,
            'id' => mocktails.id
          },
          {
            'name' => crushed_ice.name,
            'id' => crushed_ice.id
          }
        ]
      }
    end
    let(:t) { Tag.find_by_name 'Eggshells' }

    before do
      TagForm.call(user: user, params: params, action: :create)
    end
    it 'saves the tag name' do
      expect(t.name).to eq 'Eggshells'
    end
    it 'saves the tag description' do
      expect(t.description).to eq 'Gross'
    end
    it 'saves the tag type' do
      expect(t.tag_type).to eq type_ingredient
    end
    it 'saves the tag access' do
      expect(t.access.user).to eq user
    end
    it 'saves the recipe components' do
      expect(t.parent_tags.map(&:id) - [mocktails.id, crushed_ice.id]).to eq []
    end
    it 'saves the recipe components access' do
      expect(t.taggings.first.access.status).to eq 'PRIVATE'
    end
  end
end
