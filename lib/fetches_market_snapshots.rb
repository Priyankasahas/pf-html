# frozen_string_literal: true

require 'http_client'

class FetchesMarketSnapshots
  def self.fetch(service)
    connection = HttpClient.new(service)
    response = connection.get '/market_snapshots'

    return unless response.body.market_snapshot
    details = response.body.market_snapshot
    snap = MarketSnapshot.new
    snap.assign_all(details.slice(:content, :created_at, :updated_at))
    snap
  end
end
