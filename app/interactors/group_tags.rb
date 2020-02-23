# frozen_string_literal: true

# Group tag's tag heirarchy by type, i.e. grandchild_tag, grandparent_tag, etc.
class GroupTags
  include Interactor

  def call
    json_fields = %i[id name description tag_type_id recipe_id]
    tag_json = context.tag.as_json(only: json_fields)
    context.tags_with_hierarchy.each do |t|
      tag_groups.each do |g|
        tag_json["#{g}s"] ||= {}
        group_tags(tag_json, t, g)
      end
    end
    sister_tags(tag_json)
    context.json = tag_json
  end

  private

    def sister_tags(tag_json)
      tag_json['sister_tags'] = {}
      context.sister_tags.each do |s|
        tag_json['sister_tags'][s.id] = s.name
      end
    end

    def group_tags(tags_json, tags, group)
      return unless tags["#{group}_id"] && tags["#{group}_name"]

      tags_json["#{group}s"][tags["#{group}_id"]] = tags["#{group}_name"]
    end

    def tag_groups
      groups = %i[
        tag
        child_tag
        modification_tag
        modified_tag
      ]
      groups << :grandchild_tag unless ingredient_type?
      groups << :grandparent_tag unless ingredient_type?
      groups << :parent_tag unless family_type?
      groups
    end

    def ingredient_type?
      context.tag.tag_type_id == TagType.type_id
    end

    def family_type?
      context.tag.tag_type_id == TagType.family_id
    end
end
