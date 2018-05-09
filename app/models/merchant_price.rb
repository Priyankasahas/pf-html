# frozen_string_literal: true

class MerchantPrice
  include ActiveModel::Model

  attr_accessor :merchant, :movement, :price, :port_price, :created_at
end
