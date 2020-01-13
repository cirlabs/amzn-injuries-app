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
### Setup
After installing prerequisites, run the following commands at the root of the project
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

### Deploying the project
First build a static version of the project using the following command
```sh
bundle exec middleman build
```

Now copy contents of `./build` folder to the amazon S3 bucket.

> PS: If you have developer access keys, you can add a ∏rake task to automate this.

### Updating data
Because of a breaking change in Google Drive and Sheets API, the data update process includes manual steps at the moment.

1. Manually update `data/amazon.json` file
Convert contents of the Google Sheet to json using a CSV to JSON converter such as [csv2json](https://www.csvjson.com/csv2json)

> The json output should be a hash where the facility codes are the keys and each row is an array attached to the key. See `data\amazon.json` for reference

2. Remove `/` from key names
To prevent processing errors, rename

 `(Injury Rate)/(5.2, Industry Injury Rate)`

 to

 `(Injury Rate)(5.2, Industry Injury Rate)`

  and

 `(Serious Injury Rate)/(4, Industry Serious Injury Rate for 2018)`

 to

 `(Serious Injury Rate)(4, Industry Serious Injury Rate for 2018)`

 3. Run script to process data
 Run
 `bundle exec ruby ./scripts/process_data.rb`
