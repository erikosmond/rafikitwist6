# frozen_string_literal: true

# Handle nitty gritty detail for tags controller
module TagsControllerHelper
  def check_type(tag_type, current_user)
    if tag_type
      TagsByType.call(tag_type: tag_type, current_user: current_user)
    else
      tag_json = Tag.joins(:access).where(
        "accesses.user_id = #{current_user&.id.to_i} or accesses.status = 'PUBLIC'"
      ).as_json(only: %i[id name])
      tag_json.map { |r| { 'Label' => r['name'], 'Value' => r['id'] } }
    end
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
