# CIR Amazon FulFillment centers map

## Development
### Prerequisites

#### If you're new to Ruby

##### Use [rbenv](https://github.com/rbenv/rbenv) to manage Ruby versions.
- If you need to install rbenv on MacOS, [installation with Homebrew](https://github.com/rbenv/rbenv#homebrew-on-macos) is easiest. Make sure you follow the directions to set up rbenv in your shell.
##### Installing Ruby



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
