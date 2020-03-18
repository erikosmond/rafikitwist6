# frozen_string_literal: true

# Used to populate the dropdown menus of ingredients at the top of the page
class TagsByType
  include Interactor

  def call
    tag_type = context.tag_type
    type_ids = tag_types(tag_type).pluck(:id)
    tag_json = fetch_tag_json(tag_type, type_ids)
    context.json = tag_json.sort_by { |t| t['name'] }.map do |r|
      { 'Label' => r['name'], 'Value' => r['id'] }
    end
  end

  private

    def tags_by_type_ids(type_ids)
      result = Tag.joins(tag_selections: :access).
               where(tag_type_id: type_ids).
               where("accesses.status = 'PUBLIC' OR accesses.user_id =
          #{context.current_user.id}")
      result.each_with_object({}) { |ts, obj| obj[ts.id] = ts.name }.
        each_with_object([]) { |(k, v), arr| arr << { 'id' => k, 'name' => v } }
    end

    def tag_types(tag_type)
      ingredient_types = TagType::INGREDIENT_TYPES
      if tag_type.to_s.casecmp('ingredients').zero?
        TagType.where(name: ingredient_types)
      elsif tag_type
        TagType.where.not(name: ingredient_types)
      else
        TagType.all
      end
    end

    def fetch_tag_json(tag_type, type_ids)
      if tag_type.to_s.casecmp('ingredients').zero?
        Tag.where(tag_type_id: type_ids).as_json(only: %i[id name])
      else
        tags_by_type_ids(type_ids)
      end
    end
end
