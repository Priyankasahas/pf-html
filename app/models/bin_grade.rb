# frozen_string_literal: true

class BinGrade
  include ActiveModel::Model

  attr_accessor :code, :description, :seasons
end
