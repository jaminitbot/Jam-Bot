# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.5.1](https://github.com/jamesatjaminit/Jam-Bot/compare/v2.5.0...v2.5.1) (2021-08-18)


### Features

* docker! ([b3ca3b3](https://github.com/jamesatjaminit/Jam-Bot/commit/b3ca3b3508dc8a0111712445f1fc0830b937be19))
* reload command ([39595aa](https://github.com/jamesatjaminit/Jam-Bot/commit/39595aa835005ec9d77753b0a20bb5869846ea40))
* reload.ts uses git pull ([095a5d2](https://github.com/jamesatjaminit/Jam-Bot/commit/095a5d2e673b583eb58d77d10ee844d1dfb387f5))
* use discord timestamps in twitch embex ([6f3ac09](https://github.com/jamesatjaminit/Jam-Bot/commit/6f3ac092552d76b7d80580202071bee7f21fcac6))


### Bug Fixes

* catch errors fetching data from twitch ([09d8fae](https://github.com/jamesatjaminit/Jam-Bot/commit/09d8fae3ff01e899565823ecd49f54b7ec6729db))
* date formatting in uptime command ([a81011b](https://github.com/jamesatjaminit/Jam-Bot/commit/a81011bdf9f47b16a0880718f61ead2bb325ef5b))
* defer reload command reply ([0b04806](https://github.com/jamesatjaminit/Jam-Bot/commit/0b048069c64e4faa6316f7b613b45defaa7628a0))
* fix debug command ([8b7f46a](https://github.com/jamesatjaminit/Jam-Bot/commit/8b7f46a786ea80f5655b19011a8d91ee4368202c))
* fix message edits ([dc63bdd](https://github.com/jamesatjaminit/Jam-Bot/commit/dc63bdd40cdd24df1f89255133b5d869925df8f3))
* remove live ping ([6b09780](https://github.com/jamesatjaminit/Jam-Bot/commit/6b09780f0d67bda623ec14f38380f8fe94f4f719))
* restart policy docker-compose.yml ([670aa15](https://github.com/jamesatjaminit/Jam-Bot/commit/670aa156686b9db07851918f25657da42c3d858e))

## [2.5.0](https://github.com/jamesatjaminit/Jam-Bot/compare/v2.4.1...v2.5.0) (2021-08-13)


### Features

* message edit log ([b08eae1](https://github.com/jamesatjaminit/Jam-Bot/commit/b08eae1d39cd1b5db5e534d35e89f7f08d84fe7c))
* snipe command improvements ([e07445e](https://github.com/jamesatjaminit/Jam-Bot/commit/e07445e828b21f17afb70628cb694c870aece3e5))
* twitch date formatting ([276e10f](https://github.com/jamesatjaminit/Jam-Bot/commit/276e10f0bea2e6071803df5a7727947cdd39fe1f))


### Bug Fixes

* general error checking ([66374e9](https://github.com/jamesatjaminit/Jam-Bot/commit/66374e9a30e8b75fd8df5ccaac0514fcc33366a2))
* make purge command ephemeral ([5ecdc26](https://github.com/jamesatjaminit/Jam-Bot/commit/5ecdc26ecc812dda7413e328217fee46daea5b9c))

### [2.4.1](https://github.com/jamesatjaminit/Jam-Bot/compare/v2.4.0...v2.4.1) (2021-08-13)


### Features

* move slash commands to proper builder ([41a86ef](https://github.com/jamesatjaminit/Jam-Bot/commit/41a86ef8e1cf3bcd2dca6bcb0b9751d53bc68fb5))
* tslib ([b94d600](https://github.com/jamesatjaminit/Jam-Bot/commit/b94d60097198e6ad352f37f0a68da146fd6d20d0))


### Bug Fixes

* remove last updated in twich embed ([59bb22c](https://github.com/jamesatjaminit/Jam-Bot/commit/59bb22c34495f198d873bd251d3c300a1c964af3))

## [2.4.0](https://github.com/jamesatjaminit/Jam-Bot/compare/v2.3.0...v2.4.0) (2021-08-10)


### Features

* awful hardcoded role stuff ([361dc36](https://github.com/jamesatjaminit/Jam-Bot/commit/361dc369515a688b697276ddcfb7c70bd7cfd1c9))
* improve style of delete logs ([18869c0](https://github.com/jamesatjaminit/Jam-Bot/commit/18869c02988279bd08906b0c42df95a9404bd3cb))
* logging timestamps! ([ca9cef7](https://github.com/jamesatjaminit/Jam-Bot/commit/ca9cef72924b48021f3e080f9bd51522a86bebe8))
* support multiple owners ([0c3e95f](https://github.com/jamesatjaminit/Jam-Bot/commit/0c3e95f2e4c4af0328d39c649536a1255d2edeea))


### Bug Fixes

* **deps:** update dependency mongodb to v4 ([#75](https://github.com/jamesatjaminit/Jam-Bot/issues/75)) ([834143f](https://github.com/jamesatjaminit/Jam-Bot/commit/834143f14d288ecf915ee71d3f883ad72fe32541))
* fix compat with new version of mongo ([de38873](https://github.com/jamesatjaminit/Jam-Bot/commit/de3887341a693585938f68e57b48a9ec6f97259b))
* fix delete logs ([b8c6501](https://github.com/jamesatjaminit/Jam-Bot/commit/b8c65018e964b851a1cdcc77541fc5ecabcecb53))
* fix guild roles ([509a847](https://github.com/jamesatjaminit/Jam-Bot/commit/509a8471f1ce94166240e3fc0717e6cd800a0f41))
* fix message delete log v2 ([010cbcf](https://github.com/jamesatjaminit/Jam-Bot/commit/010cbcfec1ed36a054d57eda2ac06206503370b6))
* remove typo ([a6400b8](https://github.com/jamesatjaminit/Jam-Bot/commit/a6400b8fce727ae21ace2986ab0d1990349510b8))
* request guild member intent for roles ([166c9de](https://github.com/jamesatjaminit/Jam-Bot/commit/166c9de6967183d3b9287828fd3254f8c923bab3))

## [2.3.0](https://github.com/jamesatjaminit/Jam-Bot/compare/v2.2.0...v2.3.0) (2021-08-07)


### Features

* add code to prepare for migrating away from slash commands ([fed7024](https://github.com/jamesatjaminit/Jam-Bot/commit/fed7024ad613700bdd67a8e6f6f739ba1f84a46e))
* buttons on ping command? ([930bf8c](https://github.com/jamesatjaminit/Jam-Bot/commit/930bf8c7fb999c72c74ef96dcb07af6ab0f54b80))
* register owner slash commands to dev server ([77cddc0](https://github.com/jamesatjaminit/Jam-Bot/commit/77cddc042191f59bbc27c7a13eb57167fb4c387d))


### Bug Fixes

* fix buttons ([0a90a48](https://github.com/jamesatjaminit/Jam-Bot/commit/0a90a488e7d11bb862354b4aea1c6fd8fcc5f529))
* fix image command ([15dcf24](https://github.com/jamesatjaminit/Jam-Bot/commit/15dcf246080ed0325f1e6ff0fe4f1ddab33b04c4))
* fix image command part 2 ([843b5be](https://github.com/jamesatjaminit/Jam-Bot/commit/843b5be19d6d0776d4d68691a9b5610965d7a759))
* fix image positions less than 1 v2 ([0635ac7](https://github.com/jamesatjaminit/Jam-Bot/commit/0635ac78976893bea10165a0aa51c26655168a58))
* fix owner slash commands ([75a15f2](https://github.com/jamesatjaminit/Jam-Bot/commit/75a15f2afb6785f1e92fa2f6c36ea5613936984d))
* fix permissions checking ([582d9a4](https://github.com/jamesatjaminit/Jam-Bot/commit/582d9a4f0c353fec91047b6954c6e0c94fcc32fe))
* improve say command logic ([51a320c](https://github.com/jamesatjaminit/Jam-Bot/commit/51a320c5a241f2182a745d35aec0e42a095307de))
* no longe position zero ([c721e46](https://github.com/jamesatjaminit/Jam-Bot/commit/c721e460ce775abf8d4385266bdce085f146b539))
* required options before non-required slash commandsa ([0775fba](https://github.com/jamesatjaminit/Jam-Bot/commit/0775fba32bece182a16cc2cdf266c2466e771930))
* typescript compile ([cbd8866](https://github.com/jamesatjaminit/Jam-Bot/commit/cbd8866aef48f244dd49cdff440bca67ad037465))

## [2.2.0](https://github.com/jamesatjaminit/Jam-Bot/compare/v2.1.0...v2.2.0) (2021-08-03)


### Features

* add image slash command ([8907d7e](https://github.com/jamesatjaminit/Jam-Bot/commit/8907d7e4d7bc16ca6f1fb4fc061bc408766024bf))
* add more slash commands ([5594cf3](https://github.com/jamesatjaminit/Jam-Bot/commit/5594cf34b9e1ea18288371b2d2bb64f3185da4da))
* add slash commands functionality to all image commands ([2f23431](https://github.com/jamesatjaminit/Jam-Bot/commit/2f23431366ba6237fda617757f63c682fa6ca811))
* basic functions for slash commands ([d05fa48](https://github.com/jamesatjaminit/Jam-Bot/commit/d05fa48c7745211eb1d9a7f65575754a31726456))
* more slash commands ([3f797ce](https://github.com/jamesatjaminit/Jam-Bot/commit/3f797ceec952e22cc4ad8c0cf4a174cf173ae062))


### Bug Fixes

* check permissions for interactions ([48de7d3](https://github.com/jamesatjaminit/Jam-Bot/commit/48de7d36940cf56dca30124bcab2993de7896ad2))
* deploy slash commands everywhere ([b2c4626](https://github.com/jamesatjaminit/Jam-Bot/commit/b2c46263fe204b0adb36475cbf38d5fec1466d4f))
* fix gif slash command ([c81c97c](https://github.com/jamesatjaminit/Jam-Bot/commit/c81c97c0757a6d8ac0030052a1da9b983fc3d45c))
* handle if the bot can't react to the poll ([e1f5efb](https://github.com/jamesatjaminit/Jam-Bot/commit/e1f5efbcb946221dd5214bf9ba2b3d8a10c7ac3f))
* improve styling of slash commands ping command ([c414682](https://github.com/jamesatjaminit/Jam-Bot/commit/c414682b862b8eac00f20958cf7a4375e6081033))

## [2.1.0](https://github.com/jamesatjaminit/Jam-Bot/compare/v2.0.0...v2.1.0) (2021-08-02)


### Features

* slash commands! ([37d1fc8](https://github.com/jamesatjaminit/Jam-Bot/commit/37d1fc88321d95d9c11d75f6dcffacda422d9d31))

## [2.0.0](https://github.com/jamesatjaminit/Jam-Bot/compare/v1.1.1...v2.0.0) (2021-08-02)


### Features

* upgrade to discord.js v13 ([c3e2f0a](https://github.com/jamesatjaminit/Jam-Bot/commit/c3e2f0a55575a867334875a0f9bb8a2c58517a66))


### Bug Fixes

* fix unmanagable users to getting banned ([a12d8f3](https://github.com/jamesatjaminit/Jam-Bot/commit/a12d8f30e4cb40435abe833ba990b85757fbd1fd))
* remove autorole as it causes issues with verification level ([caa0e9d](https://github.com/jamesatjaminit/Jam-Bot/commit/caa0e9def8f1fc3cf590538e7cd03301486b8a22))
* update snipe formatting ([78a3cab](https://github.com/jamesatjaminit/Jam-Bot/commit/78a3cab5ad0b90961690b8904bd6815fc0fdf88d))
* use relative timestamps ([bbf7434](https://github.com/jamesatjaminit/Jam-Bot/commit/bbf743442e5a1d9112b9022cbc3c60a992a7ae71))

### [1.1.1](https://github.com/jamesatjaminit/Jam-Bot/compare/v1.1.0...v1.1.1) (2021-07-27)


### Features

* improve dm code ([ce8b1d5](https://github.com/jamesatjaminit/Jam-Bot/commit/ce8b1d584209820fbb95b02346f585cdf9e8306e))
* reimplement dm code ([00ea113](https://github.com/jamesatjaminit/Jam-Bot/commit/00ea113796e8a61ebe322ac782be0f030f75bd5a))


### Bug Fixes

* commands that aren't allowed in dms not running ([e381146](https://github.com/jamesatjaminit/Jam-Bot/commit/e3811465d923c6450842c5cc02293ed0c047bd35))
* fix footer in twitch notifications ([43b082b](https://github.com/jamesatjaminit/Jam-Bot/commit/43b082b733021a62ee25dc3ebb7b71cbc1046df3))
* update type in collectionCommand ([c13fe26](https://github.com/jamesatjaminit/Jam-Bot/commit/c13fe26353c4591ab938635e6307c92293afacb8))

## [1.1.0](https://github.com/jamesatjaminit/Jam-Bot/compare/v1.0.2...v1.1.0) (2021-07-24)


### Features

* allow certain commands to be run in dms ([8c4525c](https://github.com/jamesatjaminit/Jam-Bot/commit/8c4525c515b6046795cb8ee6b12b2beab03958e6))
* use timestamp of change in changelog command ([0ed7fad](https://github.com/jamesatjaminit/Jam-Bot/commit/0ed7fad21937209837888b257fc2a146500f4bd6))


### [1.0.1](https://github.com/jamesatjaminit/Jam-Bot/compare/v1.0.0...v1.0.1) (2021-07-23)


### Bug Fixes

* fix changelog url in changelog command ([99a25ff](https://github.com/jamesatjaminit/Jam-Bot/commit/99a25ff65d935459a734be3747c02eefbd28a5c4))

## 1.0.0 (2021-07-23)


### Features

* add commitlint ([d238f50](https://github.com/jamesatjaminit/Jam-Bot/commit/d238f506b0641b4efe32ff22b356cfba40bf1b2e))
* allow OWNER permission to be specified in command exports ([50df166](https://github.com/jamesatjaminit/Jam-Bot/commit/50df1660bfb6eb9dd30a62cde0843f94fb8869de))


### Bug Fixes

* fix capitalisation to allow bot to work ([e89148e](https://github.com/jamesatjaminit/Jam-Bot/commit/e89148eba213ec1751bd4abf8f931ce8bd1777ae))
