# frozen_string_literal: true

module Graph
  # Parent class for organizing resources in a cache.
  class Index
    include Singleton

    attr_reader :hash

    def initialize
      @hash = generate_index
    end

    def fetch(id)
      from_hash(id)
    end

    def fetch_by_user(id, user)
      node = from_hash(id)
      return node if node.viewable?(user)
    end

    def fetch_mods_by_user_id(id, user_id = 0)
      mods = @hash[user_id.to_i].try(:[], id.to_i) || []
      return mods if user_id.to_i.zero?

      public_mods = @hash[0].try(:[], id.to_i) || []
      (mods + public_mods).uniq.compact
    end

    def all_by_user(user)
      @hash.values.select { |i| i.viewable?(user) }
    end

    def reset
      # As resources are rebuilt for different test cases,
      # the index must be updated to reflect the new records
      @hash = generate_index if Rails.env.test?
    end

    def user_id_key(access)
      return 0 if access.status == 'PUBLIC'

      access.user_id
    end

    protected

      def add_to_hash(value_id, key_id, access)
        user_hash = @hash[user_id_key(access)] || {}
        modifications = user_hash[key_id] || []
        modifications << value_id
        user_hash[key_id] = modifications.uniq.compact
        @hash.merge!({ user_id_key(access) => user_hash })
      end

    private

      def from_hash(id)
        @hash[id.to_i]
      end

      def generate_index
        raise ::NotImplementedError
      end
  end
end
