# frozen_string_literal: true

require 'rails_helper'

# rubocop: disable Metrics/BlockLength
describe TagSelection, type: :model do
  subject { create :tag_selection }

  it 'has a valid factory' do
    expect(subject).to be_valid
  end

  describe '#tag_attributes' do
    let(:tag_attribute) { create(:tag_attribute, tag_attributable: subject) }
    it 'has tag_attributes' do
      expect(subject.tag_attributes).to eq([tag_attribute])
    end
  end

  describe '#modification_selections' do
    let(:tag) { create(:tag) }
    it 'has modification_selections' do
      subject.modification_selections.create(tag: tag)
      expect(subject.modifications).to eq([tag])
    end
  end

  describe '#modified_tags' do
    let(:tag_type) { create(:tag_type, name: 'IngredientModification') }
    let(:ingredient) { create(:tag, name: 'flour') }
    let(:recipe) { create(:recipe, name: 'cake') }
    let(:recipe_ingredient) { create(:tag_selection, tag: ingredient, taggable: recipe) }
    let(:modification) { create(:tag, name: 'bleached', tag_type: tag_type) }
    let!(:modification_assignment) do
      create(:tag_selection, tag: modification, taggable: recipe_ingredient)
    end
    it 'modified tags' do
      expect(modification.modified_tags.map(&:name)).to eq([ingredient.name])
    end
  end

  describe '#access' do
    let!(:access) { create(:access, accessible: subject) }
    it 'can have an access' do
      expect(subject.access).to eq(access)
    end
  end

  describe '#tag' do
    it 'belongs to valid tag' do
      expect(subject.tag).to be_valid
    end
  end

  describe '#taggable' do
    let(:recipe) { create(:recipe) }
    let(:tag) { create(:tag) }
    let!(:tag_selection) { create(:tag_selection, tag: tag, taggable: recipe) }
    it 'belongs to valid tag' do
      expect(tag_selection.taggable).to eq(recipe)
    end
  end

  describe '#recipe' do
    let(:recipe) { create(:recipe) }
    let(:tag) { create(:tag) }
    let!(:tag_selection) { create(:tag_selection, tag: tag, taggable: recipe) }
    it 'belongs to valid tag' do
      expect(tag_selection.recipe).to eq(recipe)
    end
  end

  describe '#validations' do
    let(:recipe) { create(:recipe) }
    let(:tag) { create(:tag) }
    let(:tsa) { build(:tag_selection, tag_id: nil) }
    let(:tsb) { build(:tag_selection, taggable: nil) }
    let!(:ts1) { create(:tag_selection, tag: tag, taggable: recipe) }
    let!(:ts2) { build(:tag_selection, tag: tag, taggable: recipe) }
    it 'validates present tag_id' do
      expect(tsa).not_to be_valid
    end
    it 'validates present taggable' do
      expect(tsb).not_to be_valid
    end
    it 'validates unique tags by taggable entity' do
      # for instance when a recipe has a lime wedge and lime juice
      expect(ts2).to be_valid
    end
  end
end
# rubocop: enable Metrics/BlockLength
