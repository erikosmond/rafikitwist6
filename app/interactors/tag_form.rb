# frozen_string_literal: true

# class for handling params from tag form
class TagForm < GeneralForm
  def call
    context.result = case context.action
                     when :create
                       create(context.params)
                     when :edit
                       edit(context.params)
                     when :update
                       update(context.params)
                     end
  end

  private

    def create(params)
      ActiveRecord::Base.transaction do
        new_tag = Tag.new
        tag = assign_tag_attrs!(new_tag, params)
        create_parent_tags(params, tag)
        create_access(tag)
        context.tag = tag_with_type(tag)
      end
    end

    def assign_tag_attrs!(tag, params)
      tag.update!(
        {
          name: params['name'],
          tag_type_id: params['tag_type_id'],
          description: params['description'],
          recipe_id: recipe_id(params)
        }
      )
      tag
    end

    def create_parent_tags(params, tag)
      tag_ids = params['parent_tags']&.map { |t| t['id'] }
      tag_ids&.each do |id|
        ts = TagSelection.create!(tag_id: id, taggable: tag)
        create_access(ts)
      end
    end

    def tag_with_type(tag)
      result = tag.as_json
      result['tag_type'] = tag.tag_type.name.camelize(:lower)
      result
    end

    def recipe_id(params)
      id = params['recipe_id'].to_i
      id.zero? ? nil : id
    end

    def edit(params)
      Tag.find(params['id']).as_json(
        {
          include: {
            parent_tags: {
              only: %i[id name]
            }
          },
          only: %i[id name description tag_type_id recipe_id]
        }
      )
    end

    def update(params)
      ActiveRecord::Base.transaction do
        existing_tag = Tag.find params[:form_fields]['id']
        tag = assign_tag_attrs!(existing_tag, params[:form_fields])
        update_parent_tags(tag, params[:form_fields])
        context.tag = tag_with_type(tag)
      end
    end

    def update_parent_tags(record, form)
      parent_tag_ids = form['parent_tags']&.map { |t| t['id'] } || []
      record.parent_tags = Tag.where(id: parent_tag_ids)
    end
end
