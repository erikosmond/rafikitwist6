# frozen_string_literal: true

module Graph
  # Parent class for organizing resources based on user ownership.
  class Index
    attr_reader :hash

    private_class_method :new

    def initialize
      @hash = generate_index
    end

    def self.cache
      return @cache if @cache

      @instance_mutex.synchronize do
        @cache ||= new
      end

      @cache
    end
  end
end
