# frozen_string_literal: true

require 'rails_helper'
require_relative '../contexts/tag_type_context.rb'
require_relative '../contexts/recipe_form_context.rb'

# rubocop: disable Metrics/BlockLength
RSpec.describe RecipeForm, type: :interactor do
  describe '.call' do
    include_context 'tag_types'
    let(:user) { create(:user) }
    describe 'create' do
      let(:params) do
        {
          'recipe_name' => 'rname',
          'description' => 'rdesc',
          'instructions' => 'rinst',
          'ingredients' => [
            {
              'ingredient_amount' => '2',
              'ingredient_prep' => 'diced',
              'ingredient_modification' => {
                'label' => 'Ancho Chile infused', 'value' => ancho_chili_infused.id
              },
              'ingredient' => { 'label' => 'Simple Syrup', 'value' => simple_syrup.id }
            },
            {
              'ingredient_amount' => '3',
              'ingredient' => { 'label' => 'Soda Water', 'value' => club_soda.id }
            }
          ],
          'sources' => [
            { 'id' => recipe_book.id, 'name' => 'Erik Osmond' },
            { 'id' => recipe_website.id, 'name' => 'Hannah Infographic' }
          ],
          'vessels' => [{ 'id' => coupe.id, 'name' => 'Snifter' }],
          'recipetypes' => [{ 'id' => mocktails.id, 'name' => 'Mocktails' }],
          'menus' => [{ 'id' => home_bar.id, 'name' => 'Been Made' }],
          'preparations' => [{ 'id' => shaken.id, 'name' => 'Shaken' }],
          'flavors' => [{ 'id' => sweet.id, 'name' => 'Spicy' }],
          'components' => [{ 'id' => crushed_ice.id, 'name' => 'Crushed Ice' }]
        }
      end
      let(:r) { Recipe.find_by_name 'rname' }

      before do
        RecipeForm.call(user: user, params: params, action: :create)
      end
      it 'saves the recipe name' do
        expect(r.access).to_not eq nil
      end
      it 'saves the recipe description' do
        expect(r.description).to eq 'rdesc'
      end
      it 'saves the recipe instructions' do
        expect(r.instructions).to eq 'rinst'
      end
      it 'saves the recipe components' do
        expect(r.components.map(&:id)).to eq [crushed_ice.id]
      end
      it 'saves the recipe components access' do
        expect(r.components.first.tag_selections.first.access).not_to eq nil
      end
      it 'saves the recipe flavors' do
        expect(r.flavors.map(&:id)).to eq [sweet.id]
      end
      it 'saves the recipe preparations' do
        expect(r.preparations.map(&:id)).to eq [shaken.id]
      end
      it 'saves the recipe menus' do
        expect(r.menus.map(&:id)).to eq [home_bar.id]
      end
      it 'saves the recipe recipe_types' do
        expect(r.recipe_types.map(&:id)).to eq [mocktails.id]
      end
      it 'saves the recipe vessels' do
        expect(r.vessels.map(&:id)).to eq [coupe.id]
      end
      it 'saves the recipe sources' do
        expect(r.sources.map(&:id) - [recipe_book.id, recipe_website.id]).to eq []
      end
      it 'saves the recipe ingredients' do
        expect(r.ingredients.map(&:id) - [simple_syrup.id, club_soda.id]).to eq []
      end
      it 'saves the recipe ingredient modification' do
        expect(r.ingredients.first.tag_selections.first.modifications.first.id).
          to eq ancho_chili_infused.id
      end
      it 'saves the recipe ingredient modification access' do
        expect(
          r.ingredients.first.tag_selections.first.modification_selections.first.access
        ).not_to eq nil
      end
      it 'saves the recipe ingredient attribute property' do
        expect(r.ingredients.first.tag_selections.first.tag_attributes.first.property).
          to eq 'amount'
      end
      it 'saves the recipe ingredient attribute value' do
        expect(r.ingredients.first.tag_selections.first.tag_attributes.first.value).
          to eq '2'
      end
    end
    describe 'edit' do
      include_context 'recipe_form'
      let(:params) { { recipe: recipe } }
      let(:form) { RecipeForm.call(params: params, action: :edit, user: user) }

      it 'expects all recipe data ready for redux form' do
        expected_sources = [
          { id: recipe_website.id, name: 'Recipe Website' },
          { id: recipe_book.id, name: 'Recipe Book' }
        ]
        expect(form.result[:sources] - expected_sources).to eq []
        form.result.delete(:sources)
        expect(form.result).to eq(
          {
            id: recipe.id,
            components: [{ id: crushed_ice.id, name: 'Crushed Ice' }],
            description: 'very yummy',
            flavors: [{ id: sweet.id, name: 'Sweet' }],
            ingredients: [
              {
                ingredient: { label: 'Simple Syrup', value: simple_syrup.id },
                ingredient_amount: '2',
                ingredient_modification: {
                  label: 'Ancho chili infused', value: ancho_chili_infused.id
                },
                ingredient_prep: 'minced'
              }
            ],
            instructions: 'Layer everything together',
            menus: [{ id: home_bar.id, name: 'Home bar' }],
            preparations: [{ id: shaken.id, name: 'Shaken' }],
            recipe_name: 'Recipe with everything',
            recipe_types: [{ id: mocktails.id, name: 'Mocktails' }],
            vessels: [{ id: coupe.id, name: 'Coupe' }]
          }
        )
      end
    end
  end
end
# rubocop: enable Metrics/BlockLength
