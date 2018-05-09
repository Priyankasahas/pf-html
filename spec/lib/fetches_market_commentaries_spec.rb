# frozen_string_literal: true

require 'spec_helper'
require 'active_support/all'
require 'fetches_market_commentaries'
require 'ostruct'
require 'faraday_middleware'

RSpec.describe FetchesMarketCommentaries do
  context '.fetch' do
    let(:service) { double(:service, endpoint: Settings.prices.service, username: Settings.prices.username, password: Settings.prices.password) }
    let(:grain_type_name) { 'Wheat' }
    let(:model) { class_double('MarketCommentary').as_stubbed_const }

    before do
      allow(model).to receive(:new) { |args| OpenStruct.new(args) }
    end

    context 'given a valid grain type name' do
      subject { VCR.use_cassette('market_commentary') { FetchesMarketCommentaries.fetch(service, grain_type_name) } }

      it 'should include a market commentary Hash' do
        expect(subject).to be_kind_of(Hash)
      end

      it 'should include a market commentary content' do
        expect(subject.content).to include('wheat crop')
      end

      it 'should include market commentary last updated at' do
        expect(subject.last_updated_at.to_date).to eq(Date.parse('23 Feb 2017'))
      end
    end

    context 'given an invalid grain type' do
      subject { VCR.use_cassette('market_commentary') { FetchesMarketCommentaries.fetch(service, 'invalid') } }

      it 'should return nil' do
        expect(subject).to eq nil
      end
    end
  end
end
