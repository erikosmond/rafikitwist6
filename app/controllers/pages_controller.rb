# frozen_string_literal: true

class PagesController < ApplicationController
  def home
    starting_tag = Tag.find_by_name('Erik Osmond') || Tag.first
    all_tags = Tag.all.each_with_object({}) { |t, obj| obj[t.id] = t.name }
    all_types = TagType.all.each_with_object({}) { |t, obj| obj[t.id] = t.name }
    rating_tags = TagType.find_by_name('Rating').tags
    priority_tags = TagType.find_by_name('Priority').tags
    @home_tag_id = starting_tag.id
    @comment_tag_id = Tag.comment_tag.id
    @first_name = current_user.first_name
    @all_tags = all_tags
    @all_tag_types = all_types
    @tag_groups = Tag.ingredient_group_hierarchy_filters(current_user)
    @tags_by_type = Tag.tags_by_type
    @ratings = rating_tags.each_with_object({}) { |t, obj| obj[t.name] = t.id }
    @priorities = priority_tags.each_with_object({}) { |t, obj| obj[t.name] = t.id }
  end
end
