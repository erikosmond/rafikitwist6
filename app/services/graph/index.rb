# frozen_string_literal: true

module Graph
  # Parent class for organizing resources based on user ownership.
  class Index
    include Singleton
    # TODO: maybe don't expose :hash so we can enforce the mutex in this class
    attr_reader :hash

    private_class_method :new

    def initialize
      Rails.logger.warn('creating index')
      @hash = generate_index
    end

    def self.cache
      return @cache if @cache

      @instance_mutex.synchronize do
        @cache ||= new
      end

      @cache
    end

    def self.fetch(id)
      binding.pry
      @instance_mutex.synchronize do
        Index.cache.hash[id]
      end
    end

    def reset
      @hash = generate_index if Rails.env.test?
    end
  end
end
