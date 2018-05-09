# frozen_string_literal: true

require 'spec_helper'
require 'fetches_silo_snapshots'
require 'faraday_middleware'

RSpec.describe FetchesSiloSnapshots do
  context '.fetch' do
    let(:service) { double(:service, endpoint: 'http://localhost:5000', username: Settings.prices.user, password: Settings.prices.password) }
    let(:bhc_site_name) { 'Milvale' }
    let(:bhc_site_state) { 'NSW' }
    let(:bulk_handler_code) { 'GNC' }
    let(:bulk_handler_name) { 'GrainCorp Operations Limited' }
    let(:bulk_handler_short_name) { 'Graincorp' }
    let(:grain_type) { 'Wheat' }
    let(:merchant_price_model) { class_double('MerchantPrice').as_stubbed_const }
    let(:market_price_model) { class_double('MarketPrice').as_stubbed_const }
    let(:bin_grade_model) { class_double('BinGrade').as_stubbed_const }

    before do
      allow(merchant_price_model).to receive(:new) { |args| OpenStruct.new(args) }
      allow(market_price_model).to receive(:new) { |args| OpenStruct.new(args) }
      allow(bin_grade_model).to receive(:new) { |args| OpenStruct.new(args) }
    end

    subject do
      VCR.use_cassette('prices_silo_snapshot') do
        FetchesSiloSnapshots.fetch(service, bhc_site_name, bulk_handler_code, grain_type)
      end
    end

    context 'given a valid site, handler and grain type' do
      it 'should indicate a valid snapshot response' do
        expect(subject).to be_valid
      end

      it 'should include the bhc site name' do
        expect(subject.bhc_site_name).to eq bhc_site_name
      end

      it 'should include the bhc site state' do
        expect(subject.bhc_site_state).to eq bhc_site_state
      end

      it 'should include the bulk handler code' do
        expect(subject.bulk_handler_code).to eq bulk_handler_code
      end

      it 'should include the bulk handler name' do
        expect(subject.bulk_handler_name).to eq bulk_handler_name
      end

      it 'should include the bulk handler short name' do
        expect(subject.bulk_handler_short_name).to eq bulk_handler_short_name
      end

      it 'should include the grain type' do
        expect(subject.grain_type_name).to eq grain_type
      end

      it 'should include the freight rate' do
        expect(subject.freight_rate).to eq '34.25'
      end

      it 'should include the hero bin grade' do
        expect(subject.hero_bin_grade_code).to eq 'APW1'
      end

      it 'should include the bhc site type' do
        expect(subject.bhc_site_type).to eq 'BhcSite'
      end

      it 'should include the pricing label' do
        expect(subject.pricing_label).to eq 'Delivered Site'
      end

      it 'should include whether a port equivalent should be shown' do
        expect(subject.port_equivalent).to eq true
      end

      it 'should include the tradable status' do
        expect(subject.tradable).to eq true
      end

      it 'should include the grain types available for bhc site' do
        expect(subject.grain_types).to eq %w[Wheat Canola Barley]
      end
    end

    context 'given an invalid site, handler or grain type' do
      let(:bhc_site_name) { 'Invalid' }

      it 'should indicate an invalid snapshot response' do
        expect(subject).not_to be_valid
      end
    end

    context 'given a valid site with spaces, handler and grain type' do
      let(:bhc_site_name) { 'Delivered Newcastle Basin' }
      let(:bulk_handler_code) { 'DEL' }

      it 'should indicate a valid snapshot response' do
        expect(subject).to be_valid
      end
    end

    context 'given handler is not provided' do
      let(:bulk_handler_code) { nil }

      it 'should indicate a valid snapshot response' do
        expect(subject).to be_valid
      end
    end
  end
end
