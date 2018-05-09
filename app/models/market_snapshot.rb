# frozen_string_literal: true

class MarketSnapshot
  include ActiveModel::Model

  attr_accessor :content, :created_at, :updated_at
end
