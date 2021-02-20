# frozen_string_literal: true

require 'rails_helper'
require_relative '../contexts/tag_context'
require_relative '../contexts/recipe_context'

# rubocop: disable Metrics/BlockLength
describe Tag, type: :model do
  let(:recipe_index) { Graph::RecipeIndex.instance }
  let(:tag_index) { Graph::TagIndex.instance }

  before(:each) do
    TagType.delete_cache
  end

  subject { create :tag }

  it 'has a valid factory' do
    expect(subject).to be_valid
  end

  it 'has a tag type' do
    expect(subject.tag_type).to be_valid
  end

  describe '#recipe' do
    it 'can be a recipe' do
      recipe = create(:recipe)
      subject.recipe_id = recipe.id
      expect(subject.recipe).to eq(recipe)
    end
  end

  describe '#recipes' do
    let(:cake) { create(:recipe) }
    let(:tag_type) { create :tag_type, name: 'Ingredient' }
    let(:flower) { create :tag, tag_type: tag_type, name: 'Flower' }
    it 'creates ingredients' do
      cake.tag_selections.create([{ tag: flower }])
      expect(flower.recipes).to eq([cake])
    end
  end

  describe '#tags_on_tags' do
    include_context 'tags'
    let(:expected_hierarchy_result) do
      {
        'id' => nut.id,
        'name' => 'Nut',
        'description' => nil,
        'tag_type_id' => nut.tag_type.id,
        'tags' => { nut.id => 'Nut' },
        'recipe_id' => nil,
        'child_tags' => { almond.id => 'Almond' },
        'parent_tags' => { protein.id => 'Protein' },
        'grandparent_tags' => { plants.id => 'plants' },
        'modification_tags' => {
          modification1.id => 'toasted',
          modification2.id => 'crushed'
        },
        'modified_tags' => {}
      }
    end

    it 'returns all ingredient filters' do
      recipe_index.reset
      tag_index.reset
      expected = { protein.id => { nut.id => [almond.id] } }
      # TODO: rewrite these tests to use the new graph solution
      expect(Tag.ingredient_group_hierarchy_filters(user)).to eq(expected)
    end

    it 'returns ingredient filters for non_active_user' do
      recipe_index.reset
      tag_index.reset
      expected = { protein.id => { nut.id => [almond.id] } }
      expect(Tag.ingredient_group_hierarchy_filters(non_active_user)).to eq(expected)
    end

    it 'returns tags_by_type' do
      expected = [toasted.id, crushed.id].sort
      expect(Tag.tags_by_type.keys.size).to eq 1
      expect(Tag.tags_by_type[alteration.id].sort).to eq(expected)
    end

    it 'has parent_tags' do
      expect(almond.parent_tags).to eq([nut])
    end
    it 'assigns recipe to ingredient' do
      expect(nut.recipes).to eq([vesper])
    end
    it 'assigns recipe to ingredient type' do
      expect(almond.recipes).to eq([martini])
    end
    describe 'assigns recipes to ingredient family' do
      it 'has manhattan as a recipe' do
        expect(protein.recipes).to eq([manhattan])
      end
    end
  end

  describe '#access' do
    let!(:access) { create(:access, accessible: subject) }
    it 'can have an access' do
      expect(subject.access).to be_valid
    end
  end

  describe '#tag_attributes' do
    let(:tag_attribute) { create(:tag_attribute, tag_attributable: subject) }
    it 'has tag_attributes' do
      expect(subject.tag_attributes).to eq([tag_attribute])
    end
  end

  describe '#recipes_with_grouped_detail' do
    include_context 'recipes'
    describe '#collect_tag_ids' do
      let(:tag_subject) do
        create(:tag, name: 'Lemon Verbena', tag_type: tag_type_ingredient_type)
      end
    end

    describe '#collect_tag_ids' do
      let(:tag_subject) do
        create(:tag, name: 'Chamomile', tag_type: tag_type_modifiction_type)
      end
      let!(:mod_selection) do
        create(:tag_selection, tag: tag_subject, taggable: tag_selection1)
      end
    end
  end

  describe '#validations' do
    let(:tag_type) { create(:tag_type) }
    let(:recipe) { create(:recipe) }
    let(:taga) { build(:tag, name: nil) }
    let(:tagb) { build(:tag, tag_type: nil) }
    let!(:tag1) { create(:tag, tag_type: tag_type, name: 'Same Name') }
    let!(:tag2) { build(:tag, tag_type: tag_type, name: 'Same Name') }

    it 'validates present name' do
      expect(taga).not_to be_valid
    end
    it 'validates present tag type' do
      expect(tagb).not_to be_valid
    end
    it 'validates unique tags by taggable entity' do
      expect(tag2).not_to be_valid
    end
  end
end
# rubocop: enable Metrics/BlockLength
