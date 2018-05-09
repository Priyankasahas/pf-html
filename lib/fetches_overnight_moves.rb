# frozen_string_literal: true

require 'http_client'

class FetchesOvernightMoves
  def self.fetch(service)
    connection = HttpClient.new(service)
    response = connection.get '/overnight_moves'

    return unless response.body.overnight_move
    details = response.body.overnight_move
    overnight_move = OvernightMove.new
    overnight_move.assign_all(details.slice(:content, :created_at, :updated_at))
    overnight_move
  end
end
