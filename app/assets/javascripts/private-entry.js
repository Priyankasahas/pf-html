import $ from 'jquery';
import _ from 'lodash';
import intl from 'intl/Intl';
import $profarmer from './private/profarmer';

require('expose?Intl!intl');
require('expose?$!expose?jQuery!jquery');
require('expose?React!react');
require('expose?ReactMount!react-mount');
require('./common/vendor/typed');
require('jquery-ui/ui/widgets/datepicker');
require('jquery-ui/ui/effects/effect-shake.js');
require('jquery-ujs');


$profarmer.components.MerchantPrices = require('./private/components/merchant_prices');
$profarmer.components.MarketCommentary = require('./private/components/market_commentary');
$profarmer.components.SnapshotBinGrades = require('./private/components/snapshot_bin_grades');
$profarmer.components.ClearGrainPrices = require('./private/components/clear_grain_prices');
$profarmer.components.ExchangeMarket = require('./private/components/exchange_market');
$profarmer.components.PriceChart = require('./private/components/price_chart');
$profarmer.components.MarketSnapshot = require('./private/components/market_snapshot');
$profarmer.components.OvernightMove = require('./private/components/overnight_move');
$profarmer.currentSilo = require('./private/components/common/current_silo');
$profarmer.components.MappingContactForm = require('./private/components/mapping_contact_form');
