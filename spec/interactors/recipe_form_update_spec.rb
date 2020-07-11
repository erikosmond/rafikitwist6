# frozen_string_literal: true

require 'rails_helper'
require_relative '../contexts/tag_type_context.rb'
require_relative '../contexts/recipe_form_context.rb'

# rubocop: disable Metrics/BlockLength
RSpec.describe RecipeForm, type: :interactor do
  describe '.call' do
    include_context 'tag_types'
    include_context 'recipe_form'
    let(:user) { create(:user) }
    describe 'update' do
      let(:r) { Recipe.find_by_name 'rname' }
      let(:params) do
        {
          'id' => recipe.id,
          'recipe_name' => 'newname',
          'description' => 'newdesc',
          'instructions' => 'newinst',
          'ingredients' => [
            # this is an updated ingredient
            {
              'ingredient_amount' => '3',
              'ingredient_prep' => 'dripped',
              'ingredient_modification' => {
                'label' => 'Ancho Chile infused', 'value' => jalepeno_infused.id
              },
              'ingredient' => { 'label' => 'Simple Syrup', 'value' => simple_syrup.id }
            },
            # this is a new ingredient
            {
              'ingredient_amount' => '3',
              'ingredient' => { 'label' => 'Club Soda', 'value' => club_soda.id }
            },
            {
              'ingredient_amount' => '4 wedges',
              'ingredient' => { 'label' => 'Lime', 'value' => lime.id }
            },
            {
              'ingredient_amount' => '5 ounces',
              'ingredient_prep' => 'squeezed',
              'ingredient_modification' => {
                'label' => 'Juice of', 'value' => juice_of.id
              },
              'ingredient' => { 'label' => 'Lime', 'value' => lime.id }
            }
          ],
          'sources' => [
            { 'id' => recipe_book.id, 'name' => 'Erik Osmond' },
            { 'id' => recipe_website.id, 'name' => 'Hannah Infographic' }
          ],
          'vessels' => [{ 'id' => snifter.id, 'name' => 'Snifter' }]
        }
      end
      let(:r) { Recipe.find recipe.id }

      before do
        RecipeForm.call(user: user, action: :update, params:
          {
            recipe: recipe, form_fields: params
          })
      end

      it 'saves the recipe name' do
        expect(r.name).to eq 'newname'
        expect(r.description).to eq 'newdesc'
        expect(r.instructions).to eq 'newinst'
      end
      it 'saves/deletes the correct number of tags associated with the recipe' do
        expect(r.tag_selections.count).to eq 7
      end
      it 'saves the non modified ingredient' do
        cs = r.tag_selections.where(tag_id: club_soda.id).first
        expect(cs.present?).to eq true
      end
      it 'saves the single modified ingredient' do
        ss = r.tag_selections.where(tag_id: simple_syrup.id).first
        expect(ss.body).to eq 'dripped'
        expect(ss.modification_selections.first.tag.id).to eq jalepeno_infused.id
      end
      it 'saves the duplicate ingredients' do
        limes = r.tag_selections.where(tag_id: lime.id)
        juice = limes.find { |l| l.body == 'squeezed' }
        expect(juice.modification_selections.first.tag.id).to eq juice_of.id
        expect(juice.tag_attributes.first.value).to eq '5 ounces'
        wedge = limes.find { |l| l.body.nil? }
        expect(wedge.tag_attributes.first.value).to eq '4 wedges'
      end
      it 'saves the sources' do
        expect([recipe_book.id, recipe_website.id] - r.sources.map(&:id)).to eq []
      end
      it 'saves the vessel' do
        expect([snifter.id] - r.vessels.map(&:id)).to eq []
      end
    end
  end
end
# rubocop: enable Metrics/BlockLength
