# Profarmer Discovery Website

This particular project implements the public website component of the Profarmer Discovery product, ie. http://www.profarmergrain.com.au

[![Build status](https://badge.buildkite.com/0c7924a0db02c580d5a693963a990617ce8717cc5afc3c8297.svg)](https://buildkite.com/nzx/profarmer-discovery-web-site)

# Technology

## Data

No local storage, JSON content provided by prices and subscribers services

## Platform

- Ruby on Rails 4.2.x with Ruby 2.2.x, RSpec isolation & integration test suite
  - Dependencies specified in Gemfile
- React 0.13.x with Alt Flux & JavaScript ES6
  - Dependencies specified in package.json

## Deployment

Amazon OpsWorks managing layers of EC2 instances, Amazon Elastic Load Balancer

## Tests

Tests written using RSpec. Style validation via Rubocop.

````
$ rspec && rubocop
````

Testing Philosophy, following recommendations in https://www.destroyallsoftware.com/screencasts/catalog/web-apps-when-to-test-in-isolation, ie:

- routes & controllers - integration using RSpec feature tests
- lib classes - isolation
- models - integration
- query classes - integration
- service wrappers - integration with client library
- presenters - isolation
- views - isolation, only when a conditional is present
- network - isolation via VCR

## Contributions

Contributions prepared on feature branches with a GitHub Pull Request, BuildKite provides
continuous integration and pull request commit status, peer PR code review per pull request, and automatic deployment via OpsWorks of merges
into master to test environment/production

### Notes

Non active record based Rails application, see lib/fetches*.rb classes for clients accessing remote data from the prices and subscribers
service endpoints. Uses Faraday as the underlying http client.

React used to render dynamic content in templates via 2 asset pipelines - public & private.

Public is the asset pipeline for public (ie. unauthenticated) users (formerly application.js in a generated rails app). Private is the asset
pipeline used for authenticated users viewing pages post sign in. The actual Rails asset pipelines themselves are now only delivery mechanisms
for a Webpack managed JavaScript infrastructure. See private-entry.js for the Webpack entry points that generate a private and common bundle included by these defined asset pipelines.

See config/webpack.config.js for Webpack configuration and package.json for configured dependencies.

Gulp is used to monitor changes to JavaScript files and regenerate the bundles. Currently these bundles are checked in but we'll revisit this shortly.

# Architecture

The following descriptions provide an overview of the overall system.

The overall Profarmer Discovery architecture consists of a set of micro-services that provide units of functionality across the wider Profarmer Discovery feature set.

- Discovery Website

Website providing public and authenticated subscriber access to content

- Discovery Admin

Website providing Profarmer staff with access to system and content administration

- Discovery Prices

JSON API only service providing access to price content

- Discovery Subscribers

JSON API only service providing access to subscriber details and information. Maintains subscription information again data feeds from Fremantle Tech

- Discovery Data Feeds

CSV API providing access to paid data feeds.

# Running the overall system

## Code

Checkout the following projects in a ~/src/profarmer directory from Git:

- profarmer-discovery-html
- profarmer-discovery-admin
- profarmer-discovery-prices
- profarmer-discovery-subscribers
- profarmer-discovery-feeds

Run bundle in each project.

## Databases

'prices' and 'subscribers' require MySQL 5.6 database configurations in their config/database.yml files respectively.

### Prices

bin/snapshot.mysql will create a database structure, populated with data from an exchange database with the correct tables, indexes, stored
procedures, etc. It assumed a development exchange database available at 'exchange_development', and a prices development available

````
$> mysql -u root profarmer_discovery_prices_development < bin/snapshot.mysql
````

### Subscribers

Development database currently requires manual creation, contact MC/PP for a snapshot until we've created a mysql script, or alternatively
configured your admin/html site config/secrets.yml to use the Amazon test environment's subscribers service.

## Starting/stopping

Create the following Procfile in ~/src/profarmer

````
web: subcontract --chdir profarmer-discovery-html --signal INT -- rails s -p 3000
webgulp: subcontract --chdir profarmer-discovery-html --signal INT -- gulp
admin: subcontract --chdir profarmer-discovery-admin --signal INT -- rails s -p 3001
admingulp: subcontract --chdir profarmer-discovery-admin --signal INT -- gulp
subscribers: subcontract --chdir profarmer-discovery-subscribers --signal INT -- rails s -p 4000
prices: subcontract --chdir profarmer-discovery-prices --signal INT -- rails s -p 5000
feeds: subcontract --chdir profarmer-discovery-feeds --signal INT -- rails s -p 7000
````

Install foreman and subcontractor gem, running 'foreman start' in the ~/src/profarmer directory will start all services and run the under commonly
defined ports.

View http://localhost:3000 for the public/subscriber front end, http://localhost:3001 for the administration front end.

# Test system

An Amazon hosted test environment is available on demand at:

- public/subscriber website: http://discovery-web-1087150831.us-west-2.elb.amazonaws.com
- admin website: http://discovery-admin-904875306.us-west-2.elb.amazonaws.com

The prices and subscriber services are also available to use from Amazon rather than needing to run them on your local development environment. Check
the AWS OpsWorks load balancer configurations for their addresses.

(Note these test environments are enable/disabled manually based on demand for use, and hence aren't available 24/7 unless required)

## Useful links

http://clarkdave.net/2015/01/how-to-use-webpack-with-rails/
https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html
https://github.com/greenish/react-mount
https://github.com/goatslacker/alt
https://facebook.github.io/jest/
