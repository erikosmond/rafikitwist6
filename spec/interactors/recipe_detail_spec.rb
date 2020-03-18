# frozen_string_literal: true

require 'rails_helper'
require_relative '../contexts/recipe_context.rb'

# rubocop: disable Metrics/BlockLength
RSpec.describe RecipeDetail, type: :interactor do
  describe '.call' do
    include_context 'recipes'
    let(:tag_subject) do
      create(:tag, name: 'Marinara', tag_type: tag_type_ingredient_type)
    end

    let(:result) do
      RecipeDetail.call(
        recipe: soup,
        current_user: user
      ).result
    end

    before do
      access3a.update_attribute(:status, 'PRIVATE')
      access3b.update_attribute(:status, 'PRIVATE')
    end

    after do
      access3a.update_attribute(:status, 'PUBLIC')
      access3b.update_attribute(:status, 'PUBLIC')
    end

    it "returns correct number of recipe's details" do
      expect(result.size).to eq 3
    end
    it 'returns correct first tag name' do
      expect(result.first.tag_name).to eq 'Marinara'
    end
    it 'returns correct second tag name' do
      expect(result.second.tag_name).to eq 'salt'
    end
    it 'returns correct third tag name' do
      expect(result.third.tag_name).to eq 'pepper'
    end
    it 'returns correct second tag modification' do
      expect(result.second.modifications.first.name).to eq 'chili infused'
    end
    it 'returns correct second tag attribute value' do
      expect(result.second.value).to eq '1 ounce'
    end
    it 'returns correct second tag attribute property' do
      expect(result.second.property).to eq 'Amount'
    end
  end
end
# rubocop: enable Metrics/BlockLength
