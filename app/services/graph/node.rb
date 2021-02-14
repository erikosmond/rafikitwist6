# frozen_string_literal: true

module Graph
  # Parent class for resources in indexed graph. Child classes must have @access set.
  class Node
    delegate :status, :user_id, to: :@access
    attr_reader :access

    def self.subjective_tags(recipe_ids, user)
      return [] if user.nil? || recipe_ids.empty?

      # IMPROVE: call out to async class that queries subjective tags
      ::TagSelection.
        select('tag_selections.id, tags.id AS tag_id, tag_selections.body,
                tags.name AS tag_name, tag_selections.taggable_id, tag_types.name').
        joins([:access, { tag: :tag_type }]).
        where("accesses.user_id = #{user.id}").
        where("tag_selections.taggable_type = 'Recipe'").
        where("accesses.accessible_type = 'TagSelection'").
        where("tag_selections.taggable_id IN (#{recipe_ids.join(', ')})")
      # maybe not necissary to filter by tag types, cuz what else would return?
      # where("tag_types.name IN ('#{::Tag::SUBJECTIVE_TAG_TYPES.join("', '")}')")
    end

    def self.subjective_enrichment(recipes, subjective_data)
      cloned_recipes = recipes.map(&:copy)
      recipe_id_hash = cloned_recipes.group_by(&:id)
      subjective_data.each do |sd|
        recipe_list = recipe_id_hash[sd.taggable_id]
        subjective_assignment(recipe_list&.first, sd)
      end
      cloned_recipes
    end

    def self.subjective_assignment(recipe, row)
      return unless recipe

      hash = subjective_hash(row)

      case row.name
      when 'Comment'
        recipe.append_comment_tag_hash_array(hash)
      when 'Priority'
        recipe.append_priority_tag_hash_array(hash)
      when 'Rating'
        recipe.append_rating_tag_hash_array(hash)
      end
    end

    def self.subjective_hash(data)
      {
        id: data.id,
        tag_id: data.tag_id,
        body: data.body,
        tag_name: data.tag_name
      }
    end

    def viewable?(user)
      status == 'PUBLIC' || user_id == user&.id || user&.admin?
    end
  end
end
