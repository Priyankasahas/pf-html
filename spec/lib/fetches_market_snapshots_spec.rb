# frozen_string_literal: true

require 'spec_helper'
require 'fetches_market_snapshots'

RSpec.describe FetchesMarketSnapshots do
  context '.fetch' do
    let(:service) do
      double(:service, endpoint: Settings.prices.service,
                       username: Settings.prices.username, password: Settings.prices.password)
    end
    let(:model) { class_double('MarketSnapshot').as_stubbed_const }

    before do
      allow(model).to receive(:new) { |*args| OpenStruct.new(*args) }
    end

    subject { VCR.use_cassette('market_snapshots') { FetchesMarketSnapshots.fetch(service) } }

    it 'should include the latest move content' do
      expect(subject.content).to include('Mixed moves were recorded in offshore markets overnight')
    end

    it 'should include the latest move updated at time stamp' do
      expect(subject.updated_at.to_date).to eq(Date.parse('2017-06-06'))
    end

    it 'should include the latest move created at time stamp' do
      expect(subject.created_at.to_date).to eq(Date.parse('2017-06-06'))
    end
  end
end
