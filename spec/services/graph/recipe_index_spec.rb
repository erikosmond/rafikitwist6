# frozen_string_literal: true

require 'rails_helper'
require_relative '../../contexts/graph_index_context'

# rubocop: disable Metrics/BlockLength
describe Graph::RecipeIndex do
  include_context 'graph_index_context'
  let(:expected_hash) do
    {
      0 => [
        self_rising_flour_recipe.id,
        pizza_dough_recipe.id,
        pizza.id,
        veggie_soup.id,
        veggie_plate.id
      ],
      user1.id => [
        pumpkin_pie.id, mashed_potatoes.id
      ],
      user2.id => [
        almond_milk_recipe.id, orgeat_recipe.id, awesome_blossom.id, mai_tai.id
      ]
    }
  end
  let(:recipe_index) { Graph::RecipeIndex.instance }
  let(:tag_index) { Graph::TagIndex.instance }

  # TODO: make sure the associations of the recipe are `loaded?`
  it 'generates and returns the recipes index' do
    recipe_index.reset
    expect(recipe_index.hash.values.map(&:name).sort).to eq [
      'Awesome Blossom',
      'Mai Tai',
      'Mashed Potatoes',
      'Pizza',
      'Pumpkin Pie',
      'Veggie Plate',
      'Veggie Soup',
      'almond milk',
      'orgeat',
      'pizza dough',
      'self-rising flour'
    ]
  end

  it 'assigns appropriate attributes' do
    recipe_index.reset
    tag_index.reset
    expect(recipe_index.hash[self_rising_flour_recipe.id].ingredients.first.amount).to eq '1 cup'
    expect(recipe_index.hash[self_rising_flour_recipe.id].ingredients.first.name).to eq 'flour'
    expect(recipe_index.hash[self_rising_flour_recipe.id].ingredients.first.modification_name).
      to eq 'bleached'
    expect(recipe_index.hash[self_rising_flour_recipe.id].ingredients.first.modification_id).
      to eq bleached.id
    expect(recipe_index.hash[self_rising_flour_recipe.id].ingredients.first.body).to eq 'sifted'
    expect(recipe_index.hash[self_rising_flour_recipe.id].ingredients.first.id).to eq flour.id
  end

  it 'loads tag ids by type' do
    recipe_index.reset
    tag_index.reset
    expect(recipe_index.hash[self_rising_flour_recipe.id].tag_ids_by_type).
      to eq({ 'vessels' => [{ tag_id: bowl.id, tag_name: bowl.name }], 'sources' => [{ tag_id: cook_book.id, tag_name: cook_book.name }] })
  end

  it 'loads objective tag ids' do
    recipe_index.reset
    tag_index.reset
    expect(recipe_index.hash[self_rising_flour_recipe.id].objective_tag_ids.sort).
      to eq([flour.id, bowl.id, cook_book.id, baking_soda.id, bleached.id].sort)
  end

  it 'loads filter tag ids' do
    recipe_index.reset
    tag_index.reset
    expect(recipe_index.hash[self_rising_flour_recipe.id].filter_tag_ids.sort).
      to eq([
        flour.id, wheat.id, grains.id, bowl.id, cook_book.id, baking_soda.id, bleached.id
      ].sort)
  end

  it 'loads filter tag ids with nested recipes' do
    # TODO: write a test that returns subjective tags with filter tag ids
    recipe_index.reset
    tag_index.reset
    expect(recipe_index.hash[mai_tai.id].filter_tag_ids.sort).
      to eq([
        plant_protein.id, nut.id, water.id, almond.id, dry_roasted.id,
        sugar.id, almond_milk.id, orgeat.id, rum.id, distilled.id
      ].sort)
  end

  it 'shows tag modifications by user' do
    recipe_index.reset
    tag_index.reset

    almond_tag = Graph::TagIndex.instance.fetch_by_user(almond.id, user2)
    almond_recipes = almond_tag.api_response_recipes(user2.id)

    expect(almond_recipes.length).to eq(3)
    expect(almond_recipes.first.api_response).to eq(
      {
        id: almond_milk_recipe.id,
        name: almond_milk_recipe.name,
        instructions: almond_milk_recipe.instructions,
        description: almond_milk_recipe.description,
        tag_ids: {
          comment_tag.id => true, one_star.id => true, low_priority.id => true, dry_roasted.id => true,
          distilled.id => true, plant_protein.id => true, nut.id => true,
          water.id => true, almond.id => true
        },
        ingredients:
          {
            "#{almond.id}mod#{dry_roasted.id}" =>
            {
              body: nil,
              id: am1_ing1.id,
              modification_id: dry_roasted.id,
              modification_name: dry_roasted.name,
              property: 'amount',
              tag_name: almond.name,
              tag_type: 'Ingredient',
              value: nil,
              tag_description: almond.description,
              tag_id: almond.id,
              tag_type_id: ingredient_tag_type.id
            },
            "#{water.id}mod#{distilled.id}" =>
            {
              body: nil,
              id: am1_ing2.id,
              modification_id: distilled.id,
              modification_name: distilled.name,
              property: 'amount',
              tag_name: water.name,
              tag_type: 'Ingredient',
              value: nil,
              tag_description: nil,
              tag_id: water.id,
              tag_type_id: ingredient_tag_type.id
            }
          },
        priorities: [{ id: almond_milk_priority.id, tag_id: low_priority.id, body: nil, tag_name: low_priority.name }],
        ratings: [{ id: almond_milk_rating.id, tag_id: one_star.id, body: nil, tag_name: one_star.name }],
        comments: [{
          id: almond_milk_comment.id, tag_id: comment_tag.id,
          body: almond_milk_comment.body, tag_name: 'Comment'
        }]
      }
    )
  end

  it 'shows recipe properties in api response for recipe owner' do
    recipe_index.reset
    tag_index.reset
    flour_tag1 = Graph::TagIndex.instance.fetch_by_user(flour.id, user1)
    flour_recipes1 = flour_tag1.api_response_recipes(user1.id)

    expect(flour_recipes1.first.api_response['vessels'].first).to eq(
      { tag_id: bowl.id, tag_name: bowl.name }
    )
    expect(flour_recipes1.first.api_response['sources'].first).to eq(
      { tag_id: cook_book.id, tag_name: cook_book.name }
    )
    expect(flour_recipes1.last.api_response[:ratings].size).to eq 1
    expect(flour_recipes1.last.api_response[:ratings].first[:tag_id]).to eq(five_star.id)

    expect(flour_recipes1.last.api_response[:priorities].size).to eq 1
    expect(flour_recipes1.last.api_response[:priorities].first[:tag_id]).to eq(
      high_priority.id
    )

    expect(flour_recipes1.last.api_response[:comments].size).to eq 1
    expect(flour_recipes1.last.api_response[:comments].first[:body]).to eq('hot')
  end

  it 'shows recipe properties in api response for non-owner user of recipe' do
    recipe_index.reset
    tag_index.reset
    flour_tag2 = Graph::TagIndex.instance.fetch_by_user(flour.id, user2)
    flour_recipes2 = flour_tag2.api_response_recipes(user2.id)

    expect(flour_recipes2.last.api_response[:ratings].size).to eq 1
    expect(flour_recipes2.last.api_response[:ratings].first[:tag_id]).to eq(one_star.id)

    expect(flour_recipes2.last.api_response[:priorities].size).to eq 1
    expect(flour_recipes2.last.api_response[:priorities].first[:tag_id]).to eq(
      low_priority.id
    )

    expect(flour_recipes2.last.api_response[:comments].size).to eq 1
    expect(flour_recipes2.last.api_response[:comments].first[:body]).to eq('cheesy')
  end
  it 'resets modifications' do
    modified = Graph::UserAccessModifiedTagIndex.instance
    modifications = Graph::UserAccessModificationTagIndex.instance
    modified.reset
    modifications.reset
    tag_index.reset
    recipe_index.reset
    expect(modified.hash).to eq(
      {
        0 => { bleached.id => [flour.id] }, user2.id =>
        {
          dry_roasted.id => [almond.id], distilled.id => [water.id]
        }
      }
    )

    expect(modifications.hash).to eq(
      {
        0 => { flour.id => [bleached.id] }, user2.id =>
        {
          almond.id => [dry_roasted.id], water.id => [distilled.id]
        }
      }
    )
  end

  it 'shows recipe properties for private tag' do
    recipe_index.reset
    tag_index.reset

    almond_tag = Graph::TagIndex.instance.fetch_by_user(almond.id, user2)
    almond_user2 = almond_tag.api_response(user2.id)
    expect(almond_user2).to eq(
      {
        modification_tags: { dry_roasted.id => dry_roasted.name },
        modified_tags: {},
        description: almond.description,
        id: almond.id,
        name: almond.name,
        recipe_id: nil,
        tag_type_id: ingredient_tag_type.id,
        tags: { almond.id => almond.name },
        child_tags: {},
        grandchild_tags: {},
        grandparent_tags: { plant_protein.id => plant_protein.name },
        parent_tags: { nut.id => nut.name },
        sister_tags: { cashew.id => cashew.name }
      }
    )

    almond_user1 = almond_tag.api_response(user1.id)
    expect(almond_user1[:sister_tags]).to eq(
      { cashew.id => cashew.name, hazelnut.id => hazelnut.name }
    )
  end
  
  it 'shows properties for modification tag' do
    recipe_index.reset
    tag_index.reset
    dr1 = Graph::TagIndex.instance.fetch_by_user(dry_roasted.id, user2)
    expect(dr1.api_response(user1)[:modified_tags]).to eq({})
  end

  describe '' do
    before :each do
      modified = Graph::UserAccessModifiedTagIndex.instance
      modifications = Graph::UserAccessModificationTagIndex.instance
      modified.reset
      modifications.reset
      recipe_index.reset
      tag_index.reset
    end
    it 'permissions on modifications' do      
      dr2 = Graph::TagIndex.instance.fetch_by_user(dry_roasted.id, user2)
      expect(dr2.api_response(user2)[:modified_tags]).to eq(
        { almond.id => almond.name }
      )
    end
    it 'permissions on modifications2' do
      b1 = Graph::TagIndex.instance.fetch_by_user(bleached.id, user1)
      expect(b1.api_response(user1)[:modified_tags]).to eq(
        { flour.id => flour.name }
      )
    end
    it 'permissions on modifications3' do
      b2 = Graph::TagIndex.instance.fetch_by_user(bleached.id, user2)
      expect(b2.api_response(user2)[:modified_tags]).to eq(
        { flour.id => flour.name }
      )
    end
    it 'permissions on modifications4' do
      f1 = Graph::TagIndex.instance.fetch_by_user(flour.id, user1)
      expect(f1.api_response(user1)[:modification_tags]).to eq(
        { bleached.id => bleached.name }
      )
    end
    it 'permissions on modifications5' do
      f2 = Graph::TagIndex.instance.fetch_by_user(flour.id, user2)
      expect(f2.api_response(user2)[:modification_tags]).to eq(
        { bleached.id => bleached.name }
      )
    end
    it 'permissions on modifications6' do
      nr1 = Graph::TagIndex.instance.fetch_by_user(nut.id, user2)
      expect(nr1.api_response(user1)[:child_tags]).to eq(
        { cashew.id => cashew.name, hazelnut.id => hazelnut.name }
      )
    end
    it 'permissions on modifications7' do
      nr2 = Graph::TagIndex.instance.fetch_by_user(nut.id, user2)
      expect(nr2.api_response(user2)).to eq(
        modification_tags: { dry_roasted.id => dry_roasted.name },
        modified_tags: {},
        description: nil,
        id: nut.id,
        name: nut.name,
        recipe_id: nil,
        tag_type_id: ingredient_type_tag_type.id,
        tags: { nut.id => nut.name },
        child_tags: { cashew.id => cashew.name, almond.id => almond.name },
        grandchild_tags: {},
        grandparent_tags: {},
        parent_tags: { plant_protein.id => plant_protein.name },
        sister_tags: {}
      )
    end
    it 'permissions on modifications8' do
      pp = Graph::TagIndex.instance.fetch_by_user(plant_protein.id, user2)
      expect(pp.api_response(user2)).to eq(
        modification_tags: { dry_roasted.id => dry_roasted.name },
        modified_tags: {},
        description: nil,
        id: plant_protein.id,
        name: plant_protein.name,
        recipe_id: nil,
        tag_type_id: ingredient_family_tag_type.id,
        tags: { plant_protein.id => plant_protein.name },
        child_tags: { nut.id => nut.name },
        grandchild_tags: { cashew.id => cashew.name, almond.id => almond.name },
        grandparent_tags: {},
        parent_tags: {},
        sister_tags: {}
      )
    end
    it 'permissions on modifications9' do
      pp = Graph::TagIndex.instance.fetch_by_user(plant_protein.id, user2)
      expect(pp.api_response(user2)).to eq(
        modification_tags: { dry_roasted.id => dry_roasted.name },
        modified_tags: {},
        description: nil,
        id: plant_protein.id,
        name: plant_protein.name,
        recipe_id: nil,
        tag_type_id: ingredient_family_tag_type.id,
        tags: { plant_protein.id => plant_protein.name },
        child_tags: { nut.id => nut.name },
        grandchild_tags: { cashew.id => cashew.name, almond.id => almond.name },
        grandparent_tags: {},
        parent_tags: {},
        sister_tags: {}
      )
    end
  end
end
# rubocop: enable Metrics/BlockLength
