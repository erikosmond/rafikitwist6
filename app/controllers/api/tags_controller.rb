# frozen_string_literal: true

module Api
  # Controller for tags
  class TagsController < ApplicationController
    include TagsControllerHelper
    def index
      tag_type = params.permit(:type)[:type]
      tags = check_type(tag_type, current_user)
      if tags
        render_tags(tag_type, tags, current_user)
      else
        render json: { tag_type: tag_type.to_s }, status: :not_found
      end
    end

    def show
      tag = Graph::TagIndex.instance.fetch(params.permit(:id)[:id])
      Permissions.new(current_user).can_view!(tag)
      render(json: tag.api_response(current_user&.id))
    end

    def create
      Permissions.new(current_user).can_create!
      result = TagForm.call(
        action: :create,
        params: tag_params,
        user: current_user
      )
      render json: result.tag
    end

    def edit
      tag = Tag.find_by_id params.permit(:id)['id']
      Permissions.new(current_user).can_edit!(tag)
      render json: TagForm.call(
        action: :edit,
        params: tag_params,
        user: current_user
      ).result
    end

    def update
      tag = Tag.find_by_id tag_params['id']
      Permissions.new(current_user).can_edit!(tag)
      render json: TagForm.call(
        action: :update,
        params: { tag: tag, form_fields: tag_params },
        user: current_user
      ).result
    end

    private

      def tag_params
        allowed_columns = [
          :id, :name, :tag_type_id, :description, :recipe_id, { parent_tags: %i[id name] }
        ]
        params.permit allowed_columns
      end
  end
end
