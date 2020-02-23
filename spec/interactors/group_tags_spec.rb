# frozen_string_literal: true

require 'rails_helper'
require_relative '../contexts/tag_context.rb'

RSpec.describe GroupTags, type: :interactor do
  describe '.call' do
    include_context 'tags' # from './tag_context.rb'
    let(:expected_type_result) do
      {
        'id' => nut.id,
        'name' => 'Nut',
        'description' => nil,
        'tag_type_id' => nut.tag_type.id,
        'tags' => { nut.id => 'Nut' },
        'recipe_id' => nil,
        'sister_tags' => {},
        'child_tags' => { almond.id => 'Almond' },
        'parent_tags' => { protein.id => 'Protein' },
        'modification_tags' => {
          toasted.id => 'toasted',
          crushed.id => 'crushed'
        },
        'modified_tags' => {}
      }
    end
    let(:expected_family_result) do
      {
        "child_tags" => {nut.id=>"Nut"},
        "description" => nil,
        "grandchild_tags" => {almond.id=>"Almond"},
        "grandparent_tags" => {},
        "id" => protein.id,
        "modification_tags" => {},
        "modified_tags" => {},
        "name" => "Protein",
        "recipe_id" => nil,
        "sister_tags" => {},
        "tag_type_id" => protein.tag_type_id,
        "tags" => {protein.id=>"Protein"} 
      }
    end
    let(:expected_ingredient_result) do
      {
        "child_tags" => {},
        "description" => nil,
        "grandchild_tags" => {},
        "grandparent_tags" => {protein.id=>"Protein"},
        "id" => almond.id,
        "modification_tags" => {},
        "modified_tags" => {},
        "name" => "Almond",
        "parent_tags" => {nut.id=>"Nut"},
        "recipe_id" => nil,
        "sister_tags" => {},
        "tag_type_id" => almond.tag_type_id,
        "tags" => {almond.id=>"Almond"}
      }
    end
    it 'will return proper groups for ingredient type' do
      hierarchy_result = BuildTagHierarchy.call(
        tag: nut,
        current_user: user
      )
      result = GroupTags.call(
        tag: nut,
        current_user: user,
        tags_with_hierarchy: hierarchy_result.tags_with_hierarchy,
        sister_tags: hierarchy_result.sister_tags
      )
      expect(result.json).to eq expected_type_result
    end

    it 'will return proper groups for ingredient family' do
      hierarchy_result = BuildTagHierarchy.call(
        tag: protein,
        current_user: user
      )
      result = GroupTags.call(
        tag: protein,
        current_user: user,
        tags_with_hierarchy: hierarchy_result.tags_with_hierarchy,
        sister_tags: hierarchy_result.sister_tags
      )
      expect(result.json).to eq expected_family_result
    end

    it 'will return proper groups for ingredient' do
      hierarchy_result = BuildTagHierarchy.call(
        tag: almond,
        current_user: user
      )
      result = GroupTags.call(
        tag: almond,
        current_user: user,
        tags_with_hierarchy: hierarchy_result.tags_with_hierarchy,
        sister_tags: hierarchy_result.sister_tags
      )
      expect(result.json).to eq expected_ingredient_result
    end
  end
end
