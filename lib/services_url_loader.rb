# frozen_string_literal: true

require 'service'
module ServicesUrlLoader
  def prices_service_url
    Service.new(Settings.prices.service, Settings.prices.username, Settings.prices.password)
  end

  def clear_grain_service_url
    Service.new(Settings.clear.service, nil, nil)
  end
end
