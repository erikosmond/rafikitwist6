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
    let(:rating_type) { create(:tag_type, name: 'Rating') }
    let(:five_stars) { create(:tag, name: '5 Stars', tag_type: rating_type) }
    let(:five_star_rating) { create(:tag_selection, tag: five_stars, taggable: recipe) }
    let!(:five_star_access) do
      create(:access, accessible: five_star_rating, user_id: user.id, status: 'PRIVATE')
    end

    let(:priority_type) { create(:tag_type, name: 'Priority') }
    let(:on_deck) { create(:tag, name: 'On Deck', tag_type: priority_type) }
    let(:on_deck_priority) { create(:tag_selection, tag: on_deck, taggable: recipe) }
    let!(:on_deck_access) do
      create(:access, accessible: on_deck_priority, user_id: user.id, status: 'PRIVATE')
    end

    let(:comment_type) { create(:tag_type, name: 'Comment') }
    let(:comment) { create(:tag, name: 'Comment', tag_type: comment_type) }
    let(:comment_selection) { create(:tag_selection, tag: comment, taggable: recipe) }
    let!(:comment_access) do
      create(:access, accessible: comment_selection, user_id: user.id, status: 'PRIVATE')
    end

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

      it "doesn't modify subjective tags from various users when recipe form is used" do
        expect(r.ratings.first).to eq five_stars
        expect(r.priorities.first).to eq on_deck
        expect(r.comments.first).to eq comment
      end
      it 'saves the recipe name, desc, and instructions' do
        expect(r.name).to eq 'newname'
        expect(r.description).to eq 'newdesc'
        expect(r.instructions).to eq 'newinst'
      end
      it 'saves/deletes the correct number of tags associated with the recipe' do
        expect(r.tag_selections.count).to eq 10
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
