# frozen_string_literal: true

module Api
  # Controller for tags
  class TagsController < ApplicationController
    def index
      tag_type = params.permit(:type)[:type]
      tags = check_type(tag_type)
      if tags
        render_tags(tag_type, tags, current_user)
      else
        render json: { tag_type: tag_type.to_s }, status: :not_found
      end
    end

    def show
      tag = Tag.find_by_id(params.permit(:id)[:id])
      if tag
        hierarchy_result = BuildTagHierarchy.call(
          tag: tag,
          current_user: current_user
        )
        result = GroupTags.call(hierarchy_context_params(hierarchy_result))
        render(json: result.json) && return if result.success?
      end
      render json: {}, status: :not_found
    end

    private

      def check_type(tag_type)
        if tag_type
          TagsByType.call(tag_type: tag_type, current_user: current_user)
        else
          tag_json = Tag.all.as_json(only: %i[id name])
          tag_json.map { |r| { 'Label' => r['name'], 'Value' => r['id'] } }
        end
      end

      def hierarchy_context_params(hierarchy_result)
        # This just makes it clearer what is being passed into GroupTags.call
        {
          tag: hierarchy_result.tag,
          current_user: hierarchy_result.current_user,
          tags_with_hierarchy: hierarchy_result.tags_with_hierarchy,
          sister_tags: hierarchy_result.sister_tags
        }
      end

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
