# frozen_string_literal: true

# class for common form methods
class GeneralForm
  include Interactor

  protected

    def create_access(accessible, status = nil)
      status ||= access_status
      AccessService.create_access!(user.id, accessible, status)
    end

    def access_status
      user.admin? ? 'PUBLIC' : 'PRIVATE'
    end

    def user
      context.user
    end

    def update_parent_tags(record, form)
      non_ingredient_form_ids = form_tag_ids(form)
      non_ingredient_tags = recipe_non_ingredient_tags(record)
      tag_ids_to_create = new_tags(non_ingredient_tags, non_ingredient_form_ids).compact
      tag_ids_to_delete = old_tags(non_ingredient_tags, non_ingredient_form_ids).compact
      create_new_tags(tag_ids_to_create, record)
      delete_tag_selections(record, tag_ids_to_delete)
    end
end
