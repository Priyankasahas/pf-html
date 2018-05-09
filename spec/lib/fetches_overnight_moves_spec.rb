# frozen_string_literal: true

require 'spec_helper'
require 'fetches_overnight_moves'

RSpec.describe FetchesOvernightMoves do
  context '.fetch' do
    let(:service) do
      double(:service, endpoint: Settings.prices.service,
                       username: Settings.prices.username, password: Settings.prices.password)
    end
    let(:model) { class_double('OvernightMove').as_stubbed_const }

    before do
      allow(model).to receive(:new) { |*args| OpenStruct.new(*args) }
    end

    subject { VCR.use_cassette('overnight_moves') { FetchesOvernightMoves.fetch(service) } }

    it 'should include the latest move content' do
      expect(subject.content).to include('wheat down')
    end

    it 'should include the latest move updated at time stamp' do
      expect(subject.updated_at).to eq '2017-06-06 09:40:15 +1000'
    end

    it 'should include the latest move created at time stamp' do
      expect(subject.created_at).to eq '2017-06-06 09:40:15 +1000'
    end
  end
end
