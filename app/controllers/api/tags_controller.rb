# frozen_string_literal: true

module Api
  # Controller for tags
  class TagsController < ApplicationController
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
      render(json: tag.api_response(current_user.id))

      # tag = Tag.find_by_id(params.permit(:id)[:id])
      # hierarchy_result = BuildTagHierarchy.call(
      #   tag: tag,
      #   current_user: current_user
      # )
      # result = GroupTags.call(hierarchy_context_params(hierarchy_result))
      # render(json: result.json)
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

      def check_type(tag_type, current_user)
        # TODO: move this logic to an interactor
        if tag_type
          TagsByType.call(tag_type: tag_type, current_user: current_user)
        else
          tag_json = Tag.joins(:access).where(
            "accesses.user_id = #{current_user&.id.to_i} or accesses.status = 'PUBLIC'"
          ).as_json(only: %i[id name])
          tag_json.map { |r| { 'Label' => r['name'], 'Value' => r['id'] } }
        end
      end

      # def hierarchy_context_params(hierarchy_result)
      #   # This just makes it clearer what is being passed into GroupTags.call
      #   {
      #     tag: hierarchy_result.tag,
      #     tags_with_hierarchy: hierarchy_result.tags_with_hierarchy,
      #     sister_tags: hierarchy_result.sister_tags
      #   }
      # end

      def render_tags(tag_type, tags, current_user)
        if tag_type
          render json: { tags: tags.json }
        else
          render json: {
            tags: tags,
            tag_groups: Tag.ingredient_group_hierarchy_filters(current_user)
          }
        end
      end
  end
end
