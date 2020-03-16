# frozen_string_literal: true

require 'rails_helper'

# rubocop: disable Metrics/BlockLength
describe Recipe, type: :model do
  subject { create :recipe }

  describe 'Verify valid records' do
    it 'has a valid factory' do
      expect(subject).to be_valid
    end
  end

  describe 'Verify validations are working' do
    let(:recipe) { build :recipe, name: nil, instructions: nil }
    let(:errors) do
      {
        name: ["can't be blank"], instructions: ["can't be blank"]
      }
    end
    it 'validates presense of name and instructions' do
      recipe.valid?
      expect(recipe.errors.messages).to eq(errors)
    end
  end

  describe '#tags' do
    let(:tag) { create :tag, name: 'Salt' }
    let!(:tag_selection) { create :tag_selection, tag: tag, taggable: subject }
    it 'has correct tag' do
      expect(subject.tags).to eq([tag])
    end
  end

  describe '#ingredients' do
    let(:tag_type) { create :tag_type, name: 'Ingredient' }
    let(:flower) { create :tag, tag_type: tag_type, name: 'Flower' }
    let(:eggs) { create :tag, tag_type: tag_type, name: 'Eggs' }
    it 'creates ingredients' do
      subject.tag_selections.create([{ tag: flower }, { tag: eggs }])
      expect(subject.ingredients.sort).to eq([flower, eggs].sort)
    end
  end

  describe '#accesses' do
    let!(:access) { create :access, accessible: subject }
    it 'creates ingredients' do
      expect(subject.access).to eq(access)
    end
  end

  describe '#ingredients_with_detail' do
    let(:tag_type) { create :tag_type, name: 'Ingredient' }
    let(:ketchup) { create :tag, tag_type: tag_type, name: 'Ketchup' }
    let!(:ketchup_amount) { build :tag_attribute, property: 'Amount', value: '1 dollup' }
    let!(:ketchup_display) { build :tag_attribute, property: 'Display', value: 'smeared' }
    let(:mustard) { create :tag, tag_type: tag_type, name: 'Mustard' }
    let!(:mustard_amount) do
      build :tag_attribute, property: 'Amount', value: 'One Squeeze'
    end
    it 'creates ingredients with detail' do
      subject.tag_selections.create(
        [
          { tag: ketchup, tag_attributes: [ketchup_amount, ketchup_display] },
          { tag: mustard, tag_attributes: [mustard_amount] }
        ]
      )
      expect(subject.ingredients_with_detail.length).to eq(2)
      expect(subject.ingredients_with_detail[ketchup.id].length).to eq(2)
      expect(subject.ingredients_with_detail[ketchup.id].first.name).to eq(ketchup.name)
      expect(subject.ingredients_with_detail[mustard.id].length).to eq(1)
      expect(subject.ingredients_with_detail[mustard.id].first.property).
        to eq(mustard_amount.property)
      expect(subject.ingredients_with_detail[mustard.id].first.value).
        to eq(mustard_amount.value)
    end
  end

  describe '#vessel' do
    let(:tag_type) { create :tag_type, name: 'Vessel' }
    let(:plate) { create :tag, tag_type: tag_type, name: 'Hot Plate' }
    it 'creates vessel' do
      subject.tag_selections.create(tag: plate)
      expect(subject.vessels).to eq([plate])
    end
  end

  describe '#source' do
    let(:tag_type) { create :tag_type, name: 'Source' }
    let(:chef) { create :tag, tag_type: tag_type, name: 'Top Chef' }
    it 'shows vessel' do
      subject.tag_selections.create(tag: chef)
      expect(subject.sources).to eq([chef])
    end
  end
end
# rubocop: enable Metrics/BlockLength
