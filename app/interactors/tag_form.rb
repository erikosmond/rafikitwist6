# frozen_string_literal: true

# class for handling params from tag form
class TagForm < GeneralForm
  def call
    context.result = case context.action
                     when :create
                       create(context.params)
                     end
  end

  private

    def create(params)
      # TODO: initialize tag and build all associations, then save
      tag = create_tag!(params)
      create_parent_tags(params, tag)
      create_access(tag)
      context.tag = tag_with_type(tag)
    end

    def create_tag!(params)
      Tag.create!(
        {
          name: params['name'],
          tag_type_id: params['tag_type_id'],
          description: params['description']
        }
      )
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
end
