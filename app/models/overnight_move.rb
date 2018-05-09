# frozen_string_literal: true

class OvernightMove
  include ActiveModel::Model

  attr_accessor :content, :created_at, :updated_at
end
