# frozen_string_literal: true

# used for populating the recipe form's tag multi select
module TagTypeService
  def tags_by_type(current_user_id)
    type_groups = tag_types_with_access(current_user_id)
    type_groups.each_with_object({}) do |(type_name, tags), formatted_groups|
      formatted_groups[type_name] = tags&.map { |t| { id: t.id, name: t.name } } || []
    end
  end

  private

    def tag_types_with_access(current_user_id)
      Tag.preload(:tag_type).
        joins(:access).
        where("accesses.user_id = #{current_user_id}").
        group_by { |t| t.tag_type.name }
    end
end
