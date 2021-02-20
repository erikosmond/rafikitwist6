# frozen_string_literal: true

# Controller for serving the SPA
class PagesController < ApplicationController
  PRIORITY_TAG_NAME = 'Priority'
  RATING_TAG_NAME = 'Rating'
  HOME_TAG_NAME = 'Featured Cocktails'

  def home
    assign_meta_tag_name
    priority_tags = TagType.find_by_name(PRIORITY_TAG_NAME).tags
    rating_tags = TagType.find_by_name(RATING_TAG_NAME).tags
    set_home_vars
    set_constant_tags
    set_subjective_tags(rating_tags, priority_tags)
  end

  private

    def set_home_vars
      @first_name = current_user&.first_name
      @home_tag_id = (Tag.find_by_name(HOME_TAG_NAME) || Tag.first).id
      @signed_in = current_user&.id&.to_i&.positive?
    end

    def set_subjective_tags(rating_tags, priority_tags)
      @priorities = priority_tags.each_with_object({}) { |t, obj| obj[t.name] = t.id }
      @ratings = rating_tags.select { |r| r.name.include?('star') }.
                 each_with_object({}) { |t, obj| obj[t.name] = t.id }
    end

    def set_constant_tags
      @all_tags = Tag.all.each_with_object({}) { |t, obj| obj[t.id] = t.name }
      @all_tag_types = TagType.all.each_with_object({}) { |t, obj| obj[t.id] = t.name }
      @comment_tag_id = Tag.comment_tag.id
      @tag_groups = Tag.ingredient_group_hierarchy_filters(current_user)
      @tags_by_type = Tag.tags_by_type
    end

    def assign_meta_tag_name
      arr = request.env['REQUEST_PATH']&.split('/') || []
      if arr.size == 4 && arr[1] == 'tags'
        @tag = Tag.find_by_id arr[2]
      elsif arr.size == 3 && arr[1] == 'recipes'
        @recipe = Recipe.find_by_id arr[2]
      end
    end
end
