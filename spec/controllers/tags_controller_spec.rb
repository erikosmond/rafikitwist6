# frozen_string_literal: true

require 'spec_helper'
require 'rails_helper'

require_relative '../contexts/tag_context'

# rubocop: disable Metrics/BlockLength
describe Api::TagsController, type: :controller do
  before(:each) do
    TagType.delete_cache
  end
  include_context 'tags'
  let!(:user) { create(:user) }
  let(:recipe_index) { Graph::RecipeIndex.instance }
  let(:tag_index) { Graph::TagIndex.instance }

  describe 'GET - index' do
    before do
      sign_in user
      get :index,
          params: params,
          format: 'json'
    end

    let!(:tag_groups) do
      { protein.id.to_s => { nut.id.to_s => [almond.id] } }
    end

    let!(:ingredient_tags) do
      [
        { 'Label' => 'Nut', 'Value' => nut.id },
        { 'Label' => 'Almond', 'Value' => almond.id },
        { 'Label' => 'Protein', 'Value' => protein.id },
        { 'Label' => 'Vodka', 'Value' => vodka.id }
      ]
    end

    let(:non_ingredient_tags) do
      [
        { 'Label' => 'plants', 'Value' => plants.id },
        { 'Label' => 'crushed', 'Value' => crushed.id }
      ]
    end

    let(:tags) { ingredient_tags + non_ingredient_tags }

    describe 'returns all tags and tag_groups' do
      let(:params) { {} }

      it 'responds with tag_groups' do
        body = JSON.parse(response.body)
        expect(body['tag_groups']).to eq(tag_groups)
      end
      it 'responds with tags user has access to' do
        # returning tags that have no recipes so they can be added in recipes form
        body = JSON.parse(response.body)
        expect(body['tags'].size).to eq 6
        expect(body['tags'].map { |t| t['Value'] } - [
          almond.id, vodka.id, toasted.id, crushed.id, nut.id, protein.id
        ]).
          to eq([])
      end
    end

    describe 'returns all tags and tag_groups' do
      let(:params) { { type: 'ingredients' } }

      it 'responds with tag_groups' do
        body = JSON.parse(response.body)
        expect(body['tag_groups']).to be_nil
      end
      it 'responds with tags' do
        body = JSON.parse(response.body)
        expect(body['tags'].size).to eq 4
        expect(body['tags'] - ingredient_tags).to eq([])
      end
    end

    describe 'returns all tags and tag_groups' do
      let(:params) { { type: 'more' } }

      it 'responds with tag_groups' do
        body = JSON.parse(response.body)
        expect(body['tag_groups']).to be_nil
      end
      it 'responds with tags' do
        body = JSON.parse(response.body)
        expect(body['tags'].size).to eq 2
        expect(body['tags'] - non_ingredient_tags).to eq([])
      end
    end
  end

  describe 'GET - show' do
    before do
      recipe_index.reset
      tag_index.reset
      sign_in user
      get :show,
          params: params,
          format: 'json'
    end

    describe 'returns data for an ingredient tag' do
      let!(:params) { { id: almond.id } }
      it 'returns the correct name, id, and type' do
        body = JSON.parse(response.body)
        expect(body['id']).to eq almond.id
        expect(body['name']).to eq almond.name
        expect(body['tag_type_id']).to eq almond.tag_type_id
      end
    end

    describe 'returns data for an ingredient type tag' do
      let!(:params) { { id: nut.id } }
      # TODO: add sister tags
      let!(:expected_response) do
        {
          'id' => nut.id,
          'name' => 'Nut',
          'description' => nil,
          'grandchild_tags' => {},
          'grandparent_tags' => {},
          'tag_type_id' => nut.tag_type_id,
          'recipe_id' => nil,
          'sister_tags' => {},
          'tags' => { nut.id.to_s => 'Nut' },
          'child_tags' => { almond.id.to_s => 'Almond' },
          'parent_tags' => { protein.id.to_s => 'Protein' },
          'modification_tags' => { crushed.id.to_s => 'crushed' },
          'modified_tags' => {}
        }
      end
      it 'returns the correct name, id, and type' do
        body = JSON.parse(response.body)
        expect(body).to eq expected_response
      end
    end

    describe 'returns data for an ingredient family tag' do
      let!(:params) { { id: protein.id } }
      let!(:expected_response) do
        {
          'id' => protein.id,
          'name' => 'Protein',
          'description' => nil,
          'tag_type_id' => protein.tag_type_id,
          'recipe_id' => nil,
          'sister_tags' => {},
          'tags' => { protein.id.to_s => 'Protein' },
          'child_tags' => { nut.id.to_s => 'Nut' },
          'grandchild_tags' => { almond.id.to_s => 'Almond' },
          'grandparent_tags' => {},
          "parent_tags" => {},
          'modification_tags' => { crushed.id.to_s => crushed.name },
          'modified_tags' => {}
        }
      end
      it 'returns the correct name, id, and type' do
        body = JSON.parse(response.body)
        expect(body).to eq expected_response
      end
    end
  end

  describe 'GET - edit' do
    before do
      sign_in user
      get :edit,
          params: params,
          format: 'json'
    end

    describe 'returns data for an ingredient tag' do
      let!(:params) { { id: almond.id } }
      it 'returns the correct name, id, and type' do
        body = JSON.parse(response.body)
        expect(body['id']).to eq almond.id
        expect(body['name']).to eq almond.name
        expect(body['tag_type_id']).to eq almond.tag_type_id
        expect(body['description']).to eq almond.description
        expect(body['recipe_id']).to eq almond.recipe_id
        expect(body['parent_tags']).to eq [{ 'id' => nut.id, 'name' => nut.name }]
      end
    end
  end

  describe 'PUT - update' do
    before do
      sign_in user
      put :update,
          params: params,
          format: 'json'
    end

    describe 'returns data for an ingredient tag' do
      let!(:params) do
        {
          id: almond.id,
          name: 'almond2',
          description: 'desc2',
          recipe_id: 2,
          tag_type_id: almond.tag_type_id + 1,
          parent_tags: [{ 'id' => protein.id, 'name' => protein.name }]
        }
      end
      it 'returns the correct name, id, and type' do
        body = JSON.parse(response.body)
        expect(body['id']).to eq almond.id
        expect(body['name']).to eq 'almond2'
        expect(body['tag_type_id']).to eq almond.tag_type_id + 1
        expect(body['description']).to eq 'desc2'
        expect(body['recipe_id']).to eq 2
        expect(body['parent_tags']).to eq [{ 'id' => protein.id, 'name' => protein.name }]
      end
    end
  end

  describe 'PUT - update - missing permissions' do
    before do
      sign_in other_user
      put :update,
          params: params,
          format: 'json'
    end

    describe 'returns data for an ingredient tag' do
      let!(:other_user) { create :user }
      let!(:params) do
        {
          id: almond.id,
          name: 'almond2',
          description: 'desc2',
          recipe_id: 2,
          tag_type_id: almond.tag_type_id + 1,
          parent_tags: [{ 'id' => protein.id, 'name' => protein.name }]
        }
      end
      it 'returns the correct name, id, and type' do
        body = JSON.parse(response.body)
        expect(body).to eq({})
        expect(response.status).to eq 403
      end
    end
  end

  describe 'POST - create' do
    before do
      sign_in user
      post :create,
           params: params,
           format: 'json'
    end

    describe 'returns data for an ingredient tag' do
      let!(:params) do
        {
          name: 'hazelnut',
          description: 'descHazel',
          recipe_id: 3,
          tag_type_id: almond.tag_type_id,
          parent_tags: [{ 'id' => protein.id, 'name' => protein.name }]
        }
      end
      it 'returns the correct name, id, and type' do
        body = JSON.parse(response.body)
        expect(body['id']).to be_a_kind_of(Integer)
        expect(body['name']).to eq 'hazelnut'
        expect(body['tag_type_id']).to eq almond.tag_type_id
        expect(body['description']).to eq 'descHazel'
        expect(body['recipe_id']).to eq 3
        expect(body['parent_tags']).to eq [{ 'id' => protein.id, 'name' => protein.name }]
      end
    end
  end
end
# rubocop: enable Metrics/BlockLength
