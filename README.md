# CIR Amazon FulFillment centers map

## Development
### Prerequisites
- Ruby version ruby 2.6.1p33
Preferably managed by `rbenv`

- Middleman
```sh
gem install middleman
```

- Yarn
```sh
brew install yarn
```
### setup
Run the following commands at the root of the project
```sh
bundle install
yarn install
```
### Running the project
Run
```sh
bundle exec foreman start
```

Open http://localhost:4567 

### Building a static version of the project
```sh
bundle exec middleman build
```
