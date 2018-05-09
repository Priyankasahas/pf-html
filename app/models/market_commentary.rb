# frozen_string_literal: true

class MarketCommentary
  include ActiveModel::Model

  attr_accessor :content, :last_updated_at
end
