# frozen_string_literal: true

require 'spec_helper'
require 'fetches_silo_pricing_contents'
require 'faraday_middleware'
require 'config'

RSpec.describe FetchesSiloPricingContents do
  context '.fetch' do
    let(:bhc_site_name) { 'Milvale' }
    let(:bulk_handler_code) { 'GNC' }
    let(:grain_type_name) { 'Wheat' }
    let(:snapshot_fetcher) { class_double('FetchesSiloSnapshots').as_stubbed_const }
    let(:pricing_description_fetcher) { class_double('FetchesPricingDescriptions').as_stubbed_const }
    let(:market_commentary_fetcher) { class_double('FetchesMarketCommentaries').as_stubbed_const }
    let(:favourites_fetcher) { class_double('FetchesFavourites').as_stubbed_const }
    let(:snapshot) { double(:snapshot) }
    let(:pricing_description) { double(:pricing_description) }
    let(:market_commentary) { double(:market_commentary) }
    let(:subscriber) { OpenStruct.new(id: Settings.test.id) }
    let(:favourite) do
      OpenStruct.new(
        bhc_site_name: bhc_site_name, bulk_handler_abbreviation: bulk_handler_code, grain_type_name: grain_type_name,
        subscriber_id: subscriber.id, order: 0
      )
    end

    subject { FetchesSiloPricingContents.fetch(bhc_site_name, bulk_handler_code, grain_type_name) }

    context 'given a valid snapshot' do
      before do
        allow(snapshot_fetcher).to receive(:fetch) { snapshot }
        allow(pricing_description_fetcher).to receive(:fetch) { pricing_description }
        allow(market_commentary_fetcher).to receive(:fetch) { market_commentary }
        allow(favourites_fetcher).to receive(:fetch) { [favourite] }
        allow(snapshot).to receive(:valid?) { true }
        allow(snapshot).to receive(:tradable) { true }
        allow(snapshot).to receive(:formatted_error) { nil }
      end

      it 'should include a snapshot' do
        expect(subject.snapshot).to eq(snapshot)
      end

      it 'should include a pricing description' do
        expect(subject.pricing_description).to eq(pricing_description)
      end

      it 'should include a market commentary' do
        expect(subject.market_commentary).to eq(market_commentary)
      end

      it 'should indicate whether the snapshot is valid' do
        expect(subject).to be_valid
      end
    end

    context 'given an invalid snapshot' do
      let(:formatted_error) { 'Invalid Something' }
      before do
        allow(favourites_fetcher).to receive(:fetch) { [favourite] }
        allow(snapshot_fetcher).to receive(:fetch) { snapshot }
        allow(snapshot).to receive(:valid?) { false }
        allow(snapshot).to receive(:formatted_error) { formatted_error }
      end

      it 'should include an invalid snapshot' do
        expect(subject.snapshot).to eq(snapshot)
      end

      it 'should not include a pricing description' do
        expect(subject.pricing_description).to eq(nil)
      end

      it 'should not include a market commentary' do
        expect(subject.market_commentary).to eq(nil)
      end

      it 'should indicate that the snapshot is invalid' do
        expect(subject).not_to be_valid
      end

      it 'should include a formatted error' do
        expect(subject.formatted_error).to eq formatted_error
      end
    end
  end
end
