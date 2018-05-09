# frozen_string_literal: true

class MarketPrice
  include ActiveModel::Model

  attr_accessor :price_high_movement, :price, :price_fis, :port_price, :prices_last_updated_at
end
