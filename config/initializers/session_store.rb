# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_cookbook_session',
  :secret      => 'c093acc72a81f5b5d2482ace72f3131bae205b820e3ae22dba4cd3ad021f9b0cbff2e5709edf80c23d830b198026206a40be79d0e272d5462e4244479a7a7d4d'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store