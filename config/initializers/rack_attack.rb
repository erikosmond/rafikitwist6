# frozen_string_literal: true

module Rack
  # will probably remove this in favor of nginx rate limiting
  class Attack
    Rack::Attack.throttle('requests by ip', { limit: 30, period: 1.minute }, &:ip)
  end
end
